const API_BASE = "http://localhost:8000/api/v1";

export const BrandCraftAPI = {
  async createContext(data: any) {
    const res = await fetch(`${API_BASE}/context/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async generateNames(payload: any) {
    const res = await fetch(`${API_BASE}/branding/generate-name`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async analyzeSentiment(text: string) {
    const res = await fetch(`${API_BASE}/branding/sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return res.json();
  }
};