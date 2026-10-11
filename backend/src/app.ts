import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { connectMongo } from './config/mongo.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb'; 
import { PrismaClient } from './generated/client'; 

import { PrismaTodoRepository } from './adapters/outbound/mysql/PrismaTodoRepository.js';
import { CreateTodo } from './core/use-cases/CreateTodo.js';
import { GetTodos } from './core/use-cases/GetTodos.js';
import { ToggleTodoStatus } from './core/use-cases/ToggleTodoStatus.js';
import { DeleteTodo } from './core/use-cases/DeleteTodo.js';
import { TodoController } from './adapters/inbound/express/TodoController.js';
import { UpdateTodo } from './core/use-cases/UpdateTodo.js';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] ?? 3000;

// 1. Captura e valida a string de conexão do MySQL
const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  throw new Error('A variável de ambiente DATABASE_URL não foi definida no arquivo .env!');
}

const adapter = new PrismaMariaDb(connectionString); 
const prisma = new PrismaClient({ adapter });

app.use(express.json());
app.use(cors());

// 2. Instanciação das camadas da Arquitetura Hexagonal
const todoRepository = new PrismaTodoRepository(prisma);
const createTodo = new CreateTodo(todoRepository);
const getTodos = new GetTodos(todoRepository);
const toggleTodoStatus = new ToggleTodoStatus(todoRepository);  
const deleteTodo = new DeleteTodo(todoRepository);
const updateTodo = new UpdateTodo(todoRepository);

const todoController = new TodoController(createTodo, getTodos, toggleTodoStatus, deleteTodo, updateTodo);

// 3. Definição das Rotas HTTP do To-Do List
app.post('/todos', todoController.create);
app.get('/todos', todoController.list);
app.patch('/todos/:id/toggle', todoController.toggle);
app.delete('/todos/:id', todoController.delete);
app.put('/todos/:id', todoController.update);

// 4. Função de Seed: Garante que exista um usuário Admin padrão no banco
async function seedDefaultUser(): Promise<void> {
  const MOCK_USER_ID = 'user-id-temporario-123';
  
  const existingUser = await prisma.user.findUnique({
    where: { id: MOCK_USER_ID }
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: MOCK_USER_ID,
        name: 'Admin do Desafio',
        email: 'admin@essentia.com',
        password: '1234'
      }
    });
    console.log('👤 Seed: Usuário Admin padrão criado com sucesso no MySQL!');
  }
}

async function startServer(): Promise<void> {
  try {
    // 1. Conecta ao MongoDB (Mongoose)
    await connectMongo();

    // 2. Testa a conexão com o MySQL (Driver Adapter)
    await prisma.$connect();
    console.log('🐬 Conectado ao MySQL com sucesso!');

    // 3. Executa o Seeding automático do Usuário
    await seedDefaultUser();

    // 4. Inicializa o servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando redondinho na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha crítica na inicialização do servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void startServer();
