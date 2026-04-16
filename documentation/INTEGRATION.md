# TechRent - Guia de Integração Frontend/Backend

## Arquitetura

```
TechRent/
├── backend/          (Node.js + Express)
│   ├── server.js     (Entrypoint na porta 3001)
│   ├── routes/       (Router + Endpoints)
│   ├── controllers/   (Lógica de negócio)
│   ├── middlewares/   (Auth JWT)
│   └── config/       (Conexão MySQL)
│
└── frontend/         (Next.js + React)
    ├── src/app/      (App Router)
    ├── src/components/ui/  (Componentes shadcn-like)
    └── src/lib/      (Utilities)
```

## Como Rodas Localmente

### Backend

```bash
cd backend
npm install
npm run dev   # Inicia na porta 3001 com nodemon
```

### Frontend

```bash
cd frontend
npm install
npm run dev   # Inicia na porta 3000
```

## Autenticação (JWT)

1. **Login** → `POST /auth/login`
   - Body: `{ email, senha }`
   - Response: `{ token, dados: { id, email, nome, nivel_acesso } }`

2. **Armazenamento** → `localStorage`
   - `techrent_token` - JWT para requisições autenticadas
   - `techrent_user` - Dados do usuário logado

3. **Requisições Autenticadas**
   ```javascript
   const token = localStorage.getItem("techrent_token");
   fetch("http://localhost:3001/equipamentos", {
     headers: { Authorization: `Bearer ${token}` }
   });
   ```

## Rotas do Backend

### Auth
- `POST /auth/registro` - Registrar novo usuário
- `POST /auth/login` - Login e obter JWT

### Equipamentos
- `GET /equipamentos` - Listar todos
- `GET /equipamentos/:id` - Buscar por ID
- `POST /equipamentos` - Criar (admin)
- `PUT /equipamentos/:id` - Atualizar (admin)
- `DELETE /equipamentos/:id` - Remover (admin)

### Chamados
- `GET /chamados` - Listar (cliente vê seus, admin/tech veem todos)
- `GET /chamados/:id` - Buscar por ID
- `POST /chamados` - Criar novo (cliente/admin)
- `PUT /chamados/:id/status` - Atualizar status (tech/admin)

### Manutenção
- `GET /manutencao` - Listar (admin/tech)
- `POST /manutencao` - Registrar reparo (tech)

### Dashboard
- `GET /dashboard/admin` - Resumo geral (admin)
- `GET /dashboard/tecnico` - Painel técnico (tech/admin)

## Padrão de Resposta Backend

```json
{
  "sucesso": true,
  "mensagem": "Descrição da operação",
  "dados": { /* resultado */ }
}
```

## Páginas Frontend

### `/login`
- Form de entrada
- Armazena token + usuário em localStorage
- Redireciona para home após sucesso

### `/equipamentos`
- Lista todos os equipamentos
- Cards com status (disponível, alugado, manutenção)
- Badge colorida por status

### `/chamados`
- Lista chamados (personalizado por role)
- Cards com título, status, cliente, equipamento
- Badge colorida por status

### `/manutencao`
- Histórico de reparos realizados
- Cards com data, descrição, equipamento
- Apenas acessível para tech/admin

### `/dashboard`
- Resumo de chamados por status
- Resumo de equipamentos com potencial receita
- Apenas acessível para admin

## Componentes UI Utilizados

- `Button` - Botões com variantes
- `Input` - Campos de texto
- `Card` + `CardHeader` + `CardTitle` + `CardContent` - Cartões
- `Alert` - Mensagens de erro/sucesso
- `Badge` - Rótulos de status
- `Spinner` - Indicador de carregamento
- `Container` - Wrapper com max-width
- `Navbar` - Navegação com user info

## CORS

Se frontend (localhost:3000) e backend (localhost:3001) rodarem em portas diferentes, ative CORS no backend:

```javascript
// em server.js
const cors = require('cors');
app.use(cors());
```

## Variáveis de Ambiente

### Backend (`.env`)
```
PORT=3001
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=seu_password
DB_NAME=techrent_db
```

### Frontend (não usa `.env`, mas pode adicionar `.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Fluxos Comuns

### 1. Novo Chamado
1. Cliente navega para `/chamados`
2. Clica em "Novo Chamado"
3. Preenche form com título, descrição, equipamento
4. POST `/chamados` com `cliente_id = req.usuario.id`
5. Equipamento muda status para `em_manutencao`

### 2. Técnico Resolve Chamado
1. Técnico navega para `/dashboard/tecnico` (view_painel_tecnico)
2. Vê lista de chamados abertos/em_atendimento
3. Clica para atualizar status
4. PUT `/chamados/:id/status` → `resolvido`
5. POST `/manutencao` com descrição do reparo
6. Equipamento volta para `disponivel`

### 3. Admin Vê Dashboard
1. Admin navega para `/dashboard`
2. GET `/dashboard/admin`
3. Vê resumo de chamados por status
4. Vê resumo de equipamentos com potencial receita diária

## Troubleshooting

### "Token inválido ou expirado"
- Verifique se o token está sendo enviado corretamente no header
- Confirme que `JWT_SECRET` é o mesmo no backend e no login

### "Erro ao conectar ao banco"
- Verifique as variáveis de ambiente DB_*
- Confirme que MySQL está rodando
- Confirme que `techrent_db` foi criado e as views foram importadas

### "CORS error"
- Verifique se CORS está ativado no backend
- Confirme que as portas (3000 frontend, 3001 backend) estão corretas

## Próximos Passos

- [ ] Implementar forms de criação/edição (PUT, POST)
- [ ] Adicionar modal/dialog para confirmações
- [ ] Implementar busca/filtros em listagens
- [ ] Adicionar paginação
- [ ] Melhorar tratamento de erros
- [ ] Adicionar loading skeleton screens
- [ ] Testes unitários e E2E
