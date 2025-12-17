//models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    dataNascimento: { type: String },
    telefone: { type: String },
    
    // 🛑 CAMPO PARA ARMAZENAR AS MATRÍCULAS
    courses: [{ 
        id: { type: String, required: true },
        title: { type: String, required: true },
        duration: {type: String}  || 'On',
        name: { type: String },
        day: {type: String},
        time: { type: String},
        teacherEmail: {type: String}
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);