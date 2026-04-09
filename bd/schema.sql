-- =============================================
-- TECHRENT - SISTEMA DE CHAMADOS DE TI
-- =============================================
-- Execute este arquivo antes do views.sql

CREATE DATABASE IF NOT EXISTS techrent_db;
USE techrent_db;

-- =============================================
-- 1. USUÁRIOS
-- =============================================
-- Armazena todos os perfis do sistema.
-- nivel_acesso define o que cada usuário pode fazer:
--   'cliente'  -> abre chamados
--   'tecnico'  -> atende chamados
--   'admin'    -> gerencia tudo
CREATE TABLE usuarios (
    id           INT PRIMARY KEY AUTO_INCREMENT,
    nome         VARCHAR(100)  NOT NULL,
    email        VARCHAR(100)  UNIQUE NOT NULL,
    senha        VARCHAR(255)  NOT NULL, -- sempre salvar o HASH (bcrypt), nunca a senha em texto
    nivel_acesso ENUM('cliente', 'admin', 'tecnico') DEFAULT 'cliente',
    criado_em    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. EQUIPAMENTOS
-- =============================================
-- Inventário de máquinas/dispositivos do laboratório.
-- O campo 'status' indica a condição operacional do equipamento:
--   'operacional'   -> funcionando normalmente; cliente pode abrir chamado
--   'em_manutencao' -> com chamado aberto / sendo atendido pelo técnico
--   'desativado'    -> aposentado ou descartado; fora do sistema
CREATE TABLE equipamentos (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    nome        VARCHAR(100) NOT NULL,
    categoria   VARCHAR(50),              -- Ex: Notebook, Projetor, Impressora, Servidor
    patrimonio  VARCHAR(50) UNIQUE,       -- número de patrimônio (etiqueta física)
    status      ENUM('operacional', 'em_manutencao', 'desativado') DEFAULT 'operacional',
    descricao   TEXT
);

-- =============================================
-- 3. CHAMADOS
-- =============================================
-- Registro central de cada solicitação de atendimento.
-- Um chamado vincula um cliente a um equipamento com problema.
-- O campo 'tecnico_id' é preenchido quando um técnico assume o chamado.
--
-- Fluxo de status:
--   aberto -> em_atendimento -> resolvido
--                           -> cancelado
CREATE TABLE chamados (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    titulo         VARCHAR(150) NOT NULL,           -- breve descrição do problema
    descricao      TEXT,                             -- detalhes informados pelo cliente
    cliente_id     INT NOT NULL,                     -- quem abriu o chamado
    equipamento_id INT NOT NULL,                     -- equipamento com problema
    tecnico_id     INT,                              -- técnico responsável (pode ser NULL no início)
    prioridade     ENUM('baixa', 'media', 'alta') DEFAULT 'media',
    status         ENUM('aberto', 'em_atendimento', 'resolvido', 'cancelado') DEFAULT 'aberto',
    aberto_em      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Um chamado pertence a um cliente
    CONSTRAINT fk_chamado_cliente   FOREIGN KEY (cliente_id)
        REFERENCES usuarios(id) ON DELETE CASCADE,

    -- Um chamado está vinculado a um equipamento
    CONSTRAINT fk_chamado_equip     FOREIGN KEY (equipamento_id)
        REFERENCES equipamentos(id) ON DELETE CASCADE,

    -- Um chamado pode (ou não) ter um técnico responsável
    CONSTRAINT fk_chamado_tecnico   FOREIGN KEY (tecnico_id)
        REFERENCES usuarios(id) ON DELETE SET NULL
);

-- =============================================
-- 4. HISTÓRICO DE MANUTENÇÃO
-- =============================================
-- Cada registro descreve uma ação realizada pelo técnico
-- em um equipamento, vinculado ao chamado correspondente.
CREATE TABLE historico_manutencao (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    chamado_id     INT NOT NULL,                     -- qual chamado originou o registro
    equipamento_id INT NOT NULL,
    tecnico_id     INT NOT NULL,
    descricao      TEXT NOT NULL,                    -- o que foi feito
    registrado_em  DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_chamado FOREIGN KEY (chamado_id)
        REFERENCES chamados(id) ON DELETE CASCADE,

    CONSTRAINT fk_hist_equip   FOREIGN KEY (equipamento_id)
        REFERENCES equipamentos(id) ON DELETE CASCADE,

    CONSTRAINT fk_hist_tecnico FOREIGN KEY (tecnico_id)
        REFERENCES usuarios(id)
);

-- ==============================================================================
-- 1. USUÁRIOS (Todas as roles: 3 clientes, 3 técnicos, 1 admin)
-- IDs gerados: 1, 2, 3 (Clientes) | 4, 5, 6 (Técnicos) | 7 (Admin)
-- senha 123456 = $2b$10$wassH2Eh2Avtg0PG.Bbmg.T3HqItoqnjMi0As0Nib8kkfPK3Y2ky2
-- ==============================================================================
INSERT INTO usuarios (nome, email, senha, nivel_acesso, criado_em) VALUES
('João da Silva', 'joao.cliente@email.com', '$2b$10$wassH2Eh2Avtg0PG.Bbmg.T3HqItoqnjMi0As0Nib8kkfPK3Y2ky2', 'cliente', NOW() - INTERVAL 30 DAY),
('Maria Souza', 'maria.cliente@email.com', '$2b$10$wassH2Eh2Avtg0PG.Bbmg.T3HqItoqnjMi0As0Nib8kkfPK3Y2ky2', 'cliente', NOW() - INTERVAL 25 DAY),
('Pedro Alves', 'pedro.cliente@email.com', '$2b$10$wassH2Eh2Avtg0PG.Bbmg.T3HqItoqnjMi0As0Nib8kkfPK3Y2ky2', 'cliente', NOW() - INTERVAL 20 DAY),
('Carlos Oliveira', 'carlos.tecnico@email.com', '$2b$10$wassH2Eh2Avtg0PG.Bbmg.T3HqItoqnjMi0As0Nib8kkfPK3Y2ky2', 'tecnico', NOW() - INTERVAL 60 DAY),
('Ana Costa', 'ana.tecnica@email.com', '$2b$10$wassH2Eh2Avtg0PG.Bbmg.T3HqItoqnjMi0As0Nib8kkfPK3Y2ky2', 'tecnico', NOW() - INTERVAL 55 DAY),
('Lucas Mendes', 'lucas.tecnico@email.com', '$2b$10$wassH2Eh2Avtg0PG.Bbmg.T3HqItoqnjMi0As0Nib8kkfPK3Y2ky2', 'tecnico', NOW() - INTERVAL 50 DAY),
('Administrador Master', 'admin@sistema.com', '$2b$10$wassH2Eh2Avtg0PG.Bbmg.T3HqItoqnjMi0As0Nib8kkfPK3Y2ky2', 'admin', NOW() - INTERVAL 100 DAY);

-- ==============================================================================
-- 2. EQUIPAMENTOS (Todas as categorias e status)
-- IDs gerados: 1 a 7
-- ==============================================================================
INSERT INTO equipamentos (nome, categoria, patrimonio, status, descricao) VALUES
('Notebook Dell Latitude', 'Computador', 'PAT-001', 'operacional', 'Notebook i7 16GB do setor financeiro.'),
('Impressora HP LaserJet', 'Impressora', 'PAT-002', 'em_manutencao', 'Apresentando atolamento de papel.'),
('Servidor Dell PowerEdge', 'Servidor', 'PAT-003', 'operacional', 'Servidor principal do banco de dados.'),
('Monitor LG 24"', 'Periférico', 'PAT-004', 'desativado', 'Tela trincada, aguardando descarte.'),
('Roteador Cisco', 'Rede', 'PAT-005', 'operacional', 'Roteador principal andar térreo.'),
('Switch 24 portas TP-Link', 'Rede', 'PAT-006', 'em_manutencao', 'Portas 1 a 5 queimadas após tempestade.'),
('Projetor Epson', 'Apresentacao', 'PAT-007', 'desativado', 'Lâmpada queimada e modelo obsoleto.');

-- ==============================================================================
-- 3. CHAMADOS (Todas as combinações de status e prioridades)
-- Lógica:
-- 'aberto' -> tecnico_id = NULL
-- 'em_atendimento' / 'resolvido' -> tecnico_id preenchido
-- ==============================================================================
INSERT INTO chamados (titulo, descricao, cliente_id, equipamento_id, tecnico_id, prioridade, status, aberto_em, atualizado_em) VALUES
-- Status: ABERTO (Aguardando técnico assumir)
('Impressora não liga', 'A impressora parou de ligar hoje cedo.', 1, 2, NULL, 'alta', 'aberto', NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR),
('Portas de rede inativas', 'Alguns computadores perderam a rede.', 2, 6, NULL, 'media', 'aberto', NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 5 HOUR),
('Solicitação de novo cabo', 'Preciso de um cabo HDMI maior.', 3, 4, NULL, 'baixa', 'aberto', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY),

-- Status: EM_ATENDIMENTO (Técnicos trabalhando neles)
('Servidor muito lento', 'As consultas estão demorando muito.', 1, 3, 4, 'alta', 'em_atendimento', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 HOUR),
('Roteador caindo toda hora', 'Wi-Fi instável na recepção.', 2, 5, 5, 'media', 'em_atendimento', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 4 HOUR),
('Lentidão no Windows', 'O notebook demora muito para iniciar.', 3, 1, 6, 'baixa', 'em_atendimento', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY),

-- Status: RESOLVIDO (Finalizados com sucesso)
('Substituição de Switch', 'Trocar equipamento do rack.', 1, 6, 4, 'alta', 'resolvido', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 8 DAY),
('Instalação de software', 'Instalar pacote Adobe.', 2, 1, 5, 'media', 'resolvido', NOW() - INTERVAL 15 DAY, NOW() - INTERVAL 14 DAY),
('Troca de toner', 'A impressão está saindo falhada.', 3, 2, 6, 'baixa', 'resolvido', NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 19 DAY),

-- Status: CANCELADO (Duplicados ou desistências)
('Troca de monitor', 'Quero um monitor maior.', 1, 4, NULL, 'baixa', 'cancelado', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 4 DAY),
('Internet lenta', 'Chamado aberto em duplicidade por engano.', 2, 5, 5, 'media', 'cancelado', NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY);

-- ==============================================================================
-- 4. HISTÓRICO DE MANUTENÇÃO (Rastreabilidade das ações dos técnicos)
-- ==============================================================================
INSERT INTO historico_manutencao (chamado_id, equipamento_id, tecnico_id, descricao, registrado_em) VALUES
-- Históricos dos chamados 'em_atendimento'
(4, 3, 4, 'Iniciada análise dos logs de lentidão do banco de dados.', NOW() - INTERVAL 1 DAY),
(4, 3, 4, 'Identificada query pesada, rodando script de otimização de índices.', NOW() - INTERVAL 1 HOUR),
(5, 5, 5, 'Resetado o roteador para configurações de fábrica e reconfigurado.', NOW() - INTERVAL 4 HOUR),
(6, 1, 6, 'Realizada limpeza de arquivos temporários e remoção de malwares.', NOW() - INTERVAL 1 DAY),

-- Históricos dos chamados 'resolvidos'
(7, 6, 4, 'Removido o switch danificado e instalado um novo no lugar. Teste ok.', NOW() - INTERVAL 8 DAY),
(8, 1, 5, 'Licença do Adobe ativada e atalhos criados na área de trabalho.', NOW() - INTERVAL 14 DAY),
(9, 2, 6, 'Toner substituído por um novo modelo original. Página de teste impressa.', NOW() - INTERVAL 19 DAY),

-- Históricos soltos (Manutenções preventivas em equipamentos, sem estar atrelado a um chamado específico. ID Chamado = NULL se sua tabela permitir, mas como o padrão geralmente requer, atrelei aos resolvidos)
(7, 6, 4, 'O switch queimado foi encaminhado para o descarte ecológico.', NOW() - INTERVAL 7 DAY);