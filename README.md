# 🚀 Desafio Técnico - To-Do List Avançado

Este projeto consiste em uma aplicação robusta de gerenciamento de tarefas (To-Do List), desenvolvida como parte de um desafio técnico corporativo. A aplicação utiliza uma abordagem multi-banco de dados, operando de forma síncrona com **MySQL** e **MongoDB** sob uma arquitetura desacoplada e reativa.

---

## 🏗️ Arquitetura e Decisões de Projeto

### Backend (Arquitetura Hexagonal / Ports & Adapters)
O ecossistema do servidor foi construído seguindo rigorosamente os princípios da **Arquitetura Hexagonal**, garantindo o isolamento completo das regras de negócio contra frameworks, drivers ou bancos de dados externos:
* **Core & Domínio:** Entidades puras e Casos de Uso (*Use Cases*) totalmente tipados em TypeScript estrito, livres de dependências externas.
* **Inversão de Dependência:** O domínio comunica-se com o mundo externo exclusivamente através de Portas (*Interfaces*).
* **Estratégia Multi-Banco:** 
  * **MySQL (Transacional):** Responsável pela persistência e integridade referencial dos dados core da aplicação, como usuários e gerenciamento das tarefas com chaves primárias numéricas sequenciais (`Int Autoincrement`).
  * **MongoDB (Auditoria e Métricas):** Implementado por meio de um *Middleware Global Interceptor* que captura, de forma assíncrona em background, a volumetria de mutações de dados e armazena métricas exatas de performance e tempo de resposta das rotas (`durationMs`).

### Frontend (Modern Angular 19)
Interface construída sobre os pilares mais recentes da engenharia do Angular:
* **Standalone Architecture:** Eliminação completa de módulos legados (`NgModule`), otimizando a árvore de compilação.
* **Signals (Reactive State):** Gerenciamento de estado local reativo nativo utilizando *Signals*, substituindo fluxos complexos de RxJS por atualizações cirúrgicas de DOM e performance ultra-otimizada.
* **Smart & Dumb Components:** Separação clara de responsabilidades estruturais. Páginas (*Smart*) gerenciam serviços e conexões HTTP, enquanto componentes de visualização (*Dumb*) reagem de forma isolada aos dados.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** Angular 19, TypeScript Estrito, SCSS, Vite.
* **Backend:** Node.js, Express, TypeScript (NodeNext Module Resolution).
* **ORM & Drivers:** Prisma ORM 7, Driver Adapter MariaDB/MySQL, Mongoose.
* **Bancos de Dados:** MySQL 8.0, MongoDB 6.0.
* **Infraestrutura:** Docker, Docker Compose.

---

## 📦 Como Executar o Projeto

Graças ao empacotamento completo do ambiente, você não precisa ter bancos de dados ou gerenciadores de pacotes instalados localmente. A aplicação pode ser inicializada com um único comando através do Docker.

### Pré-requisitos
* Ter o **Docker** e o **Docker Compose** instalados na máquina.

### Passos para Inicialização

1. Certifique-se de que as portas `3000`, `4200`, `3307` e `27017` estão livres na sua máquina física.
2. Na raiz global do projeto (onde encontra-se o arquivo `docker-compose.yml`), execute o comando para buildar e subir os containers em background:

```bash
docker compose up -d --build
```

3. O Docker Compose irá inicializar os serviços respeitando as ordens de dependência (*Healthchecks*). Uma rotina automática de **Database Seeding** rodará no primeiro boot do MySQL, criando um usuário Admin padrão para os testes do To-Do List.

4. Pronto! Acesse os serviços no seu navegador:
   * **Aplicação Web (Frontend):** [http://localhost:4200](http://localhost:4200)
   * **API REST (Backend):** [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testando os Endpoints (Métricas e Auditoria)

Caso queira testar a API de forma isolada através de ferramentas como **Insomnia** ou **Postman**, os seguintes endpoints do To-Do List estão expostos localmente (o ID do usuário Admin padrão é injetado automaticamente pelo controlador nesta etapa):

* `POST /todos` - Cria uma nova tarefa (Espera receber `{ "title": "Texto" }` no corpo).
* `GET /todos` - Retorna a listagem de tarefas ordenada de forma crescente por ID (`id: asc`).
* `PATCH /todos/:id/toggle` - Altera o estado de conclusão da tarefa e computa/limpa a data em `completedAt`.
* `PUT /todos/:id` - Permite a edição do título da tarefa.
* `DELETE /todos/:id` - Remove o registro do MySQL.

*Nota: Toda mutação de dados efetuada (POST, PATCH, PUT, DELETE) disparará o Middleware de auditoria, registrando o log e o benchmark de performance de milissegundos dentro da coleção do MongoDB.*
