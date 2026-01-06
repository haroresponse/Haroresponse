import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [expertise, setExpertise] = useState('remote dad');
  const [tone, setTone] = useState('casual');
  const [pitch, setPitch] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!query) return;
    setLoading(true);
    setPitch('');
    try {
      const res = await fetch('/api/pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, expertise, tone })
      });
      const data = await res.json();
      setPitch(data.pitch || data.error || 'API not ready yet');
    } catch (err) {
      setPitch('Button works! AI coming soon');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
      <h1 style={{ fontSize: '42px', marginBottom: '20px' }}>haroresponse.com</h1>
      <p style={{ fontSize: '22px', marginBottom: '40px', color: '#555' }}>
        Paste any HARO query → get a killer reply in seconds.
      </p>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Paste the full HARO query here..."
        rows="6"
        style={{ width: '100%', padding: '15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '20px' }}
      />

      <div style={{ marginBottom: '30px' }}>
        <label>
          You're a:{' '}
          <input
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            placeholder="e.g. remote dad, fitness coach"
            style={{ width: '250px', padding: '8px', fontSize: '16px' }}
          />
        </label>
        <br /><br />
        <label>
          Tone:{' '}
          <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ padding: '8px', fontSize: '16px' }}>
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
            <option value="funny">Funny</option>
            <option value="authoritative">Authoritative</option>
          </select>
        </label>
      </div>

      <button
        onClick={submit}
        disabled={loading || !query}
        style={{
          padding: '15px 40px',
          fontSize: '20px',
          background: loading || !query ? '#aaa' : '#0066ff',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: loading || !query ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Generating...' : 'Get Pitch'}
      </button>

      {pitch && (
        <div style={{ marginTop: '40px', padding: '20px', background: '#f0f8ff', borderRadius: '8px', textAlign: 'left', fontSize: '18px' }}>
          <strong>Your pitch:</strong>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>{pitch}</p>
        </div>
      )}
    </div>
  );
}
