const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static').path;

const app = express();
const port = process.env.PORT || 3000;

// Define o caminho para o executável ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Middleware para processar JSON
app.use(express.json());

// Rota para conversão de áudio
app.post('/converter', (req, res) => {
  const audioUrl = req.body.audioUrl; // A URL do arquivo de áudio a ser convertido
  
  // Verifica se a URL do áudio foi fornecida
  if (!audioUrl) {
    return res.status(400).json({ error: 'URL do áudio não fornecida' });
  }

  // Realiza a conversão do áudio
  ffmpeg(audioUrl)
    .toFormat('ogg') // Formato de saída (OGG)
    .on('end', () => {
      console.log('Conversão concluída');
      res.json({ message: 'Conversão concluída' });
    })
    .on('error', (err) => {
      console.error('Erro ao converter o áudio:', err.message);
      res.status(500).json({ error: 'Erro ao converter o áudio' });
    })
    .save('output.ogg'); // Nome do arquivo de saída
});

// Rota padrão
app.get('/', (req, res) => {
  res.send('API de conversão de áudio');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
