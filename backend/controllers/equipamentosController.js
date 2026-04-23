// =============================================
// CONTROLLER DE EQUIPAMENTOS
// =============================================
const db = require('../config/database');

// GET /equipamentos - lista todos os equipamentos
const listar = async (req, res) => {
  try {
    const equipamentos = await db.Read("equipamentos");
    return res.status(200).json({
      sucesso: true,
      mensagem: "Equipamentos recuperados com sucesso",
      dados: equipamentos
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar equipamentos",
      erro: e.message
    });
  }
};

// GET /equipamentos/:id - busca por ID
const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const equipamentos = await db.Read("equipamentos", `id = ${id}`);
    
    if (equipamentos.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Equipamento não encontrado" });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: "Equipamento recuperado com sucesso",
      dados: equipamentos[0]
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar equipamento",
      erro: e.message
    });
  }
};

// POST /equipamentos - criar (admin only)
const criar = async (req, res) => {
  try {
    const data = req.body;
    if (!data.status) data.status = "disponivel";
    
    const result = await db.Create("equipamentos", data);
    return res.status(201).json({
      sucesso: true,
      mensagem: "Equipamento criado com sucesso",
      dados: { id: result.insertId, ...data }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar equipamento",
      erro: e.message
    });
  }
};

// PUT /equipamentos/:id - atualizar (admin only)
const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const existe = await db.Read("equipamentos", `id = ${id}`);
    if (existe.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Equipamento não encontrado" });
    }

    await db.Update("equipamentos", data, `id = ${id}`);
    return res.status(200).json({
      sucesso: true,
      mensagem: "Equipamento atualizado com sucesso",
      dados: { id, ...data }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar equipamento",
      erro: e.message
    });
  }
};

// DELETE /equipamentos/:id - remover (admin only)
const remover = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existe = await db.Read("equipamentos", `id = ${id}`);
    if (existe.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Equipamento não encontrado" });
    }

    await db.Delete("equipamentos", `id = ${id}`);
    return res.status(200).json({
      sucesso: true,
      mensagem: "Equipamento removido com sucesso"
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao remover equipamento",
      erro: e.message
    });
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, remover };
