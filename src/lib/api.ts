// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://monastery360-0f3x.onrender.com";

export async function fetchMonasteries() {
  const res = await fetch(`${API_BASE_URL}/api/monasteries`);
  return res.json();
}

export async function addMonastery(data: any) {
  const res = await fetch(`${API_BASE_URL}/api/monasteries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
