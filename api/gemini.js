export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const serverKey = process.env.GEMINI_API_KEY;
  if (!serverKey) {
    res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' });
    return;
  }

  try {
    const { path, key, payload } = (req.body || {});

    // If user provided an API key (from browser settings), use it; else fallback to server key.
    const apiKey = (typeof key === 'string' && key.trim()) ? key.trim() : serverKey;

    if (typeof path !== 'string' || !path.startsWith('/v1beta/models/')) {
      res.status(400).json({ error: 'Invalid path' });
      return;
    }
    if (!payload || typeof payload !== 'object') {
      res.status(400).json({ error: 'Invalid payload' });
      return;
    }

    const url = `https://generativelanguage.googleapis.com${path}?key=${encodeURIComponent(apiKey)}`;

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    res.status(upstream.status);

    // Try to return JSON, else raw text.
    try {
      res.json(JSON.parse(text));
    } catch {
      res.send(text);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Server error' });
  }
}
