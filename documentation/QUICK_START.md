# 🚀 Como Rodar o TechRent Completo

Guia rápido para colocar o projeto funcionando localmente.

## ⚙️ Pré-requisitos

- Node.js 18+ (ou 16+)
- MySQL 8+ rodando localmente
- Git (para clonar o repo)

## 📋 1. Setup do Banco de Dados

```bash
# Conectar ao MySQL
mysql -u root -p

# No prompt do MySQL:
SOURCE bd/schema.sql;
SOURCE bd/views.sql;

# Verificar se foi criado
SHOW DATABASES;      # Deve conter techrent_db
USE techrent_db;
SHOW TABLES;         # Deve conter usuarios, equipamentos, chamados, etc.
SHOW VIEWS;          # Deve conter as views
```

## 📝 2. Variáveis de Ambiente

### Backend (criar `backend/.env`)
```env
PORT=3001
JWT_SECRET=sua_chave_super_secreta_aqui_2024
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=seu_password_mysql
DB_NAME=techrent_db
```

### Frontend (criar `frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🔧 3. Instalar Dependências

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## ▶️ 4. Rodar em Desenvolvimento

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Saída esperada:
```
Conexão com o banco de dados bem-sucedida!
Servidor rodando em http://localhost:3001
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Saída esperada:
```
▲ Next.js 16.2.0

  ➜ Local:        http://localhost:3000
  ➜ Environments: .env.local
```

## 🌐 5. Acessar a Aplicação

1. Abrir `http://localhost:3000` no navegador
2. Você verá a home do TechRent
3. Clicar em "Entrar" para ir para `/login`
4. Usar credenciais de um usuário criado no banco

## 🧪 6. Dados de Teste

### Criar usuários de teste (no MySQL)

```sql
USE techrent_db;

-- Cliente de teste
INSERT INTO usuarios (nome, email, nivel_acesso, senha)
VALUES ('João Cliente', 'cliente@techrent.com', 'cliente', SHA2('senha123', 256));

-- Técnico de teste
INSERT INTO usuarios (nome, email, nivel_acesso, senha)
VALUES ('Maria Técnico', 'tecnico@techrent.com', 'tecnico', SHA2('senha123', 256));

-- Admin de teste
INSERT INTO usuarios (nome, email, nivel_acesso, senha)
VALUES ('Admin System', 'admin@techrent.com', 'admin', SHA2('senha123', 256));

-- Equipamentos de teste
INSERT INTO equipamentos (nome, categoria, preco_diaria, status, descricao)
VALUES 
  ('Laptop Dell', 'Laptop', 50.00, 'disponivel', 'Dell Inspiron 15'),
  ('Projetor Epson', 'Projetor', 100.00, 'disponivel', 'Projetor para salas'),
  ('Servidor HP', 'Servidor', 200.00, 'manutencao', 'Servidor para backup');
```

⚠️ **Nota:** Se o hash não funcionar, use a função `hashPassword` do backend ou use a rota `/auth/registro`.

## 🔐 7. Login

1. Ir para `http://localhost:3000/login`
2. Usar email: `admin@techrent.com`
3. Usar senha: `senha123`
4. Token será armazenado em localStorage
5. Você será redirecionado para home com navbar mostrando seu nome

## 📲 8. Testar Funcionalidades

### Home (`/`)
- Apresentação geral
- Links para todas as seções

### Equipamentos (`/equipamentos`)
- Lista todos os equipamentos
- Mostra status com badge colorida
- Requer autenticação

### Chamados (`/chamados`)
- Lista chamados
- Cliente vê só seus
- Tech/Admin veem todos
- Status com badge colorida

### Manutenção (`/manutencao`)
- Histórico de reparos
- Apenas tech/admin
- Datas formatadas

### Dashboard (`/dashboard`)
- Resumo de chamados
- Resumo de equipamentos
- Apenas admin

## 🛑 9. Parar a Aplicação

```bash
# Ctrl + C em ambos os terminais
# Ou: command + C no macOS
```

## 🐛 Troubleshooting

### Erro: "Conexão com banco recusada"
```
Solução:
1. Verificar se MySQL está rodando
2. Verificar credenciais em backend/.env
3. Confirmar que techrent_db foi criado
```

### Erro: "Token inválido"
```
Solução:
1. Verificar JWT_SECRET em backend/.env
2. Limpar localStorage (F12 > Storage > Clear All)
3. Fazer login novamente
```

### Erro: "CORS error"
```
Solução:
1. Verificar se backend está em http://localhost:3001
2. Se necessário, ativar CORS em backend/server.js:
   const cors = require('cors');
   app.use(cors());
```

### Componentes não renderizam
```
Solução:
1. Limpar cache: rm -rf frontend/.next
2. Reinstalar: cd frontend && npm install
3. Rodar: npm run dev
```

## 📊 Estrutura de Pastas

```
TechRent/
├── bd/
│   ├── schema.sql          # Tabelas
│   └── views.sql           # Views
├── backend/
│   ├── server.js           # Entrypoint
│   ├── config/database.js  # Conexão MySQL
│   ├── routes/             # Endpoints
│   ├── controllers/        # Lógica
│   ├── middlewares/auth.js # JWT
│   └── .env               # Variáveis
├── frontend/
│   ├── src/app/           # Páginas
│   ├── src/components/ui/ # Componentes
│   ├── src/lib/           # Utilitários
│   └── .env.local         # Variáveis
├── INTEGRATION.md         # Documentação integração
└── FRONTEND_SUMMARY.md    # Resumo frontend
```

## 🎯 Fluxo de Desenvolvimento

1. **Modificar backend** → Salvar → Nodemon recarrega automaticamente
2. **Modificar frontend** → Salvar → Next.js recarrega automaticamente
3. **Modificar banco** → Executar SQL novamente em MySQL

## 💡 Dicas

- Use F12 no navegador para inspecionar Network e Console
- Verifique terminal do backend para logs de erro
- Use `console.log()` no frontend e veja saída no browser
- Mantenha os 2 terminais (backend + frontend) sempre abertos

## 📚 Documentação

- [INTEGRATION.md](./INTEGRATION.md) - Guia completo de integração
- [frontend/COMPONENTS.md](./frontend/COMPONENTS.md) - Referência de componentes
- [frontend/README.md](./frontend/README.md) - Documentação frontend
- [README.md](./README.md) - Documentação geral

## ✅ Checklist

- [ ] MySQL instalado e rodando
- [ ] Banco criado (schema.sql + views.sql)
- [ ] backend/.env configurado
- [ ] frontend/.env.local configurado
- [ ] backend npm install ✓
- [ ] frontend npm install ✓
- [ ] Backend rodando na porta 3001
- [ ] Frontend rodando na porta 3000
- [ ] Login funcionando
- [ ] Equipamentos carregando
- [ ] Chamados carregando

Quando tudo estiver funcionando, você verá:
```
✅ Backend: http://localhost:3001 rodando
✅ Frontend: http://localhost:3000 rodando
✅ Banco: techrent_db conectado
✅ Sistema pronto para usar!
```

---

**Dúvidas?** Verifique os arquivos de documentação ou os logs no terminal/console.
