// =============================================
// CONTROLLER DE EQUIPAMENTOS
// =============================================
// TODO (alunos): implementar cada função abaixo.
// Cada função recebe (req, res) e deve retornar uma resposta JSON.

const db = require('../config/database');

// GET /equipamentos - lista todos os equipamentos do inventário
const listar = async (req, res) => {
  try {
    const equipamentos = await db.Read("equipamentos")//le os logs do banco
    return res.status(200).json({
      sucesso: true,
      mensagem: "Equipamentos lidos com sucesso",
      dados: equipamentos
    })
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao ler os equipamentos",
      erro: e.message
    })
  }
};

// GET /equipamentos/:id - retorna um equipamento pelo ID
const buscarPorId = async (req, res) => {
  try {
    const idEquipamento = req.params.id;

    const equipamento = await db.Read("equipamentos", ` id = '${idEquipamento}'`)//le os logs do banco

    return res.status(200).json({
      sucesso: true,
      mensagem: "Equipamento lido com sucesso",
      dados: equipamento
    })
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao ler o equipamento",
      erro: e.message
    })
  }
};

// POST /equipamentos - cria um novo equipamento (apenas admin)
const criar = async (req, res) => {
  try {
    const { nome, descricao, status } = req.body; // obtem os dados do corpo da requisição
    const novoEquipamento = { nome, descricao, status }; // cria um objeto com os dados do novo equipamento
    const id = await db.Create("equipamentos", novoEquipamento) // insere o novo equipamento no banco de dados e obtem o ID gerado
    return res.status(201).json({
      sucesso: true,
      mensagem: "Equipamento criado com sucesso",
      dados: { id, ...novoEquipamento } // retorna os dados do novo equipamento, incluindo o ID gerado
    })
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar o equipamento",
      erro: e.message
    })
  }
};

// PUT /equipamentos/:id - atualiza um equipamento (apenas admin)
const atualizar = async (req, res) => {
  try {
    const idEquipamento = req.params.id; // obtem o ID do equipamento a ser atualizado a partir dos parâmetros da URL
    const { nome, descricao, status } = req.body; // obtem os dados atualizados do corpo da requisição
    const equipamentoAtualizado = { nome, descricao, status }; // cria um objeto com os dados atualizados do equipamento
    const linhasAfetadas = await db.Update("equipamentos", equipamentoAtualizado, `id = '${idEquipamento}'`) // atualiza o equipamento no banco de dados e obtem o número de linhas afetadas
    if (linhasAfetadas > 0) { // se pelo menos uma linha foi afetada, a atualização foi bem-sucedida
      return res.status(200).json({
        sucesso: true,
        mensagem: "Equipamento atualizado com sucesso",
        dados: { id: idEquipamento, ...equipamentoAtualizado } // retorna os dados do equipamento atualizado, incluindo o ID
      })
    } else { // se nenhuma linha foi afetada, o equipamento com o ID especificado não foi encontrado
      return res.status(404).json({
        sucesso: false,
        mensagem: "Equipamento não encontrado",
        dados: null
      })
    }
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar o equipamento",
      erro: e.message
    })
  }
};

// DELETE /equipamentos/:id - remove um equipamento (apenas admin)
const remover = async (req, res) => {
  try {
    const idEquipamento = req.params.id; // obtem o ID do equipamento a ser removido a partir dos parâmetros da URL
    const linhasAfetadas = await db.Delete("equipamentos", `id = '${idEquipamento}'`) // remove o equipamento do banco de dados e obtem o número de linhas afetadas
    if (linhasAfetadas > 0) { // se pelo menos uma linha foi afetada, a remoção foi bem-sucedida
      return res.status(200).json({
        sucesso: true,
        mensagem: "Equipamento removido com sucesso",
        dados: null
      })
    } else { // se nenhuma linha foi afetada, o equipamento com o ID especificado não foi encontrado
      return res.status(404).json({
        sucesso: false,
        mensagem: "Equipamento não encontrado",
        dados: null
      })
    }
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao remover o equipamento",
      erro: e.message
    })
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, remover };
