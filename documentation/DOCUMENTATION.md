# 📖 TechRent - Documentação & Índice

Bem-vindo ao TechRent! Este é um sistema moderno de gerenciamento de TI com frontend em Next.js e backend em Node.js.

## 🚀 Quick Links

- **[QUICK_START.md](./QUICK_START.md)** - Como rodar tudo localmente (⭐ COMECE AQUI)
- **[INTEGRATION.md](./INTEGRATION.md)** - Guia de integração frontend/backend
- **[frontend/COMPONENTS.md](./frontend/COMPONENTS.md)** - Referência de componentes UI
- **[FRONTEND_STATUS.md](./FRONTEND_STATUS.md)** - Status final da estilização

## 📚 Documentação Completa

### 🎨 Frontend
- **[frontend/README.md](./frontend/README.md)** - Documentação do frontend Next.js
- **[frontend/COMPONENTS.md](./frontend/COMPONENTS.md)** - Referência de componentes UI
- **[FRONTEND_SUMMARY.md](./FRONTEND_SUMMARY.md)** - Resumo das mudanças no frontend
- **[FRONTEND_STATUS.md](./FRONTEND_STATUS.md)** - Status final da estilização

### ⚙️ Backend
- **[backend/README.md](./backend/README.md)** - (Se existir) Documentação do backend
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - Instruções para AI/Copilot

### 🗄️ Banco de Dados
- **[bd/schema.sql](./bd/schema.sql)** - Schema das tabelas
- **[bd/views.sql](./bd/views.sql)** - Views (painel técnico, resumo admin, etc)

### 🔗 Integração
- **[INTEGRATION.md](./INTEGRATION.md)** - Guia de integração completo
- **[FILES_MANIFEST.md](./FILES_MANIFEST.md)** - Manifesto de arquivos criados/modificados

### 📊 Geral
- **[README.md](./README.md)** - Este arquivo (documentação geral)

## 🎯 Por Onde Começar?

### Se você quer rodar localmente:
1. Leia **[QUICK_START.md](./QUICK_START.md)**
2. Siga os passos de setup
3. Teste as funcionalidades

### Se você quer entender a arquitetura:
1. Leia **[INTEGRATION.md](./INTEGRATION.md)**
2. Veja a estrutura de pastas
3. Explore os fluxos de dados

### Se você quer modificar componentes UI:
1. Leia **[frontend/COMPONENTS.md](./frontend/COMPONENTS.md)**
2. Veja exemplos de uso
3. Modifique em `frontend/src/components/ui/`

### Se você é um AI/Copilot:
1. Leia **[.github/copilot-instructions.md](./.github/copilot-instructions.md)**
2. Ele tem tudo que você precisa para ser produtivo

## 📋 Estrutura do Projeto

```
TechRent/
├── bd/                          # Banco de dados
│   ├── schema.sql              # Tabelas
│   └── views.sql               # Views
│
├── backend/                     # Node.js + Express
│   ├── server.js               # Entrypoint (porta 3001)
│   ├── config/database.js      # Conexão MySQL
│   ├── routes/                 # Endpoints
│   ├── controllers/            # Lógica de negócio
│   ├── middlewares/auth.js     # JWT middleware
│   ├── package.json
│   └── .env                    # Variáveis de ambiente
│
├── frontend/                    # Next.js + React
│   ├── src/
│   │   ├── app/               # Páginas (App Router)
│   │   │   ├── page.js        # Home
│   │   │   ├── layout.js      # Layout global
│   │   │   ├── login/
│   │   │   ├── equipamentos/
│   │   │   ├── chamados/
│   │   │   ├── manutencao/
│   │   │   └── dashboard/
│   │   ├── components/ui/     # Componentes reutilizáveis
│   │   └── lib/               # Utilitários
│   ├── COMPONENTS.md          # Referência de componentes
│   ├── package.json
│   └── .env.local
│
├── .github/
│   └── copilot-instructions.md # Instruções para AI
│
└── Documentação
    ├── README.md               # Este arquivo
    ├── QUICK_START.md         # Como rodar
    ├── INTEGRATION.md         # Guia de integração
    ├── FRONTEND_STATUS.md     # Status do frontend
    ├── FRONTEND_SUMMARY.md    # Resumo de mudanças
    └── FILES_MANIFEST.md      # Manifesto de arquivos
```

## 🛠️ Stack Técnico

### Backend
- **Node.js** 18+
- **Express.js** 4.18+
- **MySQL** 8+
- **JWT** para autenticação
- **bcryptjs** para criptografia

### Frontend
- **Next.js** 16.2.0
- **React** 19.2.4
- **Tailwind CSS** 4
- **Componentes UI** (shadcn-like)
- **TypeScript** ready

