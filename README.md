<h1 align="center">
  <br>
  ❄️ Centriar ERP
  <br>
  Gestão Inteligente de Almoxarifado
</h1>

<h4 align="center">Sistema completo para controle de estoque, ferramentas e fluidos refrigerantes.</h4>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades-principais">Funcionalidades</a> •
  <a href="#-tecnologias-utilizadas">Tecnologias</a> 
</p>

<hr>

## 🎯 Sobre o Projeto

O **Centriar ERP** é um sistema web desenvolvido sob medida para revolucionar a gestão de almoxarifados no setor de climatização e refrigeração. 

Diferente de sistemas de estoque tradicionais, ele possui inteligência embarcada para lidar com a complexidade do setor: converte automaticamente o peso de tubos de cobre em metragem através de balança, calcula o consumo exato de fluidos refrigerantes (gases) devolvidos e monitora rigorosamente a validade de Certificados de Aprovação (C.A.) de equipamentos de proteção individual.

## ✨ Funcionalidades Principais

* **📦 Inventário Inteligente:** Cadastro de EPIs, Consumíveis, Ferramentas, Gases e Cobre.
* **⚖️ Calculadora Integrada:** Sistema converte o peso na balança para metros lineares de cobre com base na bitola (1/4", 3/8", 1/2", etc.).
* **🔄 Gestão de Cautelas:** Registro de retiradas e devoluções. O sistema calcula automaticamente o consumo gerado quando um cilindro de gás retorna mais leve.
* **🚨 Sistema de Alertas (Smart Warnings):**
  * Alerta visual e contagem de dias para EPIs com C.A. vencendo em 30 dias ou já vencidos.
  * Alerta de estoque crítico quando um item atinge a quantidade ou peso mínimo configurado.
* **👷 Controle de Equipe:** Cadastro de colaboradores, definição de setores e bloqueio de acesso (Status Ativo/Inativo).
* **📊 Dashboard Analítico:** Visão estratégica com KPIs em tempo real, gráficos de distribuição e histórico detalhado por colaborador.
* **🛡️ Proteção de Dados:** Exclusão segura de materiais e funcionários sem corromper o histórico passado dos relatórios.

## 💻 Tecnologias Utilizadas

O projeto foi construído utilizando uma stack moderna e robusta baseada em JavaScript:

**Frontend:**
* [React.js](https://reactjs.org/) (Componentização e reatividade)
* [React Router Dom](https://reactrouter.com/) (Navegação SPA)
* [React Bootstrap](https://react-bootstrap.github.io/) (Componentes UI como Modals e Offcanvas)
* CSS Customizado (Design System próprio focado em UI/UX)

**Backend:**
* [Node.js](https://nodejs.org/) (Ambiente de execução)
* [Express.js](https://expressjs.com/) (Roteamento e API RESTful)
* [CORS](https://www.npmjs.com/package/cors) (Controle de acesso)

**Banco de Dados:**
* [PostgreSQL](https://www.postgresql.org/) (Banco de dados relacional poderoso)
* [node-postgres / pg](https://node-postgres.com/) (Cliente de conexão)
