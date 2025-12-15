// testServer.js - Versão Mínima para Testar a Conexão

// 1. Carrega variáveis de ambiente (necessário para rodar localmente)
const dotenv = require('dotenv');
dotenv.config(); 

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// =========================================================
// 🛑 Lógica de Conexão com o MongoDB (O Foco do Teste)
// =========================================================

async function connectDB() {
    console.log('--- TESTE DE CONEXÃO INICIADO ---');
    console.log('MONGO_URI Lida (Primeiros 15 caracteres):', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) : 'URI VAZIA');
    
    // Adicionamos as opções de timeout para estabilidade no Vercel
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // 10 segundos
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ SUCESSO! MongoDB conectado com sucesso.');
        
    } catch (err) {
        console.error('❌ ERRO CRÍTICO NA CONEXÃO COM O MONGODB:');
        console.error(err); // O erro detalhado, como o MongooseServerSelectionError
        console.log('--- TESTE DE CONEXÃO FINALIZADO COM FALHA ---');
        // Mantemos o servidor rodando para debug, mas a conexão falhou
    }
}

// Inicia a Conexão antes de iniciar o servidor
connectDB();

// =========================================================
// Rota de Status (Para verificar que o servidor Express está ativo)
// =========================================================
app.get('/', (req, res) => {
    // Retorna o status da conexão
    const dbState = mongoose.connection.readyState;
    let message = 'Servidor Express está rodando. ';

    if (dbState === 1) {
        message += 'Status do DB: CONECTADO (readyState 1)';
    } else if (dbState === 2) {
        message += 'Status do DB: CONECTANDO... (readyState 2)';
    } else {
        message += `Status do DB: DESCONECTADO/FALHOU (readyState ${dbState}). Verifique os logs!`;
    }

    res.status(dbState === 1 ? 200 : 500).send(message);
});


// Inicia o Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express de teste rodando em http://localhost:${PORT}`);
});