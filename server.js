require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // ESM style import

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ AMBIL DARI .ENV
const openai = new OpenAI({ 
  apiKey: "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"
});

// Test
app.get('/', (req, res) => res.json({ message: 'Backend OK' }));

// ✅ CHAT ENDPOINT - PAKAI FORMAT CHAT COMPLETIONS
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message) return res.status(400).json({ error: 'Message required' });
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // ✅ Model BENAR & MURAH
      messages: [
        {
          role: 'system',
          content: `Kamu ahli rekomendasi burung peliharaan Indonesia. Rekomendasi berdasarkan budget, ruang, perawatan. Jawab santai bahasa Indonesia. Contoh: Lovebird (Rp200-500rb), Kenari (Rp150-400rb), Parkit (Rp100-300rb). berikan jawabannya dalam bahasa yang natural seperti bahasa pedagang pedagang atau ahli burung gitu`
        },
        { role: 'user', content: message }
      ],
      max_tokens: 400,
      temperature: 0.7
    });
    
    res.json({ 
      reply: completion.choices[0].message.content 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('🚀 http://localhost:3000'));