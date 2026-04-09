// =============================================
// CONTROLLER DE AUTENTICAÇÃO
// =============================================
// TODO (alunos): implementar as funções registro e login.
//
// Dicas:
//   - Use bcryptjs para criptografar a senha antes de salvar (registro)
//   - Use bcryptjs para comparar a senha no login (bcrypt.compare)
//   - Use jsonwebtoken (jwt.sign) para gerar o token após login bem-sucedido
//   - O payload do token deve ter: id, nome, email, nivel_acesso
//   - NUNCA coloque a senha no payload do token!

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');


// POST /auth/registro - cria um novo usuário
const registro = async (req, res) => {
  try {
    const {
      nome,
      email,
      nivel_acesso,
      senha
    } = req.body;


    senhaHash = await db.hashPassword(senha);

    // cria usuário
    const datauser = { nome, email, nivel_acesso, senha: senhaHash };
    const result = await db.Create("usuarios", datauser) // cria um novo usuário na tabela "usuarios" usando a função create do database.js
    return res.status(201).json({
      sucesso: true,
      mensagem: "Usuário cadastrado com sucesso",
      dados: { id: result.insertId, ...datauser },

    });
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao registrar usuário",
      erro: e.message
    });
  }

};

// POST /auth/login - autentica e retorna JWT
const login = async (req, res) => {
  try {
    const { email, senha } = req.body
    const user = await db.Read("usuarios", `email = '${email}'`)// le o valor de email e senha do banco de dados



    if (user.length > 0) {// verifica valor retornado ou seja se o usuario existe
      const validacaoSenha = await db.comparePassword(senha, user[0].senha)
      if (validacaoSenha == true) {
        const token = jwt.sign({ id: user[0].id, email: user[0].email, nivel_acesso: user[0].nivel_acesso }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }) //cria o jwt e coloca os padrões do usuario juntamente com os do dotenv para criar um padrão unico para o usuario

        return res.status(200).json({
          token: token,
          sucesso: true,
          mensagem: "login bem-sucedido",
          dados: user[0] // retorna resultados do usuário encontrado
        })
      }else{
        return res.status(401).json({
        sucesso: false,
        mensagem: "Senha invalida"
      })  
      }
    } else {
      return res.status(401).json({
        sucesso: false,
        mensagem: "usuario não encontrado"
      })
    }
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao realizar login",
      erro: e.message
    })
  }
};

module.exports = { registro, login };