### Banco de Dados
- **MySQL** com schema relacional
- **Views** para agregações
- **Foreign keys** para integridade

## 🔐 Autenticação

- JWT-based
- Armazenado em localStorage
- Incluído automaticamente em requisições
- 3 roles: `cliente`, `tech`, `admin`

## 📊 Páginas & Funcionalidades

| Página | Acesso | O que faz |
|--------|--------|-----------|
| `/` | Público | Landing page com features |
| `/login` | Público | Formulário de login |
| `/equipamentos` | Autenticado | Lista todos os equipamentos |
| `/chamados` | Autenticado | Lista chamados (personalizado por role) |
| `/manutencao` | Tech/Admin | Histórico de reparos |
| `/dashboard` | Admin | Resumo geral do sistema |

## 🚀 Como Rodar

### Pré-requisitos
```bash
Node.js 18+
MySQL 8+
npm ou yarn
```

### Setup Rápido
```bash
# 1. Database
mysql -u root -p < bd/schema.sql
mysql -u root -p < bd/views.sql

# 2. Backend
cd backend
npm install
# Configure .env com DB credentials
npm run dev

# 3. Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:3000` 🎉

Veja **[QUICK_START.md](./QUICK_START.md)** para instruções detalhadas.

## 🧪 Como Testar

1. Criar usuário via `/auth/registro` ou via SQL
2. Login em `/login`
3. Navegar pelas páginas
4. Verificar se dados carregam (GET)
5. Testar logout

## 📝 Convenções

### Código
- JavaScript/JSX (sem TypeScript, mas TypeScript-ready)
- `"use client"` em componentes React
- forwardRef para componentes customizáveis
- Props pattern (não context, salvo exceções)

### Estilo
- Tailwind CSS
- Paleta: `zinc` (cinza), mais `green`, `red`, `yellow`
- Componentes reutilizáveis
- Semantic class names

### Naming
- Componentes: PascalCase (Button, Input, Card)
- Variáveis/funções: camelCase (handleClick, buttonText)
- Arquivos: lowercase (button.js, input.js)

### API
- REST endpoints
- Response: `{ sucesso, mensagem, dados }`
- Erro: `{ sucesso: false, mensagem, erro }`
- Portuguese keys/messages

## ✅ Checklist de Setup

- [ ] MySQL instalado e rodando
- [ ] `techrent_db` criado
- [ ] `bd/schema.sql` importado
- [ ] `bd/views.sql` importado
- [ ] `backend/.env` configurado
- [ ] `frontend/.env.local` configurado
- [ ] Backend `npm install` ✓
- [ ] Frontend `npm install` ✓
- [ ] Backend rodando em http://localhost:3001
- [ ] Frontend rodando em http://localhost:3000
- [ ] Login funcionando
- [ ] Dados carregando

## 🐛 Troubleshooting

### Banco de dados não conecta
```
Verifique:
- MySQL está rodando?
- Credenciais em backend/.env estão corretas?
- Banco techrent_db foi criado?
```

### CORS error
```
Solução: Ativar CORS em backend/server.js
const cors = require('cors');
app.use(cors());
```

### Componentes não aparecem
```
Solução:
- npm install no frontend
- Limpar cache: rm -rf .next
- Rodar npm run dev novamente
```

## 📞 Contato & Suporte

Para dúvidas ou issues:
1. Verifique a documentação apropriada
2. Confira QUICK_START.md ou INTEGRATION.md
3. Verifique logs do terminal/console
4. Leia copilot-instructions.md (para AI)

## 📄 Licença

TechRent © 2026

---

## 🔍 Index Rápido de Arquivos

### Frontend Componentes
- `frontend/src/components/ui/Button.js`
- `frontend/src/components/ui/Input.js`
- `frontend/src/components/ui/Card.js`
- `frontend/src/components/ui/Alert.js`
- `frontend/src/components/ui/Badge.js`
- `frontend/src/components/ui/Spinner.js`
- `frontend/src/components/ui/Container.js`
- `frontend/src/components/ui/Navbar.js`

### Backend Rotas
- `backend/routes/authRoutes.js` - `/auth/*`
- `backend/routes/equipamentosRoutes.js` - `/equipamentos/*`
- `backend/routes/chamadosRoutes.js` - `/chamados/*`
- `backend/routes/manutencaoRoutes.js` - `/manutencao/*`
- `backend/routes/dashboardRoutes.js` - `/dashboard/*`

### Documentação
- [QUICK_START.md](./QUICK_START.md) - Como rodar
- [INTEGRATION.md](./INTEGRATION.md) - Integração
- [frontend/COMPONENTS.md](./frontend/COMPONENTS.md) - Componentes
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Para AI

---

**Última atualização:** Abril 2026
**Status:** ✅ Pronto para uso
**Versão:** 1.0.0
