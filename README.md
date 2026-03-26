<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=200&section=header&text=Sistema%20de%20Almoxarifado&fontSize=40&fontColor=ffffff&fontAlignY=38&desc=Centriar%20%E2%80%A2%20Gest%C3%A3o%20Inteligente%20de%20Estoque&descAlignY=58&descSize=16&animation=fadeIn" />

<br/>

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-f59e0b?style=for-the-badge&logo=github&logoColor=white)](https://github.com)
[![Version](https://img.shields.io/badge/vers%C3%A3o-1.0.0-3b82f6?style=for-the-badge&logo=semver&logoColor=white)](https://github.com)
[![License](https://img.shields.io/badge/licen%C3%A7a-MIT-10b981?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](./LICENSE)
[![Made with Love](https://img.shields.io/badge/feito%20com-%E2%9D%A4-ef4444?style=for-the-badge)](https://github.com)

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)

<br/>

> **Plataforma completa para gestão de almoxarifado e controle de estoque.**  
> Desenvolvida com foco em organização, rastreabilidade e eficiência operacional.

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
- [🧱 Arquitetura](#-arquitetura)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚙️ Como Executar](#️-como-executar)
- [🌐 Padrão de API](#-padrão-de-api)
- [📊 Boas Práticas](#-boas-práticas-e-conceitos)
- [📄 Licença](#-licença)
- [👨‍💻 Autor](#-autor)

</details>

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 📖 Visão Geral

<img align="right" width="340" src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" />

O **Sistema de Almoxarifado - Centriar** é uma aplicação **full stack** desenvolvida para gerenciar de forma eficiente o controle de materiais, entradas, saídas e organização de estoque.

A solução foi projetada para atender **cenários reais de gestão**, garantindo:

- ✅ Maior **confiabilidade** nos dados
- ✅ Redução de **erros operacionais**
- ✅ Melhoria nos **processos internos**
- ✅ **Rastreabilidade** completa de materiais

Com uma interface moderna e intuitiva, o sistema oferece controle total sobre o fluxo de materiais, desde o cadastro até os relatórios analíticos, tudo integrado em uma única plataforma.

<br clear="right"/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🎯 Objetivos

<div align="center">

| 🎯 Objetivo | 📋 Descrição |
|---|---|
| **Centralização** | Unificar todo o controle de estoque em uma plataforma |
| **Automação** | Automatizar processos de entrada e saída de materiais |
| **Rastreabilidade** | Garantir histórico completo de todas as movimentações |
| **Análise** | Facilitar consultas, filtros e análises de dados |
| **Eficiência** | Melhorar a produtividade e reduzir erros operacionais |

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## ✨ Funcionalidades

<div align="center">
<img src="https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif" width="300" />
</div>

<br/>

<table>
  <tr>
    <td align="center" width="33%">
      <h3>📦</h3>
      <b>Gestão de Produtos</b><br/>
      Cadastro completo com categorias, códigos e descrições detalhadas
    </td>
    <td align="center" width="33%">
      <h3>🔄</h3>
      <b>Movimentações</b><br/>
      Controle preciso de entradas e saídas com rastreabilidade total
    </td>
    <td align="center" width="33%">
      <h3>📊</h3>
      <b>Estoque em Tempo Real</b><br/>
      Monitoramento live com alertas de níveis críticos
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <h3>🔎</h3>
      <b>Busca Avançada</b><br/>
      Filtros inteligentes e consultas rápidas por múltiplos critérios
    </td>
    <td align="center" width="33%">
      <h3>⚡</h3>
      <b>API REST</b><br/>
      Integração completa com endpoints padronizados e documentados
    </td>
    <td align="center" width="33%">
      <h3>🧭</h3>
      <b>Interface Responsiva</b><br/>
      Design intuitivo adaptado para desktop e dispositivos móveis
    </td>
  </tr>
</table>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🧱 Arquitetura

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│                    🌐 CLIENT LAYER                       │
│               React + JavaScript + Axios                 │
└──────────────────────────┬──────────────────────────────┘
                           │  HTTP / REST
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    ⚙️  API LAYER                          │
│              Node.js + Express + Controllers             │
└──────────────────────────┬──────────────────────────────┘
                           │  SQL Queries
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  🗄️  DATABASE LAYER                       │
│                      PostgreSQL                          │
└─────────────────────────────────────────────────────────┘
```

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🛠️ Stack Tecnológica

<details>
<summary><b>🔹 Frontend</b></summary>

<br/>

| Tecnologia | Versão | Uso |
|---|---|---|
| ![React](https://img.shields.io/badge/-React-20232A?logo=react&logoColor=61DAFB) | 18+ | Biblioteca de UI |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) | ES6+ | Linguagem principal |
| ![Styled Components](https://img.shields.io/badge/-Styled%20Components-DB7093?logo=styled-components&logoColor=white) | Latest | Estilização |
| ![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white) | Latest | Requisições HTTP |

</details>

<details>
<summary><b>🔹 Backend</b></summary>

<br/>

| Tecnologia | Versão | Uso |
|---|---|---|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) | 20+ | Runtime JavaScript |
| ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) | 4+ | Framework web |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) | ES6+ | Linguagem principal |

</details>

<details>
<summary><b>🔹 Banco de Dados</b></summary>

<br/>

| Tecnologia | Uso |
|---|---|
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-316192?logo=postgresql&logoColor=white) | Banco de dados relacional principal |

</details>

<details>
<summary><b>🔹 Ferramentas e DevOps</b></summary>

<br/>

| Ferramenta | Uso |
|---|---|
| ![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white) | Controle de versão |
| ![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white) | Hospedagem do repositório |
| ![Leaflet](https://img.shields.io/badge/-Leaflet-199900?logo=leaflet&logoColor=white) | Mapas interativos (quando aplicável) |

</details>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 📂 Estrutura do Projeto

```bash
📦 Sistema-de-Almoxarifado---Centriar
 ┃
 ┣ 📂 backend
 ┃ ┣ 📄 server.js           # Ponto de entrada do servidor Express + rotas
 ┃ ┗ 📄 database.js         # Configuração e conexão com o PostgreSQL
 ┃
 ┣ 📂 frontend
 ┃ ┣ 📂 pages              # Páginas da aplicação
 ┃ ┣ 📂 services           # Camada de comunicação com a API
 ┃ ┗ 📄 App.jsx            # Componente raiz da aplicação React
 ┃
 ┗ 📄 README.md
```

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## ⚙️ Como Executar

> ⚠️ **Pré-requisitos:** [Node.js](https://nodejs.org) 20+, [PostgreSQL](https://www.postgresql.org) e [Git](https://git-scm.com)

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/Sistema-de-Almoxarifado---Centriar.git
cd Sistema-de-Almoxarifado---Centriar
```

### 2️⃣ Execute o Backend

```bash
cd backend
npm install       # Instala as dependências
npm start         # Inicia o servidor
```

> 🟢 API disponível em: `http://localhost:3333`

### 3️⃣ Execute o Frontend

```bash
cd frontend
npm install       # Instala as dependências
npm run dev       # Inicia o servidor de desenvolvimento
```

> 🟢 Interface disponível em: `http://localhost:5173`

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🌐 Padrão de API

<div align="center">

| Método | Rota | Descrição |
|:---:|---|---|
| ![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square) | `/produtos` | Lista todos os produtos |
| ![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square) | `/produtos` | Cadastra um novo produto |
| ![PUT](https://img.shields.io/badge/-PUT-fca130?style=flat-square) | `/produtos/:id` | Atualiza um produto existente |
| ![DELETE](https://img.shields.io/badge/-DELETE-f93e3e?style=flat-square) | `/produtos/:id` | Remove um produto |

</div>

<details>
<summary><b>📌 Exemplo de payload</b></summary>

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

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 📊 Boas Práticas e Conceitos

<div align="center">

```
  ╔══════════════════╗    ╔══════════════════╗    ╔══════════════════╗
  ║   RESTful API    ║    ║  Arquitetura MVC  ║    ║   JavaScript     ║
  ║  Padronização    ║    ║  Separação de     ║    ║  Código limpo    ║
  ║  de endpoints    ║    ║ responsabilidades ║    ║  e organizado    ║
  ╚══════════════════╝    ╚══════════════════╝    ╚══════════════════╝

  ╔══════════════════╗    ╔══════════════════╗
  ║  Modularidade    ║    ║   Integração     ║
  ║  Organização     ║    ║  Frontend ↔ API  ║
  ║  escalável       ║    ║  eficiente       ║
  ╚══════════════════╝    ╚══════════════════╝
```

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 🚧 Status do Projeto

<div align="center">

![Status Badge](https://img.shields.io/badge/%F0%9F%9F%A1%20Status-Em%20Desenvolvimento-f59e0b?style=for-the-badge)

<img src="https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif" width="200"/>

**O sistema está em evolução contínua**, com melhorias estruturais e novas funcionalidades sendo implementadas regularmente. Contribuições e feedbacks são sempre bem-vindos!

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

```
MIT License — Você pode usar, copiar, modificar e distribuir este software
desde que mantenha o aviso de copyright original.
```

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
*Desenvolvido com foco em performance, escalabilidade e organização.*

</div>
