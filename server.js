import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.static(process.cwd()));

// Proxy endpoint for GNews API
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    
    // Forward the GNews status code and data
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch from target URL' });
  }
});

app.listen(PORT, () => {
  console.log(`
  🌐 Global Horizon Server Running!
  ----------------------------------
  Local:            http://localhost:${PORT}
  Built-in Proxy:   Enabled (/api/proxy)
  ----------------------------------
  `);
});
