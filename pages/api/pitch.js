export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, expertise = 'expert', tone = 'professional' } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }

  // Add randomness to prevent identical outputs
  const randomSeed = Date.now() + Math.random();
  const uniqueHint = ['Make it feel fresh and original', 'Add a subtle personal touch', 'Vary the wording naturally'][Math.floor(Math.random() * 3)];

  const prompt = `You are a sharp PR expert. Write a concise 3-5 sentence pitch response to this HARO query: "${query}". 
Speak as a ${expertise}. Use a ${tone} tone. Make it personal, credible, and newsworthy. ${uniqueHint}. Seed for variation: ${randomSeed}. Keep it under 150 words.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }],
        temperature: 1.4, // Higher for more variation
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const pitch = data.choices[0].message.content.trim();

    res.status(200).json({ pitch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate pitch — try again' });
  }
}
