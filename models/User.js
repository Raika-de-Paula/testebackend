const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Senha HASH
    cpf: { type: String, required: true, unique: true },
    dataNascimento: { type: String }, // Mantendo como string simples por enquanto
    telefone: { type: String },
    
    // 🛑 CAMPO PARA ARMAZENAR AS MATRÍCULAS
    courses: [{ 
        id: { type: String, required: true },
        title: { type: String, required: true },
        teacher: { type: String },
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);