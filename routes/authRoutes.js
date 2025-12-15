//routes/authRoutes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Importa o middleware de proteção
const User = require('../models/User'); // Para as rotas que acessam o BD diretamente

// Rota 1: Cadastro (Pública)
router.post('/signup', authController.signup);

// Rota 2: Login (Pública)
router.post('/signin', authController.signin);


// =========================================================
// Rota 3: /me (Privada - Protegida)
// Retorna os dados do usuário baseado no token JWT
// =========================================================
router.get('/me', protect, async (req, res) => {
    // Se a proteção (protect) passou, req.user contém os dados do usuário.
    // O select('-password') garante que a senha não seja enviada.
    res.status(200).json(req.user);
});


// =========================================================
// Rota 4: /enroll (Matrícula - Privada)
// =========================================================
router.post('/enroll', protect, async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id; // ID obtido do token pelo middleware 'protect'
    
    // 1. Busca o curso real no BD (NÃO INCLUÍMOS AQUI, mas é o ideal)
    // 2. Simula a busca de dados do curso (pode vir de um array de mock ou outro modelo)
    const mockCourses = [
        { id: 'c1', title: 'Introdução à Programação', teacher: 'Dr. Alan Turing' },
        { id: 'c2', title: 'Design Gráfico Fundamental', teacher: 'Profa. Ada Lovelace' },
        { id: 'c3', title: 'Marketing Digital', teacher: 'Prof. Philip Kotler' },
    ];
    
    const courseToEnroll = mockCourses.find(c => c.id === courseId);

    if (!courseToEnroll) {
        return res.status(404).json({ message: 'Curso não encontrado.' });
    }

    try {
        // 3. Atualiza o usuário no banco de dados
        const user = await User.findById(userId);
        
        // Verifica se já está matriculado
        if (user.courses.some(c => c.id === courseId)) {
            return res.status(400).json({ message: 'Você já está matriculado neste curso.' });
        }
        
        user.courses.push(courseToEnroll);
        await user.save();
        
        // 4. Retorna o usuário ATUALIZADO (sem a senha)
        const updatedUser = await User.findById(userId).select('-password');

        res.status(200).json({ 
            message: 'Matrícula realizada com sucesso!', 
            user: updatedUser 
        });

    } catch (error) {
        console.error('Erro ao matricular:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

module.exports = router;