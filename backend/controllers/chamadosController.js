// =============================================
// CONTROLLER DE CHAMADOS
// =============================================
// TODO (alunos): implementar cada função abaixo.
//
// Fluxo de status:
//   aberto -> em_atendimento -> resolvido
//                           -> cancelado

const db = require('../config/database');

// GET /chamados - lista chamados
//   admin/técnico -> todos os chamados
//   cliente       -> apenas os seus (WHERE cliente_id = req.usuario.id)
const listar = async (req, res) => {
  try {

    const nivel_acesso = req.usuario.nivel_acesso
    const id = req.usuario.id

    if (nivel_acesso == "tecnico" | nivel_acesso == "admin") {
      const chamados = await db.Read("chamados")//le os logs do banco
      return res.status(200).json({
        sucesso: true,
        mensagem: "Chamados lidas com sucesso",
        dados: chamados
      })
    } else {
      const chamados = await db.Read("chamados", `cliente_id = '${id}'`);
      return res.status(200).json({
        sucesso: true,
        mensagem: "Chamados lidos com sucesso",
        dados: chamados
      })
    }
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao ler os Chamados",
      erro: e.message
    })
  }

};

// GET /chamados/:id - retorna um chamado pelo ID
const buscarPorId = async (req, res) => {
  try {
    const idChamado = req.params.id;

    const chamado = await db.Read("chamados", ` id = '${idChamado}'`)//le os logs do banco
    return res.status(200).json({
      sucesso: true,
      mensagem: "Chamados lidas com sucesso",
      dados: chamado
    })
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao ler os Chamados",
      erro: e.message
    })
  }

};

// POST /chamados - abre um novo chamado (cliente/admin)
// Body esperado: { titulo, descricao, equipamento_id, prioridade }
const criar = async (req, res) => {
  // TODO: inserir em chamados com cliente_id = req.usuario.id
  //       e atualizar equipamentos.status para 'em_manutencao'
  try {
    const { titulo, descricao, equipamento_id, prioridade } = req.body; // obtém os dados do usuário a partir do corpo da requisição    
    const cliente_id = req.usuario.id
    const data = {
      titulo, 
      descricao, 
      cliente_id,
      equipamento_id,
      tecnico_id: null,
      prioridade,
      status: "aberto"
    }
    const result = await db.Create("chamados", data) // cria um novo usuário na tabela "usuarios" usando a função create do database.js
    return res.status(201).json({
      sucesso: true,
      mensagem: "Chamado efetuado com sucesso",
      dados: { id: result.insertId, ...data } // retorna o ID do novo usuário junto com os dados fornecidos
    })

  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao Realizar o chamado",
      erro: e.message
    })
  }
};

// PUT /chamados/:id/status - atualiza o status do chamado (técnico/admin)
// Body esperado: { status, tecnico_id (opcional) }
const atualizarStatus = async (req, res) => {
  // TODO: ex: aberto -> em_atendimento -> resolvido
  //       ao resolver, atualizar equipamentos.status para 'operacional'
  const { id } = req.params; // obtém o ID do usuário a partir dos parâmetros da rota
        const { status, tecnico_id } = req.body; // obtém os dados atualizados do usuário a partir do corpo da requisição
        const data = {
            status, 
            tecnico_id
        }
        try {
            const result = await db.Update("chamados", data, `id = ${id}`) // atualiza o usuário na tabela "usuarios" usando a função update do database.js, filtrando pelo ID
            return res.status(200).json({
                sucesso: true,
                mensagem: "chamado atualizado com sucesso",
                dados: result
            })
        } catch (e) {
            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao atualizar o usuário",
                erro: e.message
            })
        }
};

module.exports = { listar, buscarPorId, criar, atualizarStatus };
