// =============================================
// CONTROLLER DE AUTENTICAÇÃO
// =============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// POST /auth/registro - cria um novo usuário
const registro = async (req, res) => {
  try {
    const { nome, email, nivel_acesso, senha } = req.body;
    
    // Verificar se email já existe
    const existe = await db.Read("usuarios", `email = '${email}'`);
    if (existe.length > 0) {
      return res.status(400).json({ sucesso: false, mensagem: "Este email já está cadastrado" });
    }

    const senhaHash = await db.hashPassword(senha);
    const datauser = { nome, email, nivel_acesso, senha: senhaHash };
    const result = await db.Create("usuarios", datauser);
    
    return res.status(201).json({
      sucesso: true,
      mensagem: "Usuário cadastrado com sucesso",
      dados: { id: result.insertId, nome, email, nivel_acesso },
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao registrar usuário",
      erro: e.message
    });
  }
};

// POST /auth/login - autentica e retorna JWT
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const users = await db.Read("usuarios", `email = '${email}'`);
    
    if (users.length === 0) {
      return res.status(401).json({ sucesso: false, mensagem: "Usuário não encontrado" });
    }

    const user = users[0];
    const validacaoSenha = await db.comparePassword(senha, user.senha);
    
    if (!validacaoSenha) {
      return res.status(401).json({ sucesso: false, mensagem: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email, nivel_acesso: user.nivel_acesso },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Remove a senha antes de enviar os dados
    delete user.senha;

    return res.status(200).json({
      sucesso: true,
      token: token,
      mensagem: "Login bem-sucedido",
      dados: user
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao realizar login",
      erro: e.message
    });
  }
};

module.exports = { registro, login };
