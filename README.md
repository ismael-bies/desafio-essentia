# 🚀 Desafio Full-Stack To-Do List Avançado

Este projeto consiste em uma aplicação moderna de gerenciamento de tarefas (To-Do List) desenvolvida com foco em alta performance, desacoplamento arquitetural e segurança. A infraestrutura é totalmente orquestrada via **Docker Compose**, operando com uma arquitetura de múltiplos bancos de dados simultâneos.

---

### 🛠️ Diferenciais Técnicos e Arquitetura Implementada

*   **Frontend Reativo (Angular 19):** Interface moderna e responsiva construída em formato Widescreen utilitário, utilizando **Signals** para gerenciamento de estado ultra-performático e reativo de ponta a ponta.
*   **Backend Desacoplado (Node.js/Express):** Servidor estruturado seguindo os princípios da **Arquitetura Hexagonal (Ports & Adapters)**, garantindo que as regras de negócio de domínio fiquem completamente isoladas de frameworks de banco de dados.
*   **Persistência Híbrida Multi-Banco (MySQL & MongoDB):**
    *   **MySQL:** Responsável pela persistência transacional core da aplicação (usuários, senhas e tarefas) com integridade referencial gerenciada pelo **Prisma v7**.
    *   **MongoDB:** Atua como um banco de auditoria analítica e segurança, alimentado por um **Middleware de Auditoria síncrono** que captura métricas decimais de performance (`durationMs`) de cada mutação feita na API.
*   **Segurança Robusta (JWT & Bcrypt):** Fluxo de autenticação completo de ponta a ponta. As senhas são criptografadas com **Bcrypt** antes de tocar no banco de dados e as rotas de tarefas são protegidas por um **AuthGuard** estrito via cabeçalhos `Authorization: Bearer <TOKEN>`.

---

### 📦 Pré-requisitos para Execução

Para rodar este ecossistema híbrido, certifique-se de ter instalado em sua máquina física:
*   [Docker & Docker Compose](https://docker.com) (obrigatório para orquestrar os contêineres dos bancos de dados e do backend).
*   [Node.js (v20+) & NPM](https://nodejs.org) (obrigatório para inicializar, compilar e rodar a interface do Angular localmente na máquina host).

---

### 🚀 Como Executar o Ecossistema

Para rodar este ecossistema híbrido, abra o seu terminal na raiz global do projeto e execute a sequência abaixo. 

*Nota de Infraestrutura: Bancos de dados relacionais em primeira execução podem exceder o tempo limite padrão de boot do Docker Compose enquanto criam seus arquivos físicos de disco. Para garantir uma inicialização fluida e livre de timeouts, siga a ordem recomendada:*

```bash
# 1. Iniciar prioritariamente os contêineres de bancos de dados em segundo plano
docker compose up -d mysql mongodb

# 2. Aguarde 10 segundos para os bancos estabilizarem. Agora, levante o servidor backend:
docker compose up -d

# 3. Executar a sincronização física das tabelas do Prisma no MySQL do Docker
docker compose run --rm backend npx prisma db push
```

Agora, abra um novo terminal na pasta do frontend para ligar a interface reativa:

```bash
# 4. Acessar a pasta do cliente, instalar as dependências locais e rodar o Angular
cd frontend
npm install
npx ng serve
```

Abra o seu navegador no endereço padrão do ecossistema:
👉 **[http://localhost:4200](http://localhost:4200)**

---

### 💡 Fluxo de Teste Recomendado para Avaliadores

1.  **Tela de Login/Cadastro:** A aplicação detectará a ausência de sessão e redirecionará automaticamente para a tela de Login. Clique no link inferior para alternar para o modo **Cadastro**.
2.  **Criação do Usuário:** Cadastre um usuário corporativo de teste. O backend gerará um `UUID` seguro, criptografará a senha e retornará o token JWT.
3.  **Isolamento de Tarefas:** Crie novas tarefas. Note que as tarefas ficam atreladas e blindadas exclusivamente ao seu usuário. Se você deslogar e criar outra conta, a lista nascerá limpa.
4.  **Verificação da Auditoria (MongoDB Compass):**
    *   Abra o seu MongoDB Compass e conecte na string padrão do contêiner Docker: `mongodb://localhost:27017`
    *   Atualize a lista lateral. O banco **`desafio_todo`** e a coleção **`actionlogs`** terão nascido com sucesso!
    *   Cada clique de adicionar ou concluir gera um documento estruturado contendo o tipo da ação (`CREATE_TODO`, `TOGGLE_TODO_STATUS`) e o tempo decimal exato que a transação levou para ser processada!
