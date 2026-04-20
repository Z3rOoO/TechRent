// =============================================
// CONTROLLER DE HISTÓRICO DE MANUTENÇÃO
// =============================================
// TODO (alunos): implementar cada função abaixo.

const db = require('../config/database');

// GET /manutencao - lista todos os registros de manutenção (admin/técnico)
const listar = async (req, res) => {
  try {
    const manutencao = await db.Read("historico_manutencao")//le os logs do banco
    return res.status(200).json({
      sucesso: true,
      mensagem: "Manutenção lida com sucesso",
      dados: manutencao
    })
  } catch (e) {
    console.log(e);
    
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao ler a manutenção",
      erro: e.message
    })
  }
};

// POST /manutencao - registra um reparo em um equipamento (técnico)
// Body esperado: { chamado_id, equipamento_id, descricao }
// Após registrar, atualizar chamados.status para 'resolvido'
// e equipamentos.status para 'operacional'
const registrar = async (req, res) => {
  try {
    const { chamado_id, equipamento_id, descricao } = req.body; // obtem os dados do corpo da requisição
    
    // Verifica se o chamado existe
    const chamado = await db.Read("chamados", `id = ${chamado_id}`);
    if (chamado.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Chamado não encontrado"
      });
    }

    // Cria o registro de manutenção
    const novoReparo = { chamado_id, equipamento_id, descricao };
    const id = await db.Create("historico_manutencao", novoReparo);
    
    // Atualiza o chamado para "resolvido"
    await db.Update("chamados", { status: "resolvido" }, `id = ${chamado_id}`);
    
    // Atualiza o equipamento para "operacional"
    await db.Update("equipamentos", { status: "operacional" }, `id = ${equipamento_id}`);

    return res.status(201).json({
      sucesso: true,
      mensagem: "Reparo registrado com sucesso",
      dados: { id, ...novoReparo }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao registrar o reparo",
      erro: e.message
    });
  }
};

module.exports = { listar, registrar };
