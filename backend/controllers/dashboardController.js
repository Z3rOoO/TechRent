// =============================================
// CONTROLLER DE DASHBOARD
// =============================================
const db = require('../config/database');

// GET /dashboard/admin - resumo geral (admin only)
const resumoAdmin = async (req, res) => {
  try {
    // Busca dados reais das tabelas para o resumo
    const totalChamados = await db.Read("chamados");
    const totalEquipamentos = await db.Read("equipamentos");
    const totalUsuarios = await db.Read("usuarios");
    const manutencoes = await db.Read("manutencao");

    const resumo = {
      chamados: {
        total: totalChamados.length,
        abertos: totalChamados.filter(c => c.status === 'aberto').length,
        em_atendimento: totalChamados.filter(c => c.status === 'em_atendimento').length,
        resolvidos: totalChamados.filter(c => c.status === 'resolvido').length,
      },
      equipamentos: {
        total: totalEquipamentos.length,
        disponiveis: totalEquipamentos.filter(e => e.status === 'disponivel').length,
        manutencao: totalEquipamentos.filter(e => e.status === 'manutencao').length,
        alugados: totalEquipamentos.filter(e => e.status === 'alugado').length,
      },
      usuarios: totalUsuarios.length,
      financeiro: {
        custo_manutencao: manutencoes.reduce((acc, m) => acc + (parseFloat(m.custo) || 0), 0)
      }
    };

    return res.status(200).json({
      sucesso: true,
      mensagem: "Dashboard admin recuperado",
      dados: resumo
    });
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
    
    const abertos = await db.Read("chamados", "status = 'aberto'");
    const meusChamados = await db.Read("chamados", `tecnico_id = ${tecnico_id} AND status = 'em_atendimento'`);
    
    return res.status(200).json({
      sucesso: true,
      mensagem: "Painel técnico recuperado",
      dados: {
        disponiveis: abertos,
        em_andamento: meusChamados
      }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao carregar painel técnico",
      erro: e.message
    });
  }
};

module.exports = { resumoAdmin, painelTecnico };
