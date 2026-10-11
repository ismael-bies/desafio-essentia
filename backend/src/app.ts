import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { connectMongo } from './config/mongo.js';
import { PrismaClient } from './generated/client/index.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaTodoRepository } from './adapters/outbound/mysql/PrismaTodoRepository.js';
import { CreateTodo } from './core/use-cases/CreateTodo.js';
import { GetTodos } from './core/use-cases/GetTodos.js';
import { ToggleTodoStatus } from './core/use-cases/ToggleTodoStatus.js';
import { DeleteTodo } from './core/use-cases/DeleteTodo.js';
import { UpdateTodo } from './core/use-cases/UpdateTodo.js';
import { TodoController } from './adapters/inbound/express/TodoController.js';
import { auditLogger } from './middlewares/auditLogger.js';
import { authGuard, AuthenticatedRequest } from './middlewares/authGuard.js';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] ?? 3000;
const JWT_SECRET = process.env['JWT_SECRET'] || 'essentia_secret_key_2026';

const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  throw new Error('A variável de ambiente DATABASE_URL não foi definida!');
}

const dbUrl = new URL(connectionString);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
  connectionLimit: 10
});

const prisma = new PrismaClient({ adapter });

app.use(express.json());
app.use(cors());
app.use(auditLogger);

// ==========================================
// 🔐 ROTAS DE AUTENTICAÇÃO (JWT & BCRYPT)
// ==========================================

// Remova a linha "import crypto from 'crypto';" se ela estiver no topo

app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Este e-mail já está cadastrado no sistema.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ── CONFIGURAÇÃO DE SEGURANÇA MÁXIMA PARA DOCKER ESM:
    // Chamamos a função global da API do Node para evitar erros de importação e quebra de módulo
    const userUuid = globalThis.crypto.randomUUID();

    const newUser = await prisma.user.create({
      data: { 
        id: userUuid,
        name, 
        email, 
        password: hashedPassword 
      }
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.error('❌ Erro detalhado no registro:', error);
    res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
  }
});


app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: 'E-mail ou senha inválidos.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: 'E-mail ou senha inválidos.' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
});

// ==========================================
// 📝 ROTAS DO TO-DO LIST (PROTEGIDAS COM AUTHGUARD)
// ==========================================

const todoRepository = new PrismaTodoRepository(prisma);
const createTodo = new CreateTodo(todoRepository);
const getTodos = new GetTodos(todoRepository);
const toggleTodoStatus = new ToggleTodoStatus(todoRepository);
const deleteTodo = new DeleteTodo(todoRepository);
const updateTodo = new UpdateTodo(todoRepository);

const todoController = new TodoController(createTodo, getTodos, toggleTodoStatus, deleteTodo, updateTodo);

app.post('/todos', authGuard, async (req: AuthenticatedRequest, res) => {
  try {
    // ── INTERCEPTOR INTELIGENTE DE CORPO: Captura 'title', 'name' ou o próprio corpo como string
    const title = req.body.title || req.body.name || (typeof req.body === 'string' ? req.body : null);
    const userId = req.userId;

    const cleanTitle = typeof title === 'object' && title !== null ? (title.title || title.name) : title;

    if (!cleanTitle || String(cleanTitle).trim() === '') {
      res.status(400).json({ error: 'O título da tarefa não pode ser vazio!' });
      return;
    }

    const todo = await createTodo.execute(String(cleanTitle).trim(), userId!);
    res.status(201).json(todo);
  } catch (error: any) {
    console.error('Erro na rota de criação de tarefas:', error);
    res.status(500).json({ error: error.message || 'Erro ao criar tarefa.' });
  }
});


app.get('/todos', authGuard, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId; // Captura o ID limpo do token
    const todos = await getTodos.execute(userId!);
    res.status(200).json(todos);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro ao listar tarefas.' });
  }
});

app.patch('/todos/:id/toggle', authGuard, todoController.toggle);
app.put('/todos/:id', authGuard, todoController.update);
app.delete('/todos/:id', authGuard, todoController.delete);

async function startServer(): Promise<void> {
  try {
    await connectMongo();
    await prisma.$connect();
    
    app.listen(Number(PORT), () => {
      console.log(`🚀 Servidor e API JWT rodando perfeitamente na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha crítica na inicialização do servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void startServer();
