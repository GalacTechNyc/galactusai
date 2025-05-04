import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }

  const { history } = req.body;

  if (!Array.isArray(history)) {
    return res.status(400).json({ error: 'Missing or invalid history array' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: history,
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
};