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
  // Fluxo: aberto -> em_atendimento -> resolvido
  // Ao resolver, atualizar equipamentos.status para 'operacional'
  const { id } = req.params;
  const { status, tecnico_id } = req.body;
  
  try {
    // Busca o chamado para saber qual equipamento atualizar
    const chamado = await db.Read("chamados", `id = ${id}`);
    
    if (chamado.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Chamado não encontrado"
      });
    }

    const data = { status };
    if (tecnico_id) data.tecnico_id = tecnico_id;
    
    // Atualiza o status do chamado
    await db.Update("chamados", data, `id = ${id}`);
    
    // Se o status é "resolvido", atualiza o equipamento para "operacional"
    if (status === "resolvido") {
      await db.Update("equipamentos", { status: "operacional" }, `id = ${chamado[0].equipamento_id}`);
    }
    
    // Se o status é "em_atendimento", atualiza o equipamento para "em_manutencao"
    if (status === "em_atendimento") {
      await db.Update("equipamentos", { status: "em_manutencao" }, `id = ${chamado[0].equipamento_id}`);
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: "Chamado atualizado com sucesso",
      dados: { id, ...data }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar o chamado",
      erro: e.message
    });
  }
};

// PUT /chamados/:id/aceitar - técnico aceita o chamado
const aceitar = async (req, res) => {
  const { id } = req.params;
  const tecnico_id = req.usuario.id; // obtém o ID do técnico do token JWT

  try {
    // Busca o chamado
    const chamado = await db.Read("chamados", `id = ${id}`);
    
    if (chamado.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Chamado não encontrado"
      });
    }

    // Verifica se o chamado já foi aceito
    if (chamado[0].status !== "aberto") {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Apenas chamados abertos podem ser aceitos"
      });
    }

    // Atualiza o status para em_atendimento e atribui o técnico
    await db.Update("chamados", { status: "em_atendimento", tecnico_id }, `id = ${id}`);

    // Atualiza o equipamento para em_manutencao
    await db.Update("equipamentos", { status: "em_manutencao" }, `id = ${chamado[0].equipamento_id}`);

    return res.status(200).json({
      sucesso: true,
      mensagem: "Chamado aceito com sucesso",
      dados: { id, status: "em_atendimento", tecnico_id }
    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao aceitar o chamado",
      erro: e.message
    });
  }
};

module.exports = { listar, buscarPorId, criar, atualizarStatus, aceitar };
