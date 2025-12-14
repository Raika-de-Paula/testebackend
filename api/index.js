// 📁 Arquivo: api/index.js

require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// =========================================================
// CONEXÃO COM O MONGODB
// =========================================================
// Nota: A conexão é feita aqui para que as funções serverless a reutilizem.
// O Vercel gerencia o tempo de vida desta função.
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB conectado!'))
    .catch(err => console.error('❌ Erro na conexão com o MongoDB:', err));

// =========================================================
// MIDDLEWARES
// =========================================================
// Permite requisições de qualquer origem (necessário para o StackBlitz/Frontend)
app.use(cors()); 
app.use(express.json()); 

// =========================================================
// 🛑 ROTAS DA API (Siga as Rotas do seu AuthContext)
// =========================================================
const authRoutes = require('../routes/authRoutes');
// O Vercel trata o domínio, então apenas o caminho é necessário
app.use('/users', authRoutes); 

// Rota de Teste Simples
app.get('/', (req, res) => {
    res.send('API Serverless rodando no Vercel!');
});

// 🛑 EXPORTAÇÃO ESSENCIAL PARA O VERCEL
module.exports = app;