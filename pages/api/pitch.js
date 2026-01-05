export default function handler(req, res) {
  if (req.method === 'POST') {
    const { query, expertise, tone } = req.body;
    const prompt = `You are a sharp PR writer. Write a 3-line reply to this HARO query: "${query}". From the perspective of a ${expertise}. Tone: ${tone}. Keep it tight, no fluff.`;
    
    const response = fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: ,
        temperature: 0.7
      })
    });

    const data = response.json();
    data.then(json => {
      res.status(200).json({ pitch: json.choices[0].message.content });
    }).catch(err => {
      res.status(500).json({ error: 'OpenAI failed' });
    });
  } else {
    res.status(405).json({ error: 'Only POST' });
  }
}
