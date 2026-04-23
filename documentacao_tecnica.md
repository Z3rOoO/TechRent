# Documentação Técnica do Projeto TechRent

Este documento detalha as principais tecnologias e padrões arquiteturais empregados no desenvolvimento do sistema TechRent, oferecendo uma visão didática sobre suas funcionalidades e aplicações práticas dentro do projeto.

## 1. Visão Geral da Arquitetura

O TechRent adota uma arquitetura **Full-Stack** moderna, dividida em duas camadas principais: **Backend** (servidor) e **Frontend** (cliente). Essa separação permite maior escalabilidade, manutenção e flexibilidade no desenvolvimento.

- **Backend:** Construído com **Node.js** e **Express.js**, responsável pela lógica de negócios, autenticação, autorização e interação com o banco de dados. Utiliza **MySQL** como sistema de gerenciamento de banco de dados relacional.
- **Frontend:** Desenvolvido com **Next.js** (React Framework), **Tailwind CSS** para estilização e **Recharts** para visualização de dados no dashboard. É a interface que os usuários interagem.

## 2. Tecnologias do Backend

### 2.1. Node.js e Express.js

**Node.js** é um ambiente de tempo de execução JavaScript que permite executar código JavaScript no lado do servidor. Sua natureza assíncrona e orientada a eventos o torna ideal para construir APIs rápidas e escaláveis.

**Express.js** é um framework web minimalista e flexível para Node.js, que fornece um conjunto robusto de recursos para desenvolver aplicações web e APIs. No TechRent, o Express.js é utilizado para:

- **Definição de Rotas:** Gerencia os endpoints da API (ex: `/chamados`, `/equipamentos`, `/usuarios`).
- **Middlewares:** Funções que processam requisições HTTP (ex: `autenticar` e `autorizar` para segurança).
- **Controladores:** Lógica de negócios para cada rota, interagindo com o banco de dados.

**Exemplo de Uso (Rotas e Controller):**

```javascript
// backend/routes/chamadosRoutes.js
const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middlewares/auth');
const ctrl = require('../controllers/chamadosController');

router.get('/', autenticar, ctrl.listar);
router.post('/', autenticar, autorizar('cliente', 'admin'), ctrl.criar);
router.put('/:id/status', autenticar, autorizar('tecnico', 'admin'), ctrl.atualizarStatus);

module.exports = router;

// backend/controllers/chamadosController.js (trecho)
const listar = async (req, res) => {
  // Lógica para listar chamados, com filtros por perfil
};

const criar = async (req, res) => {
  // Lógica para criar um novo chamado
};

const atualizarStatus = async (req, res) => {
  // Lógica para atualizar o status de um chamado e do equipamento
};
```

### 2.2. MySQL (com `mysql2/promise`)

**MySQL** é um sistema de gerenciamento de banco de dados relacional (RDBMS) amplamente utilizado. No TechRent, ele armazena todos os dados da aplicação (usuários, equipamentos, chamados, manutenções).

A interação com o MySQL é feita através do módulo `mysql2/promise` para Node.js, que permite o uso de `async/await` para operações assíncronas com o banco de dados, tornando o código mais limpo e legível.

**Exemplo de Uso (Interação com DB):**

```javascript
// backend/config/db.js (trecho)
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// backend/controllers/chamadosController.js (trecho)
const criar = async (req, res) => {
  const { titulo, descricao, equipamento_id, prioridade } = req.body;
  const cliente_id = req.usuario.id;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Insere o chamado
    const [result] = await conn.execute(
      'INSERT INTO chamados (titulo, descricao, cliente_id, equipamento_id, prioridade) VALUES (?, ?, ?, ?, ?)',
      [titulo, descricao, cliente_id, equipamento_id, prioridade]
    );
    // Atualiza status do equipamento
    await conn.execute(
      'UPDATE equipamentos SET status = ? WHERE id = ?',
      ['em_manutencao', equipamento_id]
    );
    await conn.commit();
    res.status(201).json({ sucesso: true, mensagem: 'Chamado criado com sucesso', id: result.insertId });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar chamado', erro: error.message });
  } finally {
    conn.release();
  }
};
```

## 3. Tecnologias do Frontend

### 3.1. Next.js

**Next.js** é um framework React para construção de aplicações web full-stack. Ele oferece recursos como Server-Side Rendering (SSR), Static Site Generation (SSG) e roteamento baseado em sistema de arquivos, otimizando performance e SEO.

No TechRent, o Next.js é utilizado para:

- **Roteamento Baseado em Arquivos:** Cada arquivo `.jsx` dentro da pasta `src/app` (ou `src/pages`) se torna uma rota automaticamente (ex: `src/app/dashboard/page.jsx` -> `/dashboard`).
- **Componentes de Servidor e Cliente:** Permite a criação de componentes que rodam no servidor (`'use server'`) ou no cliente (`'use client'`), otimizando o carregamento e a interatividade.
- **Otimização de Imagens e Fontes:** Recursos embutidos para otimizar o carregamento de assets.

**Exemplo de Uso (Roteamento e Componentes):**

```jsx
// frontend/src/app/dashboard/page.jsx
"use client"; // Indica que este é um componente de cliente
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// ... imports de componentes e gráficos ...

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lógica para buscar dados do dashboard
  }, [router]);

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    // Estrutura do dashboard com gráficos e dados
    <div>
      <h1>Dashboard Administrativo</h1>
      {/* ... gráficos e outros elementos ... */}
    </div>
  );
}
```

### 3.2. Tailwind CSS

**Tailwind CSS** é um framework CSS utilitário que permite construir designs personalizados rapidamente, compondo classes de baixo nível diretamente no seu markup. Diferente de frameworks como Bootstrap, ele não oferece componentes pré-estilizados, mas sim classes utilitárias que podem ser combinadas para criar qualquer design.

