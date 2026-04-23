// =============================================
// CONTROLLER DE DASHBOARD
// =============================================
const db = require('../config/database');

// GET /dashboard/admin - resumo geral (admin only)
const resumoAdmin = async (req, res) => {
  try {
    const conn = await db.getConnection();
    try {
      // Chamados por status
      const [chamadosPorStatus] = await conn.query(`
        SELECT status, COUNT(*) AS total
        FROM chamados
        GROUP BY status
      `);

      // Total de chamados
      const [totalChamadosRow] = await conn.query(`SELECT COUNT(*) AS total FROM chamados`);

      // Chamados por prioridade
      const [chamadosPorPrioridade] = await conn.query(`
        SELECT prioridade, COUNT(*) AS total
        FROM chamados
        GROUP BY prioridade
      `);

      // Equipamentos por status
      const [equipamentosPorStatus] = await conn.query(`
        SELECT status, COUNT(*) AS total
        FROM equipamentos
        GROUP BY status
      `);

      // Total de equipamentos
      const [totalEquipamentosRow] = await conn.query(`SELECT COUNT(*) AS total FROM equipamentos`);

      // Total de usuários por nível
      const [usuariosPorNivel] = await conn.query(`
        SELECT nivel_acesso, COUNT(*) AS total
        FROM usuarios
        GROUP BY nivel_acesso
      `);

      // Total de usuários
      const [totalUsuariosRow] = await conn.query(`SELECT COUNT(*) AS total FROM usuarios`);

      // Manutenções por mês (últimos 6 meses)
      const [manutencoesPorMes] = await conn.query(`
        SELECT 
          DATE_FORMAT(registrado_em, '%Y-%m') AS mes,
          COUNT(*) AS total
        FROM historico_manutencao
        WHERE registrado_em >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY mes
        ORDER BY mes ASC
      `);

      // Chamados abertos por técnico
      const [chamadosPorTecnico] = await conn.query(`
        SELECT 
          u.nome AS tecnico,
          COUNT(*) AS total
        FROM chamados c
        JOIN usuarios u ON c.tecnico_id = u.id
        WHERE c.status = 'em_atendimento'
        GROUP BY c.tecnico_id, u.nome
        ORDER BY total DESC
      `);

      // Últimos 5 chamados
      const [ultimosChamados] = await conn.query(`
        SELECT c.id, c.titulo, c.status, c.prioridade, c.aberto_em,
          u.nome AS cliente_nome,
          e.nome AS equipamento_nome
        FROM chamados c
        JOIN usuarios u ON c.cliente_id = u.id
        JOIN equipamentos e ON c.equipamento_id = e.id
        ORDER BY c.aberto_em DESC
        LIMIT 5
      `);

      // Monta objeto de resumo
      const statusMap = {};
      chamadosPorStatus.forEach(r => { statusMap[r.status] = r.total; });

      const equipStatusMap = {};
      equipamentosPorStatus.forEach(r => { equipStatusMap[r.status] = r.total; });

      const usuariosMap = {};
      usuariosPorNivel.forEach(r => { usuariosMap[r.nivel_acesso] = r.total; });

      const resumo = {
        chamados: {
          total: totalChamadosRow[0].total,
          abertos: statusMap['aberto'] || 0,
          em_atendimento: statusMap['em_atendimento'] || 0,
          resolvidos: statusMap['resolvido'] || 0,
          cancelados: statusMap['cancelado'] || 0,
          por_status: chamadosPorStatus,
          por_prioridade: chamadosPorPrioridade,
          por_tecnico: chamadosPorTecnico,
          ultimos: ultimosChamados
        },
        equipamentos: {
          total: totalEquipamentosRow[0].total,
          operacionais: equipStatusMap['operacional'] || 0,
          em_manutencao: equipStatusMap['em_manutencao'] || 0,
          desativados: equipStatusMap['desativado'] || 0,
          por_status: equipamentosPorStatus
        },
        usuarios: {
          total: totalUsuariosRow[0].total,
          clientes: usuariosMap['cliente'] || 0,
          tecnicos: usuariosMap['tecnico'] || 0,
          admins: usuariosMap['admin'] || 0,
          por_nivel: usuariosPorNivel
        },
        manutencoes: {
          por_mes: manutencoesPorMes
        }
      };

      return res.status(200).json({
        sucesso: true,
        mensagem: "Dashboard admin recuperado",
        dados: resumo
      });
    } finally {
      conn.release();
    }
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao carregar dashboard admin",
      erro: e.message
    });
  }
};

// GET /dashboard/tecnico - painel do técnico
const painelTecnico = async (req, res) => {
  try {
    const tecnico_id = req.usuario.id;
    const conn = await db.getConnection();
    try {
      // Chamados abertos (disponíveis para aceitar)
      const [abertos] = await conn.query(`
        SELECT c.*,
          u_cli.nome AS cliente_nome,
          e.nome     AS equipamento_nome,
          e.categoria AS equipamento_categoria,
          e.patrimonio AS equipamento_patrimonio
        FROM chamados c
        JOIN usuarios u_cli ON c.cliente_id = u_cli.id
        JOIN equipamentos e ON c.equipamento_id = e.id
        WHERE c.status = 'aberto'
        ORDER BY FIELD(c.prioridade,'alta','media','baixa'), c.aberto_em ASC
      `);

      // Chamados em andamento do técnico
      const [emAndamento] = await conn.query(`
        SELECT c.*,
          u_cli.nome AS cliente_nome,
          e.nome     AS equipamento_nome,
          e.categoria AS equipamento_categoria,
          e.patrimonio AS equipamento_patrimonio
        FROM chamados c
        JOIN usuarios u_cli ON c.cliente_id = u_cli.id
        JOIN equipamentos e ON c.equipamento_id = e.id
        WHERE c.tecnico_id = ? AND c.status = 'em_atendimento'
        ORDER BY c.aberto_em ASC
      `, [tecnico_id]);

      // Chamados resolvidos pelo técnico (histórico)
      const [resolvidos] = await conn.query(`
        SELECT c.*,
          u_cli.nome AS cliente_nome,
          e.nome     AS equipamento_nome
        FROM chamados c
        JOIN usuarios u_cli ON c.cliente_id = u_cli.id
        JOIN equipamentos e ON c.equipamento_id = e.id
        WHERE c.tecnico_id = ? AND c.status = 'resolvido'
        ORDER BY c.atualizado_em DESC
        LIMIT 10
      `, [tecnico_id]);

      return res.status(200).json({
        sucesso: true,
        mensagem: "Painel técnico recuperado",
        dados: {
          disponiveis: abertos,
          em_andamento: emAndamento,
          resolvidos: resolvidos
        }
      });
    } finally {
      conn.release();
    }
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao carregar painel técnico",
      erro: e.message
    });
  }
};

module.exports = { resumoAdmin, painelTecnico };
