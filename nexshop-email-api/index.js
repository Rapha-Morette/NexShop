const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/enviar-codigo', async (req, res) => {
  const { email, codigo } = req.body;

  if (!email || !codigo) {
    return res.status(400).json({ error: 'Email e código são obrigatórios' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"NexShop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Código de Autenticação MFA - NexShop',
      text: `Seu código de autenticação é: ${codigo}`,
    });

    res.json({ success: true, message: 'E-mail enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ error: 'Erro ao enviar o e-mail' });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`📨 Servidor de e-mail rodando em http://localhost:${PORT}`);
});
