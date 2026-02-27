// Quick test script for Gemini API
const API_KEY = "AIzaSyCJEGVpG3NjybFcqFsXR7g3IT2ZaOK2ePw";
const MODELS = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash"];

async function testModel(model) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "Say hello in exactly 5 words" }] }],
            }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.log(`${model}: ERROR ${res.status} - ${err?.error?.message || res.statusText}`);
            return;
        }
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(`${model}: SUCCESS - "${text?.trim()}"`);
    } catch (e) {
        console.log(`${model}: NETWORK ERROR - ${e.message}`);
    }
}

(async () => {
    console.log("Testing Gemini API models...\n");
    for (const m of MODELS) {
        await testModel(m);
    }
    console.log("\nDone!");
})();
