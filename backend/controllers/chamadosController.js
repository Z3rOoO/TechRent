// =============================================
// CONTROLLER DE CHAMADOS
// =============================================
const db = require('../config/database');

// GET /chamados - lista chamados conforme o perfil do usuário
const listar = async (req, res) => {
  try {
    const { nivel_acesso, id } = req.usuario;
    const conn = await db.getConnection();
    let rows;

    try {
      if (nivel_acesso === 'admin') {
        [rows] = await conn.query(`
          SELECT c.*,
            u_cli.nome AS cliente_nome,
            u_tec.nome AS tecnico_nome,
            e.nome     AS equipamento_nome,
            e.categoria AS equipamento_categoria,
            e.patrimonio AS equipamento_patrimonio
          FROM chamados c
          JOIN usuarios u_cli ON c.cliente_id = u_cli.id
          JOIN equipamentos e ON c.equipamento_id = e.id
          LEFT JOIN usuarios u_tec ON c.tecnico_id = u_tec.id
          ORDER BY c.aberto_em DESC
        `);
      } else if (nivel_acesso === 'tecnico') {
        [rows] = await conn.query(`
          SELECT c.*,
            u_cli.nome AS cliente_nome,
            u_tec.nome AS tecnico_nome,
            e.nome     AS equipamento_nome,
            e.categoria AS equipamento_categoria,
            e.patrimonio AS equipamento_patrimonio
          FROM chamados c
          JOIN usuarios u_cli ON c.cliente_id = u_cli.id
          JOIN equipamentos e ON c.equipamento_id = e.id
          LEFT JOIN usuarios u_tec ON c.tecnico_id = u_tec.id
          WHERE c.status = 'aberto' OR c.tecnico_id = ?
          ORDER BY FIELD(c.prioridade,'alta','media','baixa'), c.aberto_em ASC
        `, [id]);
      } else {
        [rows] = await conn.query(`
          SELECT c.*,
            u_tec.nome AS tecnico_nome,
            e.nome     AS equipamento_nome,
            e.categoria AS equipamento_categoria,
            e.patrimonio AS equipamento_patrimonio
          FROM chamados c
          JOIN equipamentos e ON c.equipamento_id = e.id
          LEFT JOIN usuarios u_tec ON c.tecnico_id = u_tec.id
          WHERE c.cliente_id = ?
          ORDER BY c.aberto_em DESC
        `, [id]);
      }
    } finally {
      conn.release();
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: "Chamados recuperados com sucesso",
      dados: rows
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao ler os chamados",
      erro: e.message
    });
  }
};

// GET /chamados/:id - retorna um chamado pelo ID com dados enriquecidos e histórico
const buscarPorId = async (req, res) => {
  try {
    const idChamado = req.params.id;
    const { nivel_acesso, id: usuario_id } = req.usuario;

    const conn = await db.getConnection();
    try {
      const [rows] = await conn.query(`
        SELECT c.*,
          u_cli.nome  AS cliente_nome,
          u_cli.email AS cliente_email,
          u_tec.nome  AS tecnico_nome,
          u_tec.email AS tecnico_email,
          e.nome      AS equipamento_nome,
          e.categoria AS equipamento_categoria,
          e.patrimonio AS equipamento_patrimonio,
          e.status    AS equipamento_status
        FROM chamados c
        JOIN usuarios u_cli ON c.cliente_id = u_cli.id
        JOIN equipamentos e ON c.equipamento_id = e.id
        LEFT JOIN usuarios u_tec ON c.tecnico_id = u_tec.id
        WHERE c.id = ?
      `, [idChamado]);

      if (rows.length === 0) {
        return res.status(404).json({ sucesso: false, mensagem: "Chamado não encontrado" });
      }

      const chamado = rows[0];

      // Trava de segurança
      if (nivel_acesso === "cliente" && chamado.cliente_id !== usuario_id) {
        return res.status(403).json({ sucesso: false, mensagem: "Acesso negado" });
      }
      if (nivel_acesso === "tecnico" && chamado.status !== "aberto" && chamado.tecnico_id !== usuario_id) {
        return res.status(403).json({ sucesso: false, mensagem: "Acesso negado" });
      }

      // Busca histórico de manutenção do chamado
      const [historico] = await conn.query(`
        SELECT h.*,
          u.nome AS tecnico_nome
        FROM historico_manutencao h
        JOIN usuarios u ON h.tecnico_id = u.id
        WHERE h.chamado_id = ?
        ORDER BY h.registrado_em ASC
      `, [idChamado]);

      chamado.historico = historico;

      return res.status(200).json({
        sucesso: true,
        mensagem: "Chamado recuperado com sucesso",
        dados: chamado
      });
    } finally {
      conn.release();
    }
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

    if (!titulo || !equipamento_id) {
      return res.status(400).json({ sucesso: false, mensagem: "Título e equipamento são obrigatórios" });
    }

    // Verifica se o equipamento existe e está operacional
    const equipamentos = await db.Read("equipamentos", `id = ${equipamento_id}`);
    if (equipamentos.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Equipamento não encontrado" });
    }
    if (equipamentos[0].status !== 'operacional') {
      return res.status(400).json({ sucesso: false, mensagem: "Equipamento não está disponível (já em manutenção ou desativado)" });
    }

    const data = {
      titulo,
      descricao: descricao || '',
      cliente_id,
      equipamento_id,
      tecnico_id: null,
      prioridade: prioridade || 'media',
      status: "aberto"
    };

    const result = await db.Create("chamados", data);

    // Atualiza status do equipamento para em_manutencao
    await db.Update("equipamentos", { status: "em_manutencao" }, `id = ${equipamento_id}`);

    return res.status(201).json({
      sucesso: true,
      mensagem: "Chamado aberto com sucesso",
      dados: { id: result, ...data }
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

  const statusValidos = ['aberto', 'em_atendimento', 'resolvido', 'cancelado'];
  if (!statusValidos.includes(status)) {
    return res.status(400).json({ sucesso: false, mensagem: "Status inválido" });
  }

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

    // Trava: para marcar como resolvido, é obrigatório ter ao menos um registro de manutenção
    if (status === "resolvido") {
      const conn = await db.getConnection();
      let registros;
      try {
        [registros] = await conn.query(
          "SELECT id FROM historico_manutencao WHERE chamado_id = ? LIMIT 1",
          [id]
        );
      } finally {
        conn.release();
      }
      if (registros.length === 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "É obrigatório registrar pelo menos uma manutenção antes de concluir o chamado."
        });
      }
    }

    await db.Update("chamados", { status }, `id = ${id}`);

    // Atualiza status do equipamento conforme o status do chamado
    if (status === "resolvido" || status === "cancelado") {
      await db.Update("equipamentos", { status: "operacional" }, `id = ${chamado.equipamento_id}`);
    } else if (status === "em_atendimento") {
      await db.Update("equipamentos", { status: "em_manutencao" }, `id = ${chamado.equipamento_id}`);
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
    await db.Update("equipamentos", { status: "em_manutencao" }, `id = ${chamadoResult[0].equipamento_id}`);

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
