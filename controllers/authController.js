const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expira em 1 dia
    });
};

// =========================================================
// 1. SIGNUP (CADASTRO)
// =========================================================
exports.signup = async (req, res) => {
    const { nome, email, password, cpf, dataNascimento, telefone } = req.body;

    // 1. Validação Simples
    if (!email || !password || !nome || !cpf) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    try {
        // 2. Checa se o usuário já existe
        let userExists = await User.findOne({ $or: [{ email }, { cpf }] });
        if (userExists) {
            return res.status(400).json({ message: 'Email ou CPF já cadastrados.' });
        }

        // 3. Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Cria e salva o novo usuário no BD
        const newUser = new User({
            nome,
            email,
            password: hashedPassword,
            cpf,
            dataNascimento,
            telefone,
            courses: [] // Inicializa sem cursos
        });

        await newUser.save();

        // Resposta de sucesso (status 201 Created)
        res.status(201).json({ 
            message: 'Usuário cadastrado com sucesso!', 
            email: newUser.email 
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};


// =========================================================
// 2. SIGNIN (LOGIN)
// =========================================================
exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Busca o usuário
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }

        // 2. Compara a senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }

        // 3. Gera o Token
        const token = generateToken(user._id);

        // 4. Retorna Token e Dados do Usuário
        res.status(200).json({
            token,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                cpf: user.cpf,
                courses: user.courses // Retorna os cursos
            },
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

// NOTA: As funções GET /users/me e POST /users/enroll dependem de um MIDDLEWARE de AUTH