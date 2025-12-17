require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// =========================================================
// CONEXÃO COM O MONGODB
// =========================================================
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
})
    .then(() => console.log('✅ MongoDB conectado com sucesso!'))
    .catch(err => console.error('❌ Erro na conexão com o MongoDB:', err));

// =========================================================
// MIDDLEWARES
// =========================================================
app.use(cors()); // Permite requisições do seu frontend (React)
app.use(express.json()); // Permite analisar corpos de requisição JSON

// Rota de Teste
app.get('/', (req, res) => {
    res.send('Servidor de Backend da Plataforma Online está funcionando!');
});

// =========================================================
// 🛑 ROTAS DA API
// =========================================================
// Importa as rotas de autenticação
const authRoutes = require('./routes/authRoutes');
app.use('/users', authRoutes); 
// então, a rota base aqui é apenas '/users'.

// Inicia o Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express rodando em http://localhost:${PORT}`);
});