# TechRent Frontend - Componentes UI

Este documento descreve os componentes UI disponíveis no frontend TechRent, que seguem a filosofia do shadcn/ui.

## Componentes Disponíveis

### Button

Componente de botão estilizado e acessível.

**Variants:**
- `default` - Botão primário (background preto)
- `outline` - Botão com borda
- `ghost` - Botão transparente
- `destructive` - Botão de risco (vermelho)

**Sizes:**
- `sm` - Pequeno
- `md` - Médio (padrão)
- `lg` - Grande

```jsx
import { Button } from "@/components/ui";

<Button>Clique aqui</Button>
<Button variant="outline">Clique aqui</Button>
<Button size="lg">Clique aqui</Button>
```

### Input

Campo de texto estilizado.

```jsx
import { Input } from "@/components/ui";

<Input placeholder="Digite algo..." />
<Input type="email" placeholder="email@example.com" />
```

### Card

Componente de cartão com suporte a sub-componentes.

**Sub-componentes:**
- `CardHeader` - Cabeçalho do cartão
- `CardTitle` - Título do cartão
- `CardDescription` - Descrição do cartão
- `CardContent` - Conteúdo principal
- `CardFooter` - Rodapé do cartão

```jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo aqui</CardContent>
</Card>
```

### Alert

Componente de alerta com diferentes variantes.

**Variants:**
- `default` - Alerta neutro
- `destructive` - Alerta de erro (vermelho)
- `success` - Alerta de sucesso (verde)

```jsx
import { Alert } from "@/components/ui";

<Alert variant="destructive">Erro ao processar</Alert>
<Alert variant="success">Operação concluída com sucesso</Alert>
```

### Badge

Rótulo/distintivo para estados ou categorias.

**Variants:**
- `default` - Preto
- `secondary` - Cinza
- `destructive` - Vermelho
- `success` - Verde
- `warning` - Amarelo

```jsx
import { Badge } from "@/components/ui";

<Badge variant="success">Disponível</Badge>
<Badge variant="destructive">Manutenção</Badge>
```

### Spinner

Indicador de carregamento giratório.

```jsx
import { Spinner } from "@/components/ui";

<Spinner />
<Spinner className="h-8 w-8" />
```

### Container

Wrapper com width máximo e padding automático.

```jsx
import { Container } from "@/components/ui";

<Container>
  <h1>Conteúdo centralizado</h1>
</Container>
```

### Navbar

Barra de navegação com suporte a usuário logado.

```jsx
import { Navbar } from "@/components/ui";

// Normalmente incluída no layout global
<Navbar />
```

## Utility Functions

### cn()

Função para mesclar classes Tailwind CSS de forma segura.

```jsx
import { cn } from "@/lib/utils";

const classes = cn("px-4 py-2", isActive && "bg-blue-500");
```

## Convenções de Styling

- Todos os componentes usam **Tailwind CSS** e seguem a paleta de cores `zinc`
- Os componentes suportam `className` para customização
- Use `forwardRef` para acesso ao DOM quando necessário
- Estados desativados usam `disabled:opacity-50 disabled:cursor-not-allowed`

## Integração com Next.js

Os componentes são marcados com `"use client"` e funcionam perfeitamente com o Next.js 16+ e React 19.

## Próximos Passos

- Considerar migração para `shadcn/ui` oficial se necessário
- Adicionar componentes adicionais: Modal, Dropdown, Tabs, etc.
- Criar stories no Storybook para documentação interativa
