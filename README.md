<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=220&section=header&text=Sistema%20de%20Almoxarifado&fontSize=42&fontColor=ffffff&fontAlignY=38&desc=Centriar%20%E2%80%A2%20Gest%C3%A3o%20Inteligente%20de%20Estoque%20e%20EPIs&descAlignY=58&descSize=16&animation=fadeIn" width="100%"/>

<br/>

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-f59e0b?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Anderson-Fontes/Sistema-de-Almoxarifado---Centriar)
[![Version](https://img.shields.io/badge/vers%C3%A3o-1.1.0-3b82f6?style=for-the-badge)](https://github.com/Anderson-Fontes/Sistema-de-Almoxarifado---Centriar)
[![Feito com dedicação](https://img.shields.io/badge/feito%20com-%E2%9D%A4-ef4444?style=for-the-badge)](https://github.com/Anderson-Fontes)

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![pgAdmin](https://img.shields.io/badge/pgAdmin-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.pgadmin.org)

<br/>

> **Plataforma completa para gestão de almoxarifado, controle de estoque e monitoramento de EPIs.**
> Desenvolvida com foco em organização, rastreabilidade, segurança do trabalho e eficiência operacional.

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

</div>

<br/>

## 📋 Índice

<details>
<summary><b>Ver todos os tópicos</b></summary>

- [📖 Visão Geral](#-visão-geral)
- [🎯 Objetivos](#-objetivos)
- [✨ Funcionalidades](#-funcionalidades)
- [🦺 Ficha de EPI](#-ficha-de-epi--nova-funcionalidade)
- [🧱 Arquitetura](#-arquitetura)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚙️ Como Executar](#️-como-executar)
- [🌐 Padrão de API](#-padrão-de-api)
- [🗄️ Banco de Dados](#️-banco-de-dados)
- [📊 Boas Práticas](#-boas-práticas-e-conceitos)
- [🚧 Roadmap](#-roadmap)
- [👨‍💻 Autor](#-autor)

</details>

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 📖 Visão Geral

<img align="right" width="320" src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" />

O **Sistema de Almoxarifado — Centriar** é uma aplicação **full stack** desenvolvida para gerenciar de forma eficiente o controle de materiais, movimentações de estoque, organização de recursos e — agora — o **monitoramento completo de EPIs (Equipamentos de Proteção Individual)** de uma instituição.

A solução foi projetada para atender **cenários reais de gestão**, garantindo:

- ✅ Maior **confiabilidade** nos dados cadastrados
- ✅ Redução de **erros operacionais** no dia a dia
- ✅ Melhoria nos **processos internos** de almoxarifado
- ✅ **Rastreabilidade** completa de entradas e saídas
- ✅ **Controle individual** de EPIs por colaborador
- ✅ **Acesso rápido** ao histórico de movimentações e fichas de EPI

Com uma interface moderna e responsiva construída em React, integrada a uma API REST em Node.js e banco de dados PostgreSQL, o sistema oferece controle total sobre o fluxo de materiais e a gestão de segurança dos trabalhadores em uma única plataforma.

<br clear="right"/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🎯 Objetivos

<div align="center">

| 🎯 Objetivo | 📋 Descrição |
|---|---|
| **Centralização** | Unificar todo o controle de estoque e EPIs em uma única plataforma |
| **Automação** | Automatizar registros de entrada, saída e entrega de equipamentos |
| **Rastreabilidade** | Garantir histórico completo de todas as movimentações e fichas de EPI |
| **Conformidade** | Apoiar o cumprimento das normas de segurança do trabalho (NRs) |
| **Análise** | Facilitar consultas, filtros e análises do estoque e EPIs |
| **Eficiência** | Melhorar a produtividade e reduzir erros operacionais |
| **Segurança** | Controle de acesso com autenticação de usuários |

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## ✨ Funcionalidades

<table>
  <tr>
    <td align="center" width="33%">
      <h3>📋</h3>
      <b>Cadastro de Produtos</b><br/>
      Registro completo de materiais com código, descrição, categoria e unidade de medida
    </td>
    <td align="center" width="33%">
      <h3>⬆️</h3>
      <b>Entrada de Materiais</b><br/>
      Registro de recebimentos com data, quantidade, origem e responsável
    </td>
    <td align="center" width="33%">
      <h3>⬇️</h3>
      <b>Saída de Materiais</b><br/>
      Controle de retiradas com identificação do solicitante e finalidade
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <h3>📦</h3>
      <b>Controle de Estoque</b><br/>
      Visão em tempo real da quantidade disponível de cada item cadastrado
    </td>
    <td align="center" width="33%">
      <h3>🔎</h3>
      <b>Busca Avançada</b><br/>
      Filtros inteligentes e consultas rápidas por múltiplos critérios
    </td>
    <td align="center" width="33%">
      <h3>🧾</h3>
      <b>Histórico de Movimentações</b><br/>
      Log completo de todas as transações realizadas no sistema
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <h3>🦺</h3>
      <b>Ficha de EPI</b><br/>
      Monitoramento individual de EPIs por colaborador, com controle de entrega e validade
    </td>
    <td align="center" width="33%">
      <h3>🧭</h3>
      <b>Interface Responsiva</b><br/>
      Design moderno construído em React, adaptado para desktop e mobile
    </td>
    <td align="center" width="33%">
      <h3>📊</h3>
      <b>Dashboard Gerencial</b><br/>
      Visão consolidada do almoxarifado para tomada de decisão rápida
    </td>
  </tr>
</table>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🦺 Ficha de EPI — Nova Funcionalidade

<div align="center">

> ### 🆕 Versão 1.1.0
> **Monitoramento completo de Equipamentos de Proteção Individual por colaborador.**

</div>

A **Ficha de EPI** é um módulo dedicado ao controle e rastreamento de todos os equipamentos de proteção individual entregues aos colaboradores da instituição. Com ela, é possível garantir conformidade com as normas regulamentadoras de segurança do trabalho (NRs) e manter um histórico confiável de cada entrega.

### 🔍 O que é possível fazer com a Ficha de EPI?

<table>
  <tr>
    <td width="50%">
      <h4>📌 Registro de Entregas</h4>
      Registre cada EPI entregue ao colaborador com data, quantidade, número do CA (Certificado de Aprovação) e responsável pela entrega.
    </td>
    <td width="50%">
      <h4>👷 Ficha Individual por Colaborador</h4>
      Cada colaborador possui sua própria ficha, com todo o histórico de EPIs recebidos ao longo do tempo.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>📅 Controle de Validade</h4>
      Acompanhe a data de validade de cada EPI entregue, facilitando a identificação de equipamentos vencidos ou próximos do vencimento.
    </td>
    <td width="50%">
      <h4>✍️ Assinatura de Recebimento</h4>
      Registre a confirmação de recebimento do colaborador, mantendo a rastreabilidade e a responsabilidade sobre o uso dos equipamentos.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>🔁 Histórico de Devoluções</h4>
      Controle devoluções de EPIs danificados ou substituídos, mantendo o ciclo de vida do equipamento documentado.
    </td>
    <td width="50%">
      <h4>📋 Relatório por Setor</h4>
      Filtre e visualize os EPIs distribuídos por setor, função ou período, facilitando auditorias e inspeções internas.
    </td>
  </tr>
</table>

### 📐 Modelo de Dados — Ficha de EPI

```
┌─────────────────────┐       ┌──────────────────────────┐       ┌───────────────────┐
│    colaboradores    │       │       fichas_epi          │       │      epis         │
│─────────────────────│       │──────────────────────────│       │───────────────────│
│ id                  │◄──────│ colaborador_id            │  ┌───►│ id                │
│ nome                │       │ epi_id               ────►┘  │   │ nome              │
│ matricula           │       │ quantidade                │   │   │ descricao         │
│ setor               │       │ data_entrega              │   │   │ numero_ca         │
│ funcao              │       │ data_validade             │   │   │ categoria         │
│ ativo               │       │ data_devolucao            │   │   │ unidade           │
└─────────────────────┘       │ assinatura_recebimento    │   └───┘                   │
                              │ observacao                │
                              │ criado_em                 │
                              └──────────────────────────┘
```

### 🌐 Endpoints da Ficha de EPI

<div align="center">

| Método | Rota | Descrição |
|:---:|---|---|
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/colaboradores` | Lista todos os colaboradores |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/colaboradores` | Cadastra um novo colaborador |
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/colaboradores/:id/ficha-epi` | Retorna a ficha de EPI de um colaborador |
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/fichas-epi` | Lista todas as entregas de EPI |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/fichas-epi` | Registra entrega de EPI a um colaborador |
| ![PUT](https://img.shields.io/badge/-PUT-fca130?style=flat-square) | `/fichas-epi/:id` | Atualiza dados de uma entrega (ex: devolução) |
| ![DELETE](https://img.shields.io/badge/-DELETE-f93e3e?style=flat-square) | `/fichas-epi/:id` | Remove um registro de entrega |

</div>

<details>
<summary><b>📌 Exemplo de payload — Entrega de EPI</b></summary>

<br/>

```json
{
  "colaborador_id": 5,
  "epi_id": 3,
  "quantidade": 2,
  "data_entrega": "2026-04-14",
  "data_validade": "2027-04-14",
  "numero_ca": "12345",
  "assinatura_recebimento": true,
  "observacao": "Substituição por desgaste"
}
```

</details>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🧱 Arquitetura

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│                    🌐 CLIENT LAYER                      │
│              React + JavaScript + CSS3 + Axios           │
└──────────────────────────┬──────────────────────────────┘
                           │  HTTP / REST
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    ⚙️  API LAYER                        │
│              Node.js + Express + Controllers            │
│    Autenticação · Validações · Regras de Negócio        │
└──────────────────────────┬──────────────────────────────┘
                           │  SQL Queries
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  🗄️  DATABASE LAYER                     │
│              PostgreSQL — gerenciado via pgAdmin         │
│   Produtos · Movimentações · EPIs · Colaboradores        │
└─────────────────────────────────────────────────────────┘
```

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🛠️ Stack Tecnológica

<details>
<summary><b>🔹 Frontend</b></summary>

<br/>

| Tecnologia | Uso |
|---|---|
| ![React](https://img.shields.io/badge/-React-20232A?logo=react&logoColor=61DAFB) | Biblioteca principal de UI |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) | Linguagem principal |
| ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white) | Estrutura das páginas |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white) | Estilização e layout |
| ![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white) | Requisições HTTP para a API |

</details>

<details>
<summary><b>🔹 Backend</b></summary>

<br/>

| Tecnologia | Uso |
|---|---|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) | Runtime JavaScript server-side |
| ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) | Framework web e roteamento da API |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) | Linguagem principal do servidor |

</details>

<details>
<summary><b>🔹 Banco de Dados</b></summary>

<br/>

| Tecnologia | Uso |
|---|---|
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-316192?logo=postgresql&logoColor=white) | Banco de dados relacional principal |
| ![pgAdmin](https://img.shields.io/badge/-pgAdmin-336791?logo=postgresql&logoColor=white) | Interface gráfica de administração do banco |

</details>

<details>
<summary><b>🔹 Ferramentas e DevOps</b></summary>

<br/>

| Ferramenta | Uso |
|---|---|
| ![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white) | Controle de versão |
| ![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white) | Hospedagem do repositório |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) | Bundler e servidor de desenvolvimento React |

</details>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 📂 Estrutura do Projeto

```bash
📦 Sistema-de-Almoxarifado---Centriar
 │
 ┣ 📂 backend
 ┃ ┣ 📄 server.js              # Ponto de entrada do servidor Express + rotas
 ┃ ┗ 📄 database.js            # Configuração e conexão com o PostgreSQL
 ┃
 ┣ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 pages                # Páginas da aplicação (React)
 ┃ ┃ ┃ ┣ 📄 Produtos.jsx       # Gestão de produtos
 ┃ ┃ ┃ ┣ 📄 Movimentacoes.jsx  # Entradas e saídas
 ┃ ┃ ┃ ┣ 📄 FichaEPI.jsx       # 🆕 Ficha de EPI por colaborador
 ┃ ┃ ┃ ┗ 📄 Dashboard.jsx      # Visão geral do almoxarifado
 ┃ ┃ ┣ 📂 components           # Componentes reutilizáveis
 ┃ ┃ ┣ 📂 services             # Camada de comunicação com a API (Axios)
 ┃ ┃ ┗ 📄 App.jsx              # Componente raiz da aplicação
 ┃ ┗ 📄 index.html             # HTML base do Vite
 ┃
 ┗ 📄 README.md
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## ⚙️ Como Executar

> ⚠️ **Pré-requisitos:** [Node.js](https://nodejs.org) 20+, [PostgreSQL](https://www.postgresql.org), [pgAdmin](https://www.pgadmin.org) e [Git](https://git-scm.com)

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/Anderson-Fontes/Sistema-de-Almoxarifado---Centriar.git
cd Sistema-de-Almoxarifado---Centriar
```

### 2️⃣ Configure o banco de dados

1. Abra o **pgAdmin** e crie um banco de dados chamado `almoxarifado`
2. Execute o script SQL de criação das tabelas localizado na pasta do projeto
3. O script já inclui as tabelas do módulo de **Ficha de EPI** (`colaboradores`, `epis`, `fichas_epi`)

### 3️⃣ Configure as variáveis de ambiente do Backend

Crie um arquivo `.env` dentro da pasta `backend/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=almoxarifado
PORT=3333
```

### 4️⃣ Execute o Backend

```bash
cd backend
npm install
npm start
```

> 🟢 API disponível em: `http://localhost:3333`

### 5️⃣ Execute o Frontend

```bash
cd frontend
npm install
npm run dev
```

> 🟢 Interface disponível em: `http://localhost:5173`

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🌐 Padrão de API

### 📦 Módulo de Estoque

<div align="center">

| Método | Rota | Descrição |
|:---:|---|---|
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/produtos` | Lista todos os produtos |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/produtos` | Cadastra um novo produto |
| ![PUT](https://img.shields.io/badge/-PUT-fca130?style=flat-square) | `/produtos/:id` | Atualiza um produto existente |
| ![DELETE](https://img.shields.io/badge/-DELETE-f93e3e?style=flat-square) | `/produtos/:id` | Remove um produto |
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/movimentacoes` | Lista o histórico de movimentações |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/movimentacoes` | Registra entrada ou saída de material |

</div>

### 🦺 Módulo de EPI

<div align="center">

| Método | Rota | Descrição |
|:---:|---|---|
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/colaboradores` | Lista todos os colaboradores |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/colaboradores` | Cadastra um novo colaborador |
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/colaboradores/:id/ficha-epi` | Ficha de EPI de um colaborador |
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/fichas-epi` | Lista todas as entregas de EPI |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/fichas-epi` | Registra entrega de EPI |
| ![PUT](https://img.shields.io/badge/-PUT-fca130?style=flat-square) | `/fichas-epi/:id` | Atualiza registro (ex: devolução) |
| ![DELETE](https://img.shields.io/badge/-DELETE-f93e3e?style=flat-square) | `/fichas-epi/:id` | Remove um registro de entrega |

</div>

<details>
<summary><b>📌 Exemplo de payload — Produto</b></summary>

<br/>

```json
{
  "nome": "Parafuso Philips 3/4",
  "codigo": "PAR-PH-075",
  "categoria": "Fixadores",
  "quantidade": 500,
  "unidade": "unidade",
  "localizacao": "Prateleira A-03"
}
```

</details>

<details>
<summary><b>📌 Exemplo de payload — Movimentação</b></summary>

<br/>

```json
{
  "produto_id": 1,
  "tipo": "entrada",
  "quantidade": 100,
  "observacao": "Recebimento de fornecedor",
  "data": "2026-04-14"
}
```

</details>

<details>
<summary><b>📌 Exemplo de payload — Ficha de EPI</b></summary>

<br/>

```json
{
  "colaborador_id": 5,
  "epi_id": 3,
  "quantidade": 2,
  "data_entrega": "2026-04-14",
  "data_validade": "2027-04-14",
  "numero_ca": "12345",
  "assinatura_recebimento": true,
  "observacao": "Substituição por desgaste"
}
```

</details>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🗄️ Banco de Dados

O sistema utiliza **PostgreSQL** como banco de dados relacional, administrado via **pgAdmin**. O modelo é composto pelas seguintes entidades:

<div align="center">

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   produtos   │       │  movimentacoes   │       │   usuarios   │
│──────────────│       │──────────────────│       │──────────────│
│ id           │◄──────│ produto_id       │       │ id           │
│ nome         │       │ tipo (entrada/   │       │ nome         │
│ codigo       │       │       saida)     │       │ email        │
│ categoria    │       │ quantidade       │       │ senha_hash   │
│ quantidade   │       │ observacao       │       │ criado_em    │
│ unidade      │       │ data             │       └──────────────┘
│ localizacao  │       │ criado_em        │
│ criado_em    │       └──────────────────┘
└──────────────┘

┌──────────────────┐       ┌──────────────────────────┐       ┌──────────────┐
│  colaboradores   │       │       fichas_epi          │       │    epis      │
│──────────────────│       │──────────────────────────│       │──────────────│
│ id               │◄──────│ colaborador_id            │   ┌──►│ id           │
│ nome             │       │ epi_id               ─────┼───┘  │ nome         │
│ matricula        │       │ quantidade                │      │ descricao    │
│ setor            │       │ data_entrega              │      │ numero_ca    │
│ funcao           │       │ data_validade             │      │ categoria    │
│ ativo            │       │ data_devolucao            │      │ unidade      │
│ criado_em        │       │ assinatura_recebimento    │      │ criado_em    │
└──────────────────┘       │ observacao                │      └──────────────┘
                           │ criado_em                 │
                           └──────────────────────────┘
```

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 📊 Boas Práticas e Conceitos

<div align="center">

```
╔══════════════════╗    ╔══════════════════╗    ╔══════════════════╗
║   RESTful API    ║    ║  Arquitetura MVC  ║    ║  Código Limpo    ║
║  Padronização    ║    ║  Separação clara  ║    ║  Organizado e    ║
║  de endpoints    ║    ║ de responsabili-  ║    ║  modularizado    ║
║                  ║    ║     dades         ║    ║                  ║
╚══════════════════╝    ╚══════════════════╝    ╚══════════════════╝
╔══════════════════╗    ╔══════════════════╗    ╔══════════════════╗
║  Componentização ║    ║   Integração     ║    ║  Variáveis de    ║
║  React com       ║    ║  Frontend ↔ API  ║    ║  Ambiente com    ║
║  reuso de UI     ║    ║  via Axios       ║    ║     .env         ║
╚══════════════════╝    ╚══════════════════╝    ╚══════════════════╝
```

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🚧 Roadmap

- [x] Cadastro de produtos
- [x] Controle de estoque
- [x] Registro de movimentações (entrada e saída)
- [x] Consulta e filtragem de produtos
- [x] Integração frontend ↔ API REST
- [x] **Ficha de EPI por colaborador** ✅ _Novo em v1.1.0_
- [x] **Registro de entrega e devolução de EPIs** ✅ _Novo em v1.1.0_
- [x] **Controle de validade e CA dos EPIs** ✅ _Novo em v1.1.0_
- [ ] Autenticação com JWT
- [ ] Alertas automáticos de estoque mínimo e EPI vencido
- [ ] Relatórios exportáveis em PDF/Excel
- [ ] Dashboard com gráficos e indicadores
- [ ] Deploy em produção

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🚧 Status do Projeto

<div align="center">

![Status Badge](https://img.shields.io/badge/%F0%9F%9F%A1%20Status-Em%20Desenvolvimento-f59e0b?style=for-the-badge)

**O sistema está em evolução contínua**, com melhorias estruturais e novas funcionalidades sendo implementadas regularmente. A versão **1.1.0** trouxe o módulo completo de **Ficha de EPI**, adicionando uma camada de segurança e conformidade com as normas regulamentadoras ao sistema. Contribuições e feedbacks são sempre bem-vindos!

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 👨‍💻 Autor

<div align="center">

### Anderson Fontes Fernandes Júnior

**Desenvolvedor Full Stack** — Brasil 🇧🇷

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Anderson-Fontes)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/anderson-ff-junior)
[![Gmail](https://img.shields.io/badge/-Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:andersonfontes795@gmail.com)

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2c5364,50:203a43,100:0f2027&height=120&section=footer" width="100%"/>

**Centriar © 2026 • Sistema de Almoxarifado**  
*Desenvolvido com foco em performance, escalabilidade, segurança e organização.*

</div>
