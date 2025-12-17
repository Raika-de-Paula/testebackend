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
// routes/authRoutes.js

router.post('/enroll', protect, async (req, res) => {
    // 1. Extraia 'duration' do req.body junto com os outros campos
    const { 
        courseId, 
        title, 
        teacherName, 
        day, 
        time, 
        duration, // A variável deve ser declarada aqui
        teacherEmail 
    } = req.body; 
    
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (user.courses.some(c => c.id === courseId)) {
            return res.status(400).json({ message: 'Você já está matriculado.' });
        }

        // 2. Monte o objeto garantindo que 'duration' existe
        const newCourseEntry = {
            id: courseId,
            title: title,
            duration: duration || "40h", // Resolve o erro de referência
            teacherName: teacherName,
            day: day || "A definir",
            time: time || "A definir",
            teacherEmail: teacherEmail || "contato@escola.com"
        };
        
        user.courses.push(newCourseEntry);
        await user.save();
        
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

// =========================================================
// Rota 5: /unenroll (Trancar Curso - Privada)
// =========================================================
router.post('/unenroll', protect, async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id; 

    if (!courseId) {
        return res.status(400).json({ message: 'ID do curso é obrigatório.' });
    }

    try {
        // 1. Encontra o usuário
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        
        // Verifica se o curso existe na lista
        const isEnrolled = user.courses.some(c => c.id === courseId);
        
        if (!isEnrolled) {
            return res.status(400).json({ message: 'Você não está matriculado neste curso.' });
        }
        
        // 2. Remove o curso do array de cursos
        // Filtra o array, mantendo todos os cursos que NÃO têm o ID fornecido.
        user.courses = user.courses.filter(c => c.id !== courseId);
        
        await user.save();
        
        // 3. Retorna o usuário ATUALIZADO (sem a senha)
        const updatedUser = await User.findById(userId).select('-password');

        res.status(200).json({ 
            message: 'Curso trancado com sucesso.', 
            user: updatedUser 
        });

    } catch (error) {
        console.error('Erro ao trancar curso:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

module.exports = router;