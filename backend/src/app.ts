import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectMongo } from './config/mongo.js';
import { PrismaClient } from './generated/client/index.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb'; // <-- 1. IMPORTAÇÃO DO ADAPTER EXIGIDO PELO LOG

import { PrismaTodoRepository } from './adapters/outbound/mysql/PrismaTodoRepository.js';
import { CreateTodo } from './core/use-cases/CreateTodo.js';
import { GetTodos } from './core/use-cases/GetTodos.js';
import { ToggleTodoStatus } from './core/use-cases/ToggleTodoStatus.js';
import { DeleteTodo } from './core/use-cases/DeleteTodo.js';
import { UpdateTodo } from './core/use-cases/UpdateTodo.js';
import { TodoController } from './adapters/inbound/express/TodoController.js';
import { auditLogger } from './middlewares/auditLogger.js';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] ?? 3000;

const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  throw new Error('A variável de ambiente DATABASE_URL não foi definida!');
}

// ── 2. INSTANCIAÇÃO OFICIAL EXIGIDA PELO SEU PRISMA CLIENT LOCAL:
const dbUrl = new URL(connectionString);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1), // Remove a barra '/' inicial do nome do banco
  connectionLimit: 10
});
const prisma = new PrismaClient({ adapter });

app.use(express.json());
app.use(cors());
app.use(auditLogger);

const todoRepository = new PrismaTodoRepository(prisma);
const createTodo = new CreateTodo(todoRepository);
const getTodos = new GetTodos(todoRepository);
const toggleTodoStatus = new ToggleTodoStatus(todoRepository);
const deleteTodo = new DeleteTodo(todoRepository);
const updateTodo = new UpdateTodo(todoRepository);

const todoController = new TodoController(createTodo, getTodos, toggleTodoStatus, deleteTodo, updateTodo);

app.post('/todos', todoController.create);
app.get('/todos', todoController.list);
app.patch('/todos/:id/toggle', todoController.toggle);
app.put('/todos/:id', todoController.update);
app.delete('/todos/:id', todoController.delete);

async function seedDefaultUser(): Promise<void> {
  const MOCK_USER_ID = 'user-id-temporario-123';
  const existingUser = await prisma.user.findUnique({ where: { id: MOCK_USER_ID } });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: MOCK_USER_ID,
        name: 'Admin do Desafio',
        email: 'admin@essentia.com',
        password: 'senha_criptografada_depois'
      }
    });
  }
}

async function startServer(): Promise<void> {
  try {
    await connectMongo();
    await prisma.$connect();
    await seedDefaultUser();

    app.listen(Number(PORT), () => {
      console.log(`🚀 Servidor rodando perfeitamente na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha crítica na inicialização do servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void startServer();
