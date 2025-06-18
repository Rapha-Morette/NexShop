const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors()); // permite chamadas do frontend

/**
 * Rota que consulta a reputação do IP via AbuseIPDB.
 * Ex: GET /verificar-ip?ip=189.114.189.11
 */
app.get('/verificar-ip', async (req, res) => {
  const ip = req.query.ip;
  if (!ip) {
    return res.status(400).json({ error: 'IP é obrigatório' });
  }

  try {
    const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
      params: { ipAddress: ip },
      headers: {
        Key: process.env.ABUSEIPDB_KEY,
        Accept: 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao consultar AbuseIPDB:', error.message);
    res.status(500).json({ error: 'Erro ao consultar AbuseIPDB' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
