//../middleware/authMiddleware
const jwt = require('jsonwebtoken');
const User = require('./models/User');

exports.protect = async (req, res, next) => {
    let token;

    // O token vem no formato: Authorization: Bearer <token_aqui>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Pega o token do header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verifica o token e decodifica o ID do usuário
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Busca o usuário no BD e o anexa à requisição (excluindo a senha)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Prossegue para o próximo handler (a rota real)

        } catch (error) {
            console.error('Erro de Token JWT:', error);
            res.status(401).json({ message: 'Não autorizado, token falhou.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Não autorizado, nenhum token.' });
    }
};