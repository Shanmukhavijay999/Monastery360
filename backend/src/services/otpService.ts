import nodemailer from "nodemailer";

// ─── In-memory OTP store (key = email, value = { otp, expiresAt, data }) ─────
interface OtpEntry {
  otp: string;
  expiresAt: number;
  // Pending signup data (stored until OTP verified)
  pendingData?: {
    fullName: string;
    email: string;
    username: string;
    password: string;
  };
}

const otpStore = new Map<string, OtpEntry>();

// ─── Generate 6-digit OTP ──────────────────────────────────────────────────────
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Save OTP (expires in 10 minutes) ─────────────────────────────────────────
export function saveOtp(email: string, otp: string, pendingData?: OtpEntry["pendingData"]) {
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
    pendingData,
  });
}

// ─── Verify OTP (returns the entry if valid, null otherwise) ──────────────────
export function verifyOtp(email: string, otp: string): OtpEntry | null {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return null;
  }
  if (entry.otp !== otp) return null;
  otpStore.delete(email.toLowerCase()); // one-time use
  return entry;
}

// ─── Create Nodemailer Transporter ───────────────────────────────────────────
function createTransporter() {
  const isOAuth2 = !!process.env.SMTP_REFRESH_TOKEN;

  if (isOAuth2) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SMTP_USER,
        clientId: process.env.SMTP_CLIENT_ID,
        clientSecret: process.env.SMTP_CLIENT_SECRET,
        refreshToken: process.env.SMTP_REFRESH_TOKEN,
      },
    });
  }

  // Fallback to basic App Password
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── Send OTP Email ──────────────────────────────────────────────────────────
export async function sendOtpEmail(email: string, otp: string, purpose: "signup" | "login") {
  const isDev = !process.env.SMTP_PASS || process.env.SMTP_PASS === "your_16_char_app_password_here";
  const isOAuth2 = !!process.env.SMTP_REFRESH_TOKEN;

  // Dev mode: if SMTP not configured AND OAuth2 not configured, print to console
  if (isDev && !isOAuth2) {
    console.log("\n" + "=".repeat(60));
    console.log(`📧  OTP for ${email} [${purpose.toUpperCase()}]`);
    console.log(`🔐  Code: ${otp}`);
    console.log("    (SMTP not configured — OTP printed to console)");
    console.log("=".repeat(60) + "\n");
    return; // Skip actual email sending
  }

  const subject =
    purpose === "signup"
      ? "🔐 Verify your Monastery360 account"
      : "🔐 Monastery360 Login Verification Code";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f9f6f0; margin: 0; padding: 0; }
        .container { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
        .header { background: linear-gradient(135deg, #d97706, #ea580c); padding: 32px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px; }
        .body { padding: 36px 40px; }
        .otp-box { background: linear-gradient(135deg, #fef3c7, #fed7aa); border: 2px dashed #f59e0b; border-radius: 16px; text-align: center; padding: 24px; margin: 24px 0; }
        .otp-code { font-size: 44px; font-weight: 900; letter-spacing: 10px; color: #92400e; font-family: monospace; }
        .otp-label { font-size: 12px; color: #b45309; margin-top: 6px; text-transform: uppercase; letter-spacing: 2px; }
        .note { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #166534; margin: 16px 0; }
        .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #991b1b; margin: 16px 0; }
        .footer { text-align: center; padding: 20px 40px; background: #fafaf9; border-top: 1px solid #e7e5e4; font-size: 11px; color: #a8a29e; }
        p { color: #44403c; line-height: 1.6; font-size: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏔️ Monastery360</h1>
          <p>${purpose === "signup" ? "Welcome to your sacred journey" : "Security verification"}</p>
        </div>
        <div class="body">
          <p>Hello,</p>
          <p>
            ${purpose === "signup"
      ? "You're one step away from joining <strong>Monastery360</strong> — the digital home of Sikkim's sacred monasteries. Use the code below to verify your email address."
      : "A sign-in attempt was made. Use the verification code below to complete your login securely."
    }
          </p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="otp-label">Your Verification Code</div>
          </div>
          <div class="note">
            ✅ This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.
          </div>
          <div class="warning">
            ⚠️ If you did not request this, please ignore this email. Your account is safe.
          </div>
          <p style="font-size: 13px; color: #78716c;">
            Sent to: <strong>${email}</strong>
          </p>
        </div>
        <div class="footer">
          © 2026 Monastery360 · Preserving Sacred Heritage Through Technology<br/>
          This is an automated message, please do not reply.
        </div>
      </div>
    </body>
    </html>
    `;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Monastery360" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });
}
