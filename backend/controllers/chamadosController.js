// =============================================
// CONTROLLER DE CHAMADOS
// =============================================
const db = require('../config/database');

// GET /chamados - lista chamados
const listar = async (req, res) => {
  try {
    const { nivel_acesso, id } = req.usuario;
    let query = "";
    
    if (nivel_acesso === "admin") {
      query = "1=1"; // Admin vê tudo
    } else if (nivel_acesso === "tecnico") {
      // Técnico vê todos os abertos ou os que ele aceitou
      query = `status = 'aberto' OR tecnico_id = ${id}`;
    } else {
      // Cliente vê apenas os seus
      query = `cliente_id = ${id}`;
    }

    const chamados = await db.Read("chamados", query);
    return res.status(200).json({
      sucesso: true,
      mensagem: "Chamados recuperados com sucesso",
      dados: chamados
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao ler os chamados",
      erro: e.message
    });
  }
};

// GET /chamados/:id - retorna um chamado pelo ID com trava de segurança
const buscarPorId = async (req, res) => {
  try {
    const idChamado = req.params.id;
    const { nivel_acesso, id: usuario_id } = req.usuario;
    
    const chamados = await db.Read("chamados", `id = ${idChamado}`);
    
    if (chamados.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Chamado não encontrado" });
    }

    const chamado = chamados[0];

    // Trava de segurança: cliente só vê o dele, técnico vê se for aberto ou se for dele
    if (nivel_acesso === "cliente" && chamado.cliente_id !== usuario_id) {
      return res.status(403).json({ sucesso: false, mensagem: "Acesso negado" });
    }
    
    if (nivel_acesso === "tecnico" && chamado.status !== "aberto" && chamado.tecnico_id !== usuario_id) {
      return res.status(403).json({ sucesso: false, mensagem: "Acesso negado" });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: "Chamado recuperado com sucesso",
      dados: chamado
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar chamado",
      erro: e.message
    });
  }
};

// POST /chamados - abre um novo chamado
const criar = async (req, res) => {
  try {
    const { titulo, descricao, equipamento_id, prioridade } = req.body;
    const cliente_id = req.usuario.id;
    
    const data = {
      titulo, 
      descricao, 
      cliente_id,
      equipamento_id,
      tecnico_id: null,
      prioridade,
      status: "aberto"
    };
    
    const result = await db.Create("chamados", data);
    return res.status(201).json({
      sucesso: true,
      mensagem: "Chamado efetuado com sucesso",
      dados: { id: result.insertId, ...data }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao realizar o chamado",
      erro: e.message
    });
  }
};

// PUT /chamados/:id/status - atualiza o status do chamado
const atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { nivel_acesso, id: usuario_id } = req.usuario;
  
  try {
    const chamadoResult = await db.Read("chamados", `id = ${id}`);
    if (chamadoResult.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Chamado não encontrado" });
    }
    
    const chamado = chamadoResult[0];

    // Trava: técnico só pode atualizar chamado que ele aceitou
    if (nivel_acesso === "tecnico" && chamado.tecnico_id !== usuario_id) {
      return res.status(403).json({ sucesso: false, mensagem: "Você não tem permissão para atualizar este chamado" });
    }
    
    const data = { status };
    await db.Update("chamados", data, `id = ${id}`);
    
    // Lógica de status de equipamento
    if (status === "resolvido") {
      await db.Update("equipamentos", { status: "disponivel" }, `id = ${chamado.equipamento_id}`);
    } else if (status === "em_atendimento") {
      await db.Update("equipamentos", { status: "manutencao" }, `id = ${chamado.equipamento_id}`);
    }
    
    return res.status(200).json({
      sucesso: true,
      mensagem: "Status atualizado com sucesso",
      dados: { id, status }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar status",
      erro: e.message
    });
  }
};

// PUT /chamados/:id/aceitar - técnico aceita o chamado
const aceitar = async (req, res) => {
  const { id } = req.params;
  const tecnico_id = req.usuario.id;
  try {
    const chamadoResult = await db.Read("chamados", `id = ${id}`);
    if (chamadoResult.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Chamado não encontrado" });
    }
    
    if (chamadoResult[0].status !== "aberto") {
      return res.status(400).json({ sucesso: false, mensagem: "Este chamado já foi aceito ou está fechado" });
    }
    
    await db.Update("chamados", { status: "em_atendimento", tecnico_id }, `id = ${id}`);
    await db.Update("equipamentos", { status: "manutencao" }, `id = ${chamadoResult[0].equipamento_id}`);
    
    return res.status(200).json({
      sucesso: true,
      mensagem: "Chamado aceito com sucesso",
      dados: { id, status: "em_atendimento", tecnico_id }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao aceitar chamado",
      erro: e.message
    });
  }
};

module.exports = { listar, buscarPorId, criar, atualizarStatus, aceitar };
