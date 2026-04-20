// =============================================
// CONTROLLER DE USUÁRIOS
// =============================================

const db = require('../config/database');

// GET /usuarios - lista todos os usuários (admin only)
const listar = async (req, res) => {
  try {
    const usuarios = await db.Read("usuarios");
    // Não retornar as senhas
    const usuariosSemSenha = usuarios.map(u => {
      const { senha, ...rest } = u;
      return rest;
    });
    return res.status(200).json({
      sucesso: true,
      mensagem: "Usuários listados com sucesso",
      dados: usuariosSemSenha
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar usuários",
      erro: e.message
    });
  }
};

// GET /usuarios/:id - busca um usuário específico (admin only)
const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await db.Read("usuarios", `id = ${id}`);

    if (usuario.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado"
      });
    }

    const { senha, ...rest } = usuario[0];
    return res.status(200).json({
      sucesso: true,
      mensagem: "Usuário encontrado",
      dados: rest
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar usuário",
      erro: e.message
    });
  }
};

// POST /usuarios - cria um novo usuário (admin only)
const criar = async (req, res) => {
  try {
    const { nome, email, nivel_acesso, senha } = req.body;

    if (!nome || !email || !nivel_acesso || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Campos obrigatórios faltando"
      });
    }

    // Verificar se email já existe
    const usuarioExistente = await db.Read("usuarios", `email = '${email}'`);
    if (usuarioExistente.length > 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Email já cadastrado"
      });
    }

    // Hash da senha
    const senhaHash = await db.hashPassword(senha);

    // Criar usuário
    const data = { nome, email, nivel_acesso, senha: senhaHash };
    const resultado = await db.Create("usuarios", data);

    const { senha: _, ...usuarioSemSenha } = data;

    return res.status(201).json({
      sucesso: true,
      mensagem: "Usuário criado com sucesso",
      dados: { id: resultado, ...usuarioSemSenha }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar usuário",
      erro: e.message
    });
  }
};

// PUT /usuarios/:id - atualiza um usuário (admin only)
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, nivel_acesso, senha } = req.body;

    // Verificar se usuário existe
    const usuario = await db.Read("usuarios", `id = ${id}`);
    if (usuario.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado"
      });
    }

    // Construir objeto de atualização
    const data = {};
    if (nome) data.nome = nome;
    if (email) data.email = email;
    if (nivel_acesso) data.nivel_acesso = nivel_acesso;
    if (senha) data.senha = await db.hashPassword(senha);

    // Atualizar usuário
    await db.Update("usuarios", data, `id = ${id}`);

    const { senha: _, ...usuarioAtualizado } = { ...usuario[0], ...data };

    return res.status(200).json({
      sucesso: true,
      mensagem: "Usuário atualizado com sucesso",
      dados: usuarioAtualizado
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar usuário",
      erro: e.message
    });
  }
};

// DELETE /usuarios/:id - deleta um usuário (admin only)
const deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se usuário existe
    const usuario = await db.Read("usuarios", `id = ${id}`);
    if (usuario.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado"
      });
    }

    // Deletar usuário
    await db.Delete("usuarios", `id = ${id}`);

    return res.status(200).json({
      sucesso: true,
      mensagem: "Usuário deletado com sucesso"
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao deletar usuário",
      erro: e.message
    });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, deletar };
