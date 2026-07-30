<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=220&section=header&text=Sistema%20de%20Almoxarifado&fontSize=42&fontColor=ffffff&fontAlignY=38&desc=Centriar%20%E2%80%A2%20Gest%C3%A3o%20Inteligente%20de%20Estoque%20e%20EPIs&descAlignY=58&descSize=16&animation=fadeIn" width="100%"/>

<br/>

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-f59e0b?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Anderson-Fontes/Sistema-de-Almoxarifado---Centriar)
[![Version](https://img.shields.io/badge/vers%C3%A3o-1.2.0-3b82f6?style=for-the-badge)](https://github.com/Anderson-Fontes/Sistema-de-Almoxarifado---Centriar)
[![Feito com dedicação](https://img.shields.io/badge/feito%20com-%E2%9D%A4-ef4444?style=for-the-badge)](https://github.com/Anderson-Fontes)

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![pgAdmin](https://img.shields.io/badge/pgAdmin-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.pgadmin.org)

<br/>

> **Plataforma completa para gestão de almoxarifado, controle de estoque, orçamentos e monitoramento de EPIs.**
> Desenvolvida com foco em organização, rastreabilidade, segurança do trabalho e eficiência operacional.

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

</div>

<br/>

## 📋 Índice

<details>
<summary><b>Ver todos os tópicos</b></summary>

- [📖 Visão Geral](#-visão-geral)
- [🆕 Novidades da Versão 1.2.0](#-novidades-da-versão-120)
- [🎯 Objetivos](#-objetivos)
- [✨ Funcionalidades](#-funcionalidades)
- [🦺 Ficha de EPI](#-ficha-de-epi)
- [🧮 Calculadora de Materiais](#-calculadora-de-materiais)
- [📑 Criação de Orçamentos](#-criação-de-orçamentos)
- [🔔 Sistema de Alertas](#-sistema-de-alertas)
- [🔐 Segurança e Autenticação](#-segurança-e-autenticação)
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

O **Sistema de Almoxarifado — Centriar** é uma aplicação **full stack** desenvolvida para gerenciar de forma eficiente o controle de materiais, movimentações de estoque, criação de orçamentos, cálculo de materiais e o **monitoramento completo de EPIs (Equipamentos de Proteção Individual)** de uma instituição.

A solução foi projetada para atender **cenários reais de gestão**, garantindo:

- ✅ Maior **confiabilidade** nos dados cadastrados
- ✅ Redução de **erros operacionais** no dia a dia
- ✅ Melhoria nos **processos internos** de almoxarifado
- ✅ **Rastreabilidade** completa de entradas e saídas
- ✅ **Controle individual** de EPIs por colaborador
- ✅ **Estimativas rápidas** de consumo de materiais
- ✅ **Geração ágil de orçamentos** para obras e serviços
- ✅ **Alertas inteligentes** de estoque e vencimento
- ✅ **Acesso seguro**, com autenticação reforçada
- ✅ **Acesso rápido** ao histórico de movimentações e fichas de EPI

Com uma interface moderna e responsiva construída em React, integrada a uma API REST em Node.js e banco de dados PostgreSQL, o sistema oferece controle total sobre o fluxo de materiais e a gestão de segurança dos trabalhadores em uma única plataforma.

<br clear="right"/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🆕 Novidades da Versão 1.2.0

<div align="center">
<img src="https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif" width="260"/>

> ### 🚀 Atualização 1.2.0 — Orçamentos, Cálculo de Materiais, Alertas e Segurança
</div>

Esta versão traz quatro grandes evoluções para o sistema, tornando o dia a dia do almoxarifado ainda mais completo, seguro e produtivo:

<table>
  <tr>
    <td align="center" width="25%">
      <h3>🧮</h3>
      <b>Calculadora de Materiais</b><br/>
      Nova página para estimar automaticamente a quantidade de materiais necessária por projeto
    </td>
    <td align="center" width="25%">
      <h3>📑</h3>
      <b>Criação de Orçamentos</b><br/>
      Novo módulo para gerar, versionar e acompanhar orçamentos com base no estoque disponível
    </td>
    <td align="center" width="25%">
      <h3>🔔</h3>
      <b>Alertas Aprimorados</b><br/>
      Notificações mais inteligentes de estoque mínimo, EPIs vencidos e pendências
    </td>
    <td align="center" width="25%">
      <h3>🔐</h3>
      <b>Segurança de Login</b><br/>
      Autenticação reforçada com JWT, hash de senha e proteção contra tentativas indevidas
    </td>
  </tr>
</table>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🎯 Objetivos

<div align="center">

| 🎯 Objetivo | 📋 Descrição |
|---|---|
| **Centralização** | Unificar todo o controle de estoque, orçamentos e EPIs em uma única plataforma |
| **Automação** | Automatizar registros de entrada, saída, entrega de equipamentos e cálculo de materiais |
| **Rastreabilidade** | Garantir histórico completo de movimentações, orçamentos e fichas de EPI |
| **Conformidade** | Apoiar o cumprimento das normas de segurança do trabalho (NRs) |
| **Análise** | Facilitar consultas, filtros e análises do estoque, EPIs e orçamentos |
| **Eficiência** | Melhorar a produtividade e reduzir erros operacionais e de estimativa |
| **Segurança** | Controle de acesso robusto com autenticação e proteção de sessão |

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
      <h3>🧮</h3>
      <b>Calculadora de Materiais</b><br/>
      Estimativa automática de quantidades e custos com base no escopo do projeto
    </td>
    <td align="center" width="33%">
      <h3>📑</h3>
      <b>Criação de Orçamentos</b><br/>
      Geração de propostas com itens, quantidades e valores a partir do estoque
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <h3>🔔</h3>
      <b>Alertas Inteligentes</b><br/>
      Avisos de estoque mínimo, EPIs vencidos e orçamentos pendentes
    </td>
    <td align="center" width="33%">
      <h3>🔐</h3>
      <b>Login Seguro</b><br/>
      Autenticação com JWT, hash de senha e bloqueio por tentativas indevidas
    </td>
    <td align="center" width="33%">
      <h3>📊</h3>
      <b>Dashboard Gerencial</b><br/>
      Visão consolidada do almoxarifado para tomada de decisão rápida
    </td>
  </tr>
</table>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🦺 Ficha de EPI

<div align="center">

> ### Monitoramento completo de Equipamentos de Proteção Individual por colaborador

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

## 🧮 Calculadora de Materiais

<div align="center">

> ### 🆕 Novo em v1.2.0
> **Estimativa automática de materiais e custos a partir dos dados do estoque.**

</div>

A **Calculadora de Materiais** permite que o usuário informe as dimensões ou o escopo de um projeto (área, metragem, unidades necessárias etc.) e receba automaticamente a lista de materiais e quantidades estimadas, já cruzada com o estoque disponível no almoxarifado.

### 🔍 O que a Calculadora de Materiais faz?

<table>
  <tr>
    <td width="50%">
      <h4>📐 Estimativa por Escopo</h4>
      Calcula a quantidade necessária de cada material com base em parâmetros como área, comprimento ou unidades do projeto.
    </td>
    <td width="50%">
      <h4>📦 Cruzamento com Estoque</h4>
      Compara a quantidade estimada com o saldo disponível, indicando o que já está em estoque e o que precisa ser comprado.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>💰 Estimativa de Custo</h4>
      Apresenta o custo estimado total com base no valor unitário cadastrado de cada material.
    </td>
    <td width="50%">
      <h4>➡️ Envio Direto para Orçamento</h4>
      O resultado do cálculo pode ser enviado diretamente para o módulo de Criação de Orçamentos.
    </td>
  </tr>
</table>

### 🌐 Endpoints da Calculadora de Materiais

<div align="center">

| Método | Rota | Descrição |
|:---:|---|---|
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/calculadora/parametros` | Lista os tipos de cálculo e parâmetros disponíveis |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/calculadora/estimar` | Retorna a lista de materiais e quantidades estimadas |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/calculadora/enviar-orcamento` | Envia o resultado estimado direto para um novo orçamento |

</div>

<details>
<summary><b>📌 Exemplo de payload — Estimativa de Materiais</b></summary>

<br/>

```json
{
  "tipo_calculo": "area_pintura",
  "area_m2": 45,
  "demao": 2,
  "material_base_id": 12
}
```

**Resposta esperada:**

```json
{
  "materiais_estimados": [
    { "produto_id": 12, "nome": "Tinta Acrílica 18L", "quantidade": 3, "disponivel_estoque": 2 },
    { "produto_id": 27, "nome": "Rolo de Pintura 9\"", "quantidade": 4, "disponivel_estoque": 10 }
  ],
  "custo_total_estimado": 842.50
}
```

</details>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 📑 Criação de Orçamentos

<div align="center">

> ### 🆕 Novo em v1.2.0
> **Geração, versionamento e acompanhamento de orçamentos direto do almoxarifado.**

</div>

O módulo de **Criação de Orçamentos** permite montar propostas completas com itens de estoque, quantidades, valores unitários e observações, além de acompanhar o status de cada orçamento (rascunho, enviado, aprovado ou recusado).

### 🔍 O que é possível fazer na Criação de Orçamentos?

<table>
  <tr>
    <td width="50%">
      <h4>🧾 Montagem de Itens</h4>
      Adicione produtos do estoque ao orçamento, com quantidade, valor unitário e desconto por item.
    </td>
    <td width="50%">
      <h4>🔄 Versionamento</h4>
      Cada alteração gera uma nova versão do orçamento, preservando o histórico de negociação.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>📊 Status de Acompanhamento</h4>
      Acompanhe o ciclo de vida do orçamento: rascunho → enviado → aprovado/recusado.
    </td>
    <td width="50%">
      <h4>🧮 Integração com a Calculadora</h4>
      Receba automaticamente os itens calculados na Calculadora de Materiais.
    </td>
  </tr>
</table>

### 📐 Modelo de Dados — Orçamentos

```
┌─────────────────────┐       ┌──────────────────────────┐       ┌───────────────────┐
│      clientes       │       │        orcamentos          │       │  orcamento_itens  │
│─────────────────────│       │────────────────────────────│       │───────────────────│
│ id                  │◄──────│ cliente_id                 │◄──────│ orcamento_id      │
│ nome                │       │ id                          │──────►│ produto_id        │
│ contato             │       │ status                      │       │ quantidade        │
│ empresa             │       │ valor_total                 │       │ valor_unitario    │
│ criado_em           │       │ versao                      │       │ desconto          │
└─────────────────────┘       │ data_criacao                │       └───────────────────┘
                              │ data_validade                │
                              │ observacoes                  │
                              └──────────────────────────────┘
```

### 🌐 Endpoints de Orçamentos

<div align="center">

| Método | Rota | Descrição |
|:---:|---|---|
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/orcamentos` | Lista todos os orçamentos |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/orcamentos` | Cria um novo orçamento |
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/orcamentos/:id` | Retorna os detalhes de um orçamento |
| ![PUT](https://img.shields.io/badge/-PUT-fca130?style=flat-square) | `/orcamentos/:id` | Atualiza um orçamento (nova versão) |
| ![PUT](https://img.shields.io/badge/-PUT-fca130?style=flat-square) | `/orcamentos/:id/status` | Atualiza o status (enviado/aprovado/recusado) |
| ![DELETE](https://img.shields.io/badge/-DELETE-f93e3e?style=flat-square) | `/orcamentos/:id` | Remove um orçamento |

</div>

<details>
<summary><b>📌 Exemplo de payload — Criação de Orçamento</b></summary>

<br/>

```json
{
  "cliente_id": 8,
  "itens": [
    { "produto_id": 12, "quantidade": 3, "valor_unitario": 189.90, "desconto": 0 },
    { "produto_id": 27, "quantidade": 4, "valor_unitario": 24.50, "desconto": 5 }
  ],
  "data_validade": "2026-06-01",
  "observacoes": "Orçamento gerado a partir da Calculadora de Materiais"
}
```

</details>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🔔 Sistema de Alertas

<div align="center">

> ### 🔧 Melhorado em v1.2.0
> **Notificações mais inteligentes e configuráveis.**

</div>

O sistema de alertas foi reformulado para oferecer avisos mais precisos e acionáveis, reduzindo o risco de ruptura de estoque e de EPIs vencidos passarem despercebidos.

<table>
  <tr>
    <td align="center" width="25%">
      <h3>📉</h3>
      <b>Estoque Mínimo</b><br/>
      Alerta automático quando um produto atinge o nível mínimo configurado
    </td>
    <td align="center" width="25%">
      <h3>⏰</h3>
      <b>EPI Próximo do Vencimento</h3></b><br/>
      Aviso antecipado antes da data de validade de cada EPI entregue
    </td>
    <td align="center" width="25%">
      <h3>📑</h3>
      <b>Orçamento Pendente</b><br/>
      Notificação de orçamentos aguardando resposta há mais tempo que o esperado
    </td>
    <td align="center" width="25%">
      <h3>🎯</h3>
      <b>Alertas Configuráveis</b><br/>
      Definição de limites e prazos por categoria de produto ou tipo de EPI
    </td>
  </tr>
</table>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🔐 Segurança e Autenticação

<div align="center">

> ### 🔧 Melhorado em v1.2.0
> **Login mais seguro, com autenticação reforçada.**

</div>

A segurança do login foi reforçada com práticas modernas de proteção de credenciais e de sessão:

<table>
  <tr>
    <td width="50%">
      <h4>🔑 Autenticação via JWT</h4>
      Emissão de tokens de acesso com expiração configurável para cada sessão de usuário.
    </td>
    <td width="50%">
      <h4>🔒 Hash de Senha</h4>
      Senhas armazenadas com hash seguro, nunca em texto puro no banco de dados.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>🚫 Bloqueio por Tentativas</h4>
      Limite de tentativas de login incorretas, com bloqueio temporário da conta.
    </td>
    <td width="50%">
      <h4>🛡️ Middleware de Autorização</h4>
      Validação do token em todas as rotas protegidas da API.
    </td>
  </tr>
</table>

### 🌐 Endpoints de Autenticação

<div align="center">

| Método | Rota | Descrição |
|:---:|---|---|
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/auth/login` | Autentica o usuário e retorna o token JWT |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/auth/logout` | Invalida a sessão atual do usuário |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/auth/refresh` | Renova o token de acesso |
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/auth/me` | Retorna os dados do usuário autenticado |

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🧱 Arquitetura

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│                    🌐 CLIENT LAYER                      │
│              React + JavaScript + CSS3 + Axios           │
└──────────────────────────┬──────────────────────────────┘
                           │  HTTP / REST (JWT no header)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    ⚙️  API LAYER                        │
│              Node.js + Express + Controllers            │
│   Autenticação (JWT) · Validações · Regras de Negócio   │
│   Alertas · Calculadora de Materiais · Orçamentos       │
└──────────────────────────┬──────────────────────────────┘
                           │  SQL Queries
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  🗄️  DATABASE LAYER                     │
│              PostgreSQL — gerenciado via pgAdmin         │
│ Produtos · Movimentações · EPIs · Colaboradores          │
│ Orçamentos · Clientes · Usuários                          │
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
| ![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white) | Autenticação e autorização de rotas |
| ![bcrypt](https://img.shields.io/badge/-bcrypt-004225?logo=npm&logoColor=white) | Hash seguro de senhas |

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
 ┃ ┣ 📄 database.js            # Configuração e conexão com o PostgreSQL
 ┃ ┣ 📂 middlewares
 ┃ ┃ ┗ 📄 auth.js              # 🆕 Middleware de validação de JWT
 ┃ ┗ 📂 services
 ┃   ┣ 📄 calculadora.js       # 🆕 Regras de cálculo de materiais
 ┃   ┗ 📄 alertas.js           # 🔧 Regras de disparo de alertas
 ┃
 ┣ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 pages                # Páginas da aplicação (React)
 ┃ ┃ ┃ ┣ 📄 Produtos.jsx       # Gestão de produtos
 ┃ ┃ ┃ ┣ 📄 Movimentacoes.jsx  # Entradas e saídas
 ┃ ┃ ┃ ┣ 📄 FichaEPI.jsx       # Ficha de EPI por colaborador
 ┃ ┃ ┃ ┣ 📄 CalculadoraMateriais.jsx  # 🆕 Estimativa de materiais e custos
 ┃ ┃ ┃ ┣ 📄 Orcamentos.jsx     # 🆕 Criação e acompanhamento de orçamentos
 ┃ ┃ ┃ ┣ 📄 Login.jsx          # 🔧 Autenticação reforçada (JWT)
 ┃ ┃ ┃ ┗ 📄 Dashboard.jsx      # Visão geral do almoxarifado e alertas
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
3. O script já inclui as tabelas do módulo de **Ficha de EPI** (`colaboradores`, `epis`, `fichas_epi`) e as novas tabelas de **Orçamentos** (`clientes`, `orcamentos`, `orcamento_itens`)

### 3️⃣ Configure as variáveis de ambiente do Backend

Crie um arquivo `.env` dentro da pasta `backend/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=almoxarifado
PORT=3333

# 🆕 Autenticação
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1h
LOGIN_MAX_ATTEMPTS=5
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

### 🧮 Módulo de Calculadora de Materiais

<div align="center">

| Método | Rota | Descrição |
|:---:|---|---|
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/calculadora/parametros` | Lista tipos de cálculo disponíveis |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/calculadora/estimar` | Retorna estimativa de materiais e custos |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/calculadora/enviar-orcamento` | Envia a estimativa para um novo orçamento |

</div>

### 📑 Módulo de Orçamentos

<div align="center">

| Método | Rota | Descrição |
|:---:|---|---|
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/orcamentos` | Lista todos os orçamentos |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/orcamentos` | Cria um novo orçamento |
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/orcamentos/:id` | Detalha um orçamento |
| ![PUT](https://img.shields.io/badge/-PUT-fca130?style=flat-square) | `/orcamentos/:id` | Atualiza um orçamento (nova versão) |
| ![PUT](https://img.shields.io/badge/-PUT-fca130?style=flat-square) | `/orcamentos/:id/status` | Atualiza status do orçamento |
| ![DELETE](https://img.shields.io/badge/-DELETE-f93e3e?style=flat-square) | `/orcamentos/:id` | Remove um orçamento |

</div>

### 🔐 Módulo de Autenticação

<div align="center">

| Método | Rota | Descrição |
|:---:|---|---|
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/auth/login` | Autentica o usuário e retorna o token JWT |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/auth/logout` | Invalida a sessão atual |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/auth/refresh` | Renova o token de acesso |
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/auth/me` | Retorna dados do usuário autenticado |

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
<summary><b>📌 Exemplo de payload — Login</b></summary>

<br/>

```json
{
  "email": "usuario@centriar.com",
  "senha": "********"
}
```

**Resposta esperada:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expira_em": "2026-07-30T15:00:00Z",
  "usuario": { "id": 1, "nome": "Anderson Fontes", "email": "usuario@centriar.com" }
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
│ quantidade   │       │ observacao       │       │ tentativas   │  🔧
│ unidade      │       │ data             │       │ bloqueado_ate│  🔧
│ localizacao  │       │ criado_em        │       │ criado_em    │
│ estoque_min  │  🔧    └──────────────────┘       └──────────────┘
│ criado_em    │
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

┌─────────────────────┐       ┌──────────────────────────┐       ┌───────────────────┐
│      clientes        │       │        orcamentos          │      │  orcamento_itens  │  🆕
│──────────────────────│       │────────────────────────────│      │───────────────────│
│ id                   │◄──────│ cliente_id                 │◄─────│ orcamento_id      │
│ nome                 │       │ id                          │─────►│ produto_id        │
│ contato              │       │ status                      │      │ quantidade        │
│ empresa              │       │ valor_total                 │      │ valor_unitario    │
│ criado_em            │       │ versao                      │      │ desconto          │
└──────────────────────┘       │ data_criacao                │      └───────────────────┘
                               │ data_validade                │
                               │ observacoes                  │
                               └──────────────────────────────┘
```

🔧 = campo/tabela ajustado na v1.2.0 · 🆕 = tabela nova na v1.2.0

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
╔══════════════════╗    ╔══════════════════╗
║  Autenticação    ║    ║  Alertas Baseados║
║  Stateless       ║    ║  em Regras de    ║
║  com JWT         ║    ║  Negócio         ║
╚══════════════════╝    ╚══════════════════╝
```

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🚧 Roadmap

- [x] Cadastro de produtos
- [x] Controle de estoque
- [x] Registro de movimentações (entrada e saída)
- [x] Consulta e filtragem de produtos
- [x] Integração frontend ↔ API REST
- [x] Ficha de EPI por colaborador
- [x] Registro de entrega e devolução de EPIs
- [x] Controle de validade e CA dos EPIs
- [x] **Calculadora de materiais** ✅ _Novo em v1.2.0_
- [x] **Criação de orçamentos** ✅ _Novo em v1.2.0_
- [x] **Alertas automáticos de estoque mínimo e EPI vencido** ✅ _Melhorado em v1.2.0_
- [x] **Autenticação com JWT** ✅ _Melhorado em v1.2.0_
- [ ] Relatórios exportáveis em PDF/Excel
- [ ] Dashboard com gráficos e indicadores
- [ ] Aprovação de orçamento por link público
- [ ] Deploy em produção

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🚧 Status do Projeto

<div align="center">

![Status Badge](https://img.shields.io/badge/%F0%9F%9F%A1%20Status-Em%20Desenvolvimento-f59e0b?style=for-the-badge)

**O sistema está em evolução contínua**, com melhorias estruturais e novas funcionalidades sendo implementadas regularmente. A versão **1.2.0** trouxe os módulos de **Calculadora de Materiais** e **Criação de Orçamentos**, além de melhorias significativas nos **alertas** e na **segurança de login** do sistema. Contribuições e feedbacks são sempre bem-vindos!

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
