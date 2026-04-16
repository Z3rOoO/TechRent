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
    const novoReparo = { chamado_id, equipamento_id, descricao }; // cria um objeto com os dados do novo reparo
    const id = await db.Create("manutencao", novoReparo) // insere o novo reparo no banco de dados e obtem o ID gerado
    return res.status(201).json({
      sucesso: true,
      mensagem: "Reparo registrado com sucesso",
      dados: { id, ...novoReparo }
    })
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao registrar o reparo",
      erro: e.message
    })
  }
};

module.exports = { listar, registrar };
