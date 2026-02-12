
const API_BASE = "http://localhost:8000/api/v1";

export const BrandCraftAPI = {
  async createContext(data: any) {
    const res = await fetch(`${API_BASE}/context/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create context');
    return res.json();
  },

  async generateNames(payload: any) {
    const res = await fetch(`${API_BASE}/branding/generate-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate names');
    return res.json();
  },

  async generateLogo(payload: { prompt: string; context_id?: string }) {
    const res = await fetch(`${API_BASE}/branding/generate-logo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate logo');
    return res.json();
  },

  async generateContent(payload: { type: string; context_id?: string }) {
    const res = await fetch(`${API_BASE}/branding/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate content');
    return res.json();
  },

  async analyzeSentiment(text: string) {
    const res = await fetch(`${API_BASE}/branding/sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Failed to analyze sentiment');
    return res.json();
  },

  async assistantChat(message: string, history: any[], context_id?: string) {
    const res = await fetch(`${API_BASE}/branding/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, context_id })
    });
    if (!res.ok) throw new Error('Assistant request failed');
    return res.json();
  }
};
