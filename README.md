<div align="center">

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" />
<img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge" />

<br/><br/>

# 📦 Centriar — Sistema de Almoxarifado

**Plataforma web para controle de materiais, EPIs, ferramentas e movimentações de estoque.**  
Desenvolvida para ambientes que exigem rastreabilidade, organização e agilidade no almoxarifado.

</div>

---

## ✨ Funcionalidades

- **Gestão de Estoque** — Cadastro de materiais com código SKU, categoria, C.A., validade e estoque mínimo
- **Controle de Medidas** — Rastreamento de peso e comprimento para itens de Gás e Cobre
- **Alertas de Reposição** — Notificação automática quando itens atingem o estoque mínimo
- **Movimentações / Cautelas** — Registro de retiradas e devoluções com histórico completo por colaborador
- **Cálculo de Consumo** — Diferença automática entre medida de saída e retorno para itens consumíveis
- **Filtros e Busca** — Filtragem por categoria, status e nome em tempo real

---

## 🛠️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, React Router DOM |
| UI/Estilo | Bootstrap 5, Bootstrap Icons, CSS Custom Properties |
| Backend | Node.js, Express |
| Banco de Dados | MySQL |
| HTTP Client | Axios |

---

## 📁 Estrutura do Projeto

```
Sistema-de-Almoxarifado---Centriar/
│
└── sistema-almoxarifado/
    ├── frontend/
    │   ├── src/
    │   │   ├── pages/
    │   │   │   ├── Estoque.jsx         # Inventário de materiais
    │   │   │   └── Movimentacoes.jsx   # Histórico de retiradas/devoluções
    │   │   ├── services/
    │   │   │   └── api.js              # Configuração do Axios
    │   │   ├── App.jsx                 # Layout e rotas
    │   │   └── index.css              # Design system (dark theme)
    │   └── package.json
    │
    └── backend/
        ├── routes/
        │   ├── epis.js                 # CRUD de materiais
        │   ├── movimentacoes.js        # Retiradas e devoluções
        │   └── colaboradores.js
        ├── db.js                       # Conexão MySQL
        └── server.js
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- MySQL 8+
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/Anderson-Fontes/Sistema-de-Almoxarifado---Centriar.git
cd Sistema-de-Almoxarifado---Centriar/sistema-almoxarifado
```

### 2. Configure o banco de dados

Crie um banco no MySQL e importe o schema:

```bash
mysql -u root -p < backend/banco/schema.sql
```

Configure as credenciais no arquivo `backend/db.js` (ou `.env`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=centriar_almoxarifado
```

### 3. Inicie o backend

```bash
cd backend
npm install
npm start
# Servidor rodando em http://localhost:3001
```

### 4. Inicie o frontend

```bash
cd frontend
npm install
npm run dev
# Aplicação em http://localhost:5173
```

---

## 📋 Rotas da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/epis` | Lista todos os materiais |
| `POST` | `/epis` | Cadastra novo material |
| `PUT` | `/epis/:id` | Atualiza material |
| `GET` | `/movimentacoes` | Histórico completo |
| `POST` | `/movimentacoes/retirar` | Registra retirada |
| `PUT` | `/movimentacoes/:id/devolver` | Registra devolução |
| `GET` | `/colaboradores` | Lista colaboradores |

---

## 📌 Categorias de Materiais

| Categoria | Descrição |
|-----------|-----------|
| `EPI` | Equipamentos de Proteção Individual |
| `Consumível` | Materiais de consumo geral |
| `Ferramenta` | Ferramentas e equipamentos |
| `Gás` | Cilindros — controle por peso (kg) |
| `Cobre` | Bobinas/fios — controle por comprimento (m) |
| `Outros` | Materiais diversos |

---

## 👨‍💻 Autor

**Anderson Fontes**  
[![GitHub](https://img.shields.io/badge/GitHub-Anderson--Fontes-181717?style=flat&logo=github)](https://github.com/Anderson-Fontes)

---

<div align="center">
  <sub>Desenvolvido com foco em usabilidade e rastreabilidade operacional.</sub>
</div>
