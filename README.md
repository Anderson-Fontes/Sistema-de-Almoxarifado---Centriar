<h1 align="center">
  <br>
  ❄️ Centriar ERP
  <br>
  Gestão Inteligente de Almoxarifado
</h1>

<h4 align="center">Sistema completo para controle de estoque, ferramentas e fluidos refrigerantes com inteligência de cálculo e prevenção.</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em_Desenvolvimento-ffc107?style=for-the-badge&logo=github&logoColor=black" alt="Status: Em Desenvolvimento">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

<hr>

## 🎯 Sobre o Projeto

O **Centriar ERP** foi desenvolvido sob medida para revolucionar a gestão de almoxarifados no setor de climatização e refrigeração. Diferente de estoques tradicionais, ele possui inteligência embarcada para lidar com a complexidade do setor: converte peso em metragem de cobre, calcula consumo exato de fluidos refrigerantes (gases) na devolução e monitora o vencimento de C.A. de EPIs.

---

## 📖 Manual do Usuário (Como usar o sistema)

O sistema é dividido em 4 módulos principais, acessíveis pelo menu lateral. Veja como operar cada um deles:

### 1. 📦 Estoque Atual
Esta é a central de controle de todos os seus materiais.
* **Cadastrar/Editar Item:** Clique em "Novo Item". Escolha a categoria correta (isso muda a inteligência do formulário).
* **Inteligência para Gás:** Se a categoria for "Gás", o sistema pedirá o peso em KG (ex: cilindro com 11.5kg).
* **Calculadora de Cobre:** Se a categoria for "Cobre", escolha a bitola (ex: 1/4", 1/2") e insira o peso lido na balança. O sistema calculará **automaticamente** quantos metros de tubo você tem.
* **Alertas de Segurança (EPIs):** Ao cadastrar um EPI, insira a data de validade do C.A. O sistema exibirá um banner amarelo e um alerta na tabela se o equipamento vencer em 30 dias ou já estiver vencido.
* **Exclusão Segura:** Ao excluir um material na lixeira, ele some do estoque físico, mas o nome dele é preservado no histórico de relatórios passados.

### 2. 🔄 Movimentações (Cautelas)
Aqui você controla o que entra e o que sai da empresa, garantindo que nada seja perdido.
* **Nova Retirada:** Clique em "Nova Retirada", selecione o colaborador e o material. Se for gás ou cobre, o sistema registrará com quantos KG a garrafa/rolo saiu da empresa.
* **Registrar Devolução:** Quando o técnico voltar, clique no ícone verde de devolução.
  * *Para ferramentas normais:* O sistema apenas devolve a unidade ao estoque.
  * *Para Gás/Cobre:* O sistema perguntará qual é o **peso atual** da garrafa/rolo. Ao confirmar, ele calcula o que foi consumido na obra e atualiza o estoque com o que sobrou.
* **Limpar Histórico:** O botão de lixeira vermelha aqui exclui permanentemente o registro do relatório, caso tenha sido feito por engano.

### 3. 👷 Colaboradores
Gestão da equipe autorizada a retirar ferramentas.
* **Cadastrar/Editar:** Insira o nome e o setor do funcionário.
* **Bloqueio (Status):** Você pode mudar o status de um funcionário para "Inativo". Isso impede novas retiradas sem precisar apagar o histórico dele.
* **Exclusão:** Ao excluir um colaborador, o sistema desvincula o ID dele com segurança, mantendo as movimentações passadas intactas no banco de dados.

### 4. 📊 Relatórios e Dashboard
Visão estratégica em tempo real, gerada automaticamente pelo sistema sem precisar de intervenção manual.
* **Visão Geral:** Acompanhe quantos itens estão abaixo do estoque mínimo, o volume total em estoque e os consumos do mês.
* **Ação de Compras:** Uma tabela focada apenas nos itens que precisam de reposição urgente.
* **Ficha por Colaborador:** Selecione um funcionário no menu suspenso para ver a "ficha criminal" dele: tudo o que ele já pegou, quando devolveu, o que ainda está em posse dele e o que foi consumido.
* **Exportação:** Clique no botão "Exportar Relatório" para gerar um PDF com todas as métricas da tela.

---
