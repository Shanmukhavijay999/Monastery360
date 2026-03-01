// Gemini AI Integration for Monastery360
const GEMINI_API_KEY = "AIzaSyBF-LUAd2Gtm3qhDLr1sHb1Apc7KEQqw9E";

// Models to try in order — lighter models have higher rate limits
const MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
];

const getApiUrl = (model: string) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are "Dharma Guide" — an expert AI assistant for Monastery360, a digital heritage platform showcasing over 200 sacred Buddhist monasteries of Sikkim, India. You are warm, wise, and deeply knowledgeable.

Your expertise includes:
- **Sikkim Monasteries**: Rumtek (Kagyu, est. 1740), Pemayangtse (Nyingma, est. 1705), Tashiding (Nyingma, est. 1717), Enchey (Nyingma, est. 1909), and all other monasteries
- **Buddhist traditions**: Kagyu, Nyingma, Gelug, and Sakya lineages
- **Cultural heritage**: Thangka paintings, murals, sacred manuscripts, Cham dances, Losar festival
- **Travel & Pilgrimage**: Best seasons, routes, accommodation, etiquette, dress codes
- **History**: 17th-century origins, royal patronage, preservation efforts
- **Meditation & Practices**: Buddhist philosophy, meditation guidance, mantra meanings

Guidelines:
- Keep responses concise (2-4 paragraphs max) but informative
- Use warm, respectful language
- Include specific facts and details when possible
- Recommend relevant sections of the Monastery360 platform
- If asked about non-monastery topics, gently redirect to your expertise area
- Use emoji sparingly for warmth 🙏`;

export interface GeminiMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

// Helper: delay for backoff
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Core API call to a single model — returns text on success, throws on failure
async function callWithRetry(
    model: string,
    body: object,
    retries: number = 3,
): Promise<string> {
    for (let attempt = 0; attempt < retries; attempt++) {
        if (attempt > 0) {
            // Longer backoff: 3s, 8s, 15s — free tier limits are per-minute
            const backoffMs = [3000, 8000, 15000][attempt - 1] || 15000;
            console.log(`⏳ Waiting ${backoffMs / 1000}s before retry #${attempt + 1} on ${model}...`);
            await delay(backoffMs);
        }

        try {
            console.log(`🔄 Calling ${model} (attempt ${attempt + 1}/${retries})...`);

            const response = await fetch(getApiUrl(model), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            // Rate limited — retry if attempts remain
            if (response.status === 429) {
                console.warn(`⚠️ 429 Rate limited on ${model} (attempt ${attempt + 1})`);
                if (attempt < retries - 1) continue;
                throw new Error("RATE_LIMITED");
            }

            // Auth error — don't retry
            if (response.status === 403) {
                throw new Error("AUTH_ERROR");
            }

            // Model not found — don't retry
            if (response.status === 404) {
                throw new Error("MODEL_NOT_FOUND");
            }

            // Other server error — retry
            if (!response.ok) {
                const errBody = await response.json().catch(() => ({}));
                const msg = errBody?.error?.message || `HTTP ${response.status}`;
                console.error(`❌ ${model} error: ${msg}`);
                if (attempt < retries - 1) continue;
                throw new Error(`SERVER_ERROR: ${msg}`);
            }

            // Success — extract text
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                const reason = data.candidates?.[0]?.finishReason;
                if (reason === "SAFETY") {
                    return "I appreciate your question, but I need to keep our conversation focused on monastery heritage and Buddhist culture. Could you rephrase your question? 🙏";
                }
                // Treat empty response as retriable
                if (attempt < retries - 1) continue;
                throw new Error("EMPTY_RESPONSE");
            }

            console.log(`✅ Success from ${model}`);
            return text;
        } catch (err: any) {
            // Re-throw our typed errors
            if (
                err.message === "RATE_LIMITED" ||
                err.message === "AUTH_ERROR" ||
                err.message === "MODEL_NOT_FOUND" ||
                err.message === "EMPTY_RESPONSE" ||
                err.message?.startsWith("SERVER_ERROR")
            ) {
                throw err;
            }
            // Network/fetch errors — retry
            console.error(`🌐 Network error on ${model}:`, err.message);
            if (attempt < retries - 1) continue;
            throw new Error(`NETWORK_ERROR: ${err.message}`);
        }
    }
    throw new Error("EXHAUSTED");
}

export async function sendMessageToGemini(
    userMessage: string,
    conversationHistory: GeminiMessage[] = []
): Promise<string> {
    // Build request
    const contents: GeminiMessage[] = [
        ...conversationHistory,
        { role: "user", parts: [{ text: userMessage }] },
    ];

    const requestBody = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        },
    };

    // Try each model; on rate-limit or model-not-found, fall back to next
    let sawRateLimit = false;
    let lastErrorType = "";

    for (let i = 0; i < MODELS.length; i++) {
        const model = MODELS[i];
        try {
            const text = await callWithRetry(model, requestBody);
            return text;
        } catch (err: any) {
            lastErrorType = err.message || "";
            console.log(`💡 ${model} failed: ${lastErrorType}`);

            if (lastErrorType === "RATE_LIMITED") {
                sawRateLimit = true;
                // Fall through to try the next model
                continue;
            }
            if (lastErrorType === "MODEL_NOT_FOUND") {
                continue; // Skip this model
            }
            if (lastErrorType === "AUTH_ERROR") {
                return "⚠️ The AI API key appears to be invalid or restricted. Please update the key in src/lib/gemini.ts or get a free key at https://aistudio.google.com/apikey";
            }
            // For server errors or network errors, try next model
            continue;
        }
    }

    // All models failed — return a helpful message
    console.error("❌ All Gemini models failed. Last error:", lastErrorType);

    if (sawRateLimit) {
        return "⏳ You've hit the API rate limit. The free Gemini API allows ~15 requests per minute. Please wait about 30-60 seconds and try again. 🙏";
    }
    if (lastErrorType.includes("NETWORK")) {
        return "🌐 Unable to connect to the AI service. Please check your internet connection and try again.";
    }
    return `❌ The AI service returned an error: ${lastErrorType}. Please try again in a moment. 🙏`;
}

export async function generateTripPlan(preferences: {
    days: number;
    interests: string[];
    pace: string;
}): Promise<string> {
    const prompt = `Create a ${preferences.days}-day monastery pilgrimage itinerary for Sikkim with these preferences:
- Interests: ${preferences.interests.join(", ")}
- Pace: ${preferences.pace}

Include: monastery names, best times to visit, travel tips, what to see, cultural etiquette, and spiritual activities. Format it as a day-by-day plan with clear headings. Use emojis for visual appeal.`;

    return sendMessageToGemini(prompt);
}

export async function generateQuiz(): Promise<string> {
    const prompt = `Generate a quiz with exactly 5 multiple-choice questions about Sikkim's monasteries and Buddhist culture. Format EXACTLY as JSON array:
[
  {
    "question": "The question text?",
    "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
    "correct": 0,
    "explanation": "Brief explanation"
  }
]
Return ONLY the JSON array, no other text.`;

    return sendMessageToGemini(prompt);
}

export async function getMonasteryInsight(monasteryName: string): Promise<string> {
    const prompt = `Tell me fascinating facts about ${monasteryName} in Sikkim, India. Include:
1. A surprising historical fact
2. Architectural highlights
3. Spiritual significance
4. Best time to visit
5. A local legend or story associated with it
Keep it engaging and informative in about 3-4 paragraphs.`;

    return sendMessageToGemini(prompt);
}
