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

    const userKey = (typeof key === 'string' && key.trim()) ? key.trim() : '';

    if (typeof path !== 'string' || !path.startsWith('/v1beta/models/')) {
      res.status(400).json({ error: 'Invalid path' });
      return;
    }
    if (!payload || typeof payload !== 'object') {
      res.status(400).json({ error: 'Invalid payload' });
      return;
    }

    async function callGemini(apiKey) {
      const url = `https://generativelanguage.googleapis.com${path}?key=${encodeURIComponent(apiKey)}`;
      const upstream = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await upstream.text();
      let json = null;
      try { json = JSON.parse(text); } catch {}
      return { upstream, text, json };
    }

    // 1) Try user key if provided; else server key.
    const firstKey = userKey || serverKey;
    let result = await callGemini(firstKey);

    // 2) If user key fails with auth/key-style errors, fallback to server key automatically.
    const shouldFallback = userKey && firstKey !== serverKey && !result.upstream.ok && (
      result.upstream.status === 400 ||
      result.upstream.status === 401 ||
      result.upstream.status === 403
    );

    if (shouldFallback) {
      const msg = String(result.json?.error?.message || result.text || '').toLowerCase();
      const keyError = msg.includes('api key') || msg.includes('invalid') || msg.includes('expired') || msg.includes('permission');
      if (keyError) {
        result = await callGemini(serverKey);
      }
    }

    res.status(result.upstream.status);
    if (result.json) res.json(result.json);
    else res.send(result.text);
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Server error' });
  }
}