**Vantagens no TechRent:**

- **Desenvolvimento Rápido:** Estilização diretamente no JSX, sem alternar entre arquivos CSS.
- **Customização Total:** Facilidade para criar um design único e responsivo.
- **Tamanho Otimizado:** O Tailwind remove todo o CSS não utilizado em produção, resultando em arquivos menores.

**Exemplo de Uso (Estilização):**

```jsx
// Trecho de um componente React com Tailwind CSS
<div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
  <h1 className="text-4xl font-bold text-slate-100">Dashboard Administrativo</h1>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 shadow-lg">
      <h2 className="text-lg font-semibold text-slate-200">Chamados Abertos</h2>
      <p className="text-3xl font-bold text-blue-400 mt-2">{chamados.abertos}</p>
    </div>
    {/* ... outros cards ... */}
  </div>
</div>
```

### 3.3. Recharts

**Recharts** é uma biblioteca de gráficos construída com React e D3.js, projetada para ser simples, flexível e personalizável. É ideal para adicionar visualizações de dados interativas em aplicações React.

No TechRent, o Recharts é usado no dashboard administrativo para exibir:

- Gráficos de pizza (PieChart) para status de chamados e equipamentos.
- Gráficos de barra (BarChart) para chamados por prioridade e por técnico.
- Gráficos de linha (LineChart) para o histórico de manutenções por mês.

**Exemplo de Uso (Gráfico de Pizza):**

```jsx
// frontend/src/app/dashboard/page.jsx (trecho)
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const chamadosStatusData = chamados.por_status.map(r => ({
  name: r.status.replace("_", " "),
  value: Number(r.total),
  fill: STATUS_CHAMADO_COLORS[r.status]
}));

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={chamadosStatusData}
      cx="50%"
      cy="50%"
      labelLine={false}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
    >
      {chamadosStatusData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.fill} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

### 3.4. shadcn/ui

**shadcn/ui** não é uma biblioteca de componentes tradicional, mas sim uma coleção de componentes UI reutilizáveis que você pode copiar e colar diretamente no seu projeto. Eles são construídos com **Radix UI** (para acessibilidade e comportamento) e estilizados com **Tailwind CSS**.

No TechRent, os componentes do shadcn/ui (ou inspirados nele) são usados para:

- **Consistência Visual:** Garante que elementos como botões, cards, inputs e modais tenham um design coeso.
- **Acessibilidade:** Componentes construídos com foco em acessibilidade por padrão.
- **Flexibilidade:** Permite total customização, pois o código-fonte é parte do projeto.

**Exemplo de Uso (Componente Card):**

```jsx
// frontend/src/components/ui/Card.jsx
import * as React from "react";
import { twMerge } from "tailwind-merge";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ... outros sub-componentes como CardTitle, CardContent, etc.

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

// Uso em uma página (ex: dashboard/page.jsx)
import Card, { CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";

<Card>
  <CardHeader>
    <CardTitle>Total de Chamados</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">{chamados.total}</p>
  </CardContent>
</Card>
```

## 4. Padrões de Projeto e Boas Práticas

### 4.1. Estrutura de Pastas

O projeto segue uma estrutura de pastas modular e clara, separando o backend e o frontend, e organizando os arquivos por funcionalidade e tipo (controllers, routes, components, app pages).

```
TechRent/
├── backend/
│   ├── controllers/    # Lógica de negócio da API
│   ├── middlewares/    # Funções de autenticação/autorização
│   ├── routes/         # Definição das rotas da API
│   ├── config/         # Configurações (ex: banco de dados)
│   ├── bd/             # Scripts SQL (schema, views)
│   └── server.js       # Ponto de entrada do backend
├── frontend/
│   ├── public/         # Assets estáticos
│   ├── src/
│   │   ├── app/        # Páginas da aplicação (Next.js App Router)
│   │   ├── components/ # Componentes React reutilizáveis
│   │   │   └── ui/     # Componentes UI (shadcn/ui-like)
│   │   ├── lib/        # Funções utilitárias
│   │   └── styles/     # Estilos globais (Tailwind CSS)
│   └── next.config.js  # Configuração do Next.js
├── .env.example        # Exemplo de variáveis de ambiente
└── package.json        # Dependências do projeto
```

### 4.2. Autenticação e Autorização (JWT)

O sistema utiliza **JSON Web Tokens (JWT)** para autenticação e autorização. Quando um usuário faz login, um token JWT é gerado e enviado ao cliente. Este token é então incluído em todas as requisições subsequentes para o backend, que o valida para verificar a identidade e as permissões do usuário (`autenticar` e `autorizar` middlewares).

### 4.3. Gerenciamento de Estado (React `useState`, `useEffect`)

No frontend, o gerenciamento de estado é feito principalmente com os Hooks `useState` e `useEffect` do React. `useState` gerencia o estado local dos componentes, enquanto `useEffect` lida com efeitos colaterais, como busca de dados da API, sincronização com o DOM e subscriptions.

### 4.4. Tratamento de Erros e Validação

O projeto implementa tratamento de erros tanto no backend (retornando mensagens de erro claras na API) quanto no frontend (exibindo alertas para o usuário). A validação de dados é realizada no backend para garantir a integridade das informações antes de serem persistidas no banco de dados.

## 5. Conclusão

O projeto TechRent é construído sobre uma base tecnológica robusta e moderna, utilizando ferramentas e padrões que promovem a escalabilidade, manutenibilidade e uma excelente experiência de desenvolvimento e usuário. A combinação de Next.js, Tailwind CSS, Recharts e um backend Node.js/Express/MySQL oferece uma solução completa e eficiente para o gerenciamento de equipamentos e chamados de manutenção.
