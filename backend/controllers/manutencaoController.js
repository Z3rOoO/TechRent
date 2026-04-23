// =============================================
// CONTROLLER DE HISTÓRICO DE MANUTENÇÃO
// =============================================
const db = require('../config/database');

// GET /manutencao - lista todos os registros de manutenção com dados enriquecidos
const listar = async (req, res) => {
  try {
    const { nivel_acesso, id: usuario_id } = req.usuario;
    const conn = await db.getConnection();
    try {
      let rows;
      if (nivel_acesso === 'admin') {
        [rows] = await conn.query(`
          SELECT h.*,
            u.nome  AS tecnico_nome,
            e.nome  AS equipamento_nome,
            e.categoria AS equipamento_categoria,
            e.patrimonio AS equipamento_patrimonio,
            c.titulo AS chamado_titulo,
            c.status AS chamado_status
          FROM historico_manutencao h
          JOIN usuarios u ON h.tecnico_id = u.id
          JOIN equipamentos e ON h.equipamento_id = e.id
          LEFT JOIN chamados c ON h.chamado_id = c.id
          ORDER BY h.registrado_em DESC
        `);
      } else {
        // Técnico vê apenas seus próprios registros
        [rows] = await conn.query(`
          SELECT h.*,
            u.nome  AS tecnico_nome,
            e.nome  AS equipamento_nome,
            e.categoria AS equipamento_categoria,
            e.patrimonio AS equipamento_patrimonio,
            c.titulo AS chamado_titulo,
            c.status AS chamado_status
          FROM historico_manutencao h
          JOIN usuarios u ON h.tecnico_id = u.id
          JOIN equipamentos e ON h.equipamento_id = e.id
          LEFT JOIN chamados c ON h.chamado_id = c.id
          WHERE h.tecnico_id = ?
          ORDER BY h.registrado_em DESC
        `, [usuario_id]);
      }

      return res.status(200).json({
        sucesso: true,
        mensagem: "Histórico de manutenção recuperado com sucesso",
        dados: rows
      });
    } finally {
      conn.release();
    }
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao ler o histórico de manutenção",
      erro: e.message
    });
  }
};

// POST /manutencao - registra um reparo em um equipamento (técnico)
// Body esperado: { chamado_id, equipamento_id, descricao }
const registrar = async (req, res) => {
  try {
    const { chamado_id, equipamento_id, descricao } = req.body;
    const tecnico_id = req.usuario.id;

    if (!chamado_id || !equipamento_id || !descricao) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "chamado_id, equipamento_id e descricao são obrigatórios"
      });
    }

    // Verifica se o chamado existe e pertence ao técnico
    const chamados = await db.Read("chamados", `id = ${chamado_id}`);
    if (chamados.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: "Chamado não encontrado" });
    }

    const chamado = chamados[0];
    if (chamado.tecnico_id !== tecnico_id && req.usuario.nivel_acesso !== 'admin') {
      return res.status(403).json({ sucesso: false, mensagem: "Você não tem permissão para registrar manutenção neste chamado" });
    }

    // Cria o registro de manutenção
    const novoReparo = { chamado_id, equipamento_id, tecnico_id, descricao };
    const id = await db.Create("historico_manutencao", novoReparo);

    return res.status(201).json({
      sucesso: true,
      mensagem: "Registro de manutenção criado com sucesso",
      dados: { id, ...novoReparo }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao registrar manutenção",
      erro: e.message
    });
  }
};

module.exports = { listar, registrar };
