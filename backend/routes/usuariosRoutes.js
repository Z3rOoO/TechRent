// =============================================
// ROTAS DE USUÁRIOS
// =============================================

const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middlewares/auth');
const ctrl = require('../controllers/usuariosController');

// Listar usuários (admin only)
router.get('/', autenticar, autorizar('admin'), ctrl.listar);

// Buscar usuário por ID (admin only)
router.get('/:id', autenticar, autorizar('admin'), ctrl.buscarPorId);

// Criar novo usuário (admin only)
router.post('/', autenticar, autorizar('admin'), ctrl.criar);

// Atualizar usuário (admin only)
router.put('/:id', autenticar, autorizar('admin'), ctrl.atualizar);

// Deletar usuário (admin only)
router.delete('/:id', autenticar, autorizar('admin'), ctrl.deletar);

module.exports = router;
