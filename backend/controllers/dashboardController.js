// =============================================
// CONTROLLER DE DASHBOARD
// =============================================
// Usa as VIEWS do banco para retornar dados agregados.
// TODO (alunos): implementar cada função abaixo.

const db = require('../config/database');

// GET /dashboard/admin - resumo geral de chamados e equipamentos (apenas admin)
// Usa as views: view_resumo_chamados e view_resumo_equipamentos
const resumoAdmin = async (req, res) => {
  try {
    const resumoChamados = await db.Read("view_resumo_chamados")//le os logs do banco
    const resumoEquipamentos = await db.Read("view_resumo_equipamentos")//le os logs do banco
    return res.status(200).json({
      sucesso: true,
      mensagem: "Resumo do dashboard lido com sucesso",
      dados: {
        chamados: resumoChamados,
        equipamentos: resumoEquipamentos
      }
    })
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao ler o resumo do dashboard",
      erro: e.message
    })
  }
  
};

// GET /dashboard/tecnico - chamados abertos/em andamento (técnico/admin)
// Usa a view: view_painel_tecnico
const painelTecnico = async (req, res) => {
  // TODO
  try {
    const painel = await db.Read("view_painel_tecnico")
    return res.status(200).json({
      sucesso: true,
      mensagem: "Painel do técnico lido com sucesso",
      dados: painel
    })
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao ler o painel do técnico",
      erro: e.message
    })
  }
};

module.exports = { resumoAdmin, painelTecnico };
