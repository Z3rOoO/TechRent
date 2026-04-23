// =============================================
// CONTROLLER DE EQUIPAMENTOS
// =============================================
const db = require('../config/database');

// GET /equipamentos - lista todos os equipamentos
const listar = async (req, res) => {
  try {
    const { status } = req.query;
    let where = null;
    if (status) {
      where = `status = '${status}'`;
    }
    const equipamentos = await db.Read("equipamentos", where);
    return res.status(200).json({
      sucesso: true,
      mensagem: "Equipamentos listados com sucesso",
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
    const { nome, categoria, patrimonio, descricao, status } = req.body;

    if (!nome) {
      return res.status(400).json({ sucesso: false, mensagem: "Nome do equipamento é obrigatório" });
    }

    const statusValidos = ['operacional', 'em_manutencao', 'desativado'];
    const statusFinal = statusValidos.includes(status) ? status : 'operacional';

    const data = { nome, categoria, patrimonio, descricao, status: statusFinal };
    const result = await db.Create("equipamentos", data);

    return res.status(201).json({
      sucesso: true,
      mensagem: "Equipamento criado com sucesso",
      dados: { id: result, ...data }
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
    const { nome, categoria, patrimonio, descricao, status } = req.body;

    const existe = await db.Read("equipamentos", `id = ${id}`);
    if (existe.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Equipamento não encontrado" });
    }

    const data = {};
    if (nome !== undefined) data.nome = nome;
    if (categoria !== undefined) data.categoria = categoria;
    if (patrimonio !== undefined) data.patrimonio = patrimonio;
    if (descricao !== undefined) data.descricao = descricao;
    if (status !== undefined) {
      const statusValidos = ['operacional', 'em_manutencao', 'desativado'];
      if (!statusValidos.includes(status)) {
        return res.status(400).json({ sucesso: false, mensagem: "Status inválido. Use: operacional, em_manutencao ou desativado" });
      }
      data.status = status;
    }

    await db.Update("equipamentos", data, `id = ${id}`);
    return res.status(200).json({
      sucesso: true,
      mensagem: "Equipamento atualizado com sucesso",
      dados: { id: parseInt(id), ...existe[0], ...data }
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
