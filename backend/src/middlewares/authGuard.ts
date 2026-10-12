import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env['JWT_SECRET'] || 'essentia_secret_key_2026';

// Estende a interface do Request do Express para aceitar o campo userId sem reclamar
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authGuard = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    return;
  }

  try {
    // Descriptografa o token JWT gerado no login/cadastro
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // ── O SEGREDO DO SUCESSO ESTÁ AQUI: Injeta o ID real do usuário autenticado no request!
    req.userId = decoded.userId; 

    next(); // Permite que a rota prossiga com o ID do usuário acoplado de forma segura
  } catch (error) {
    res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};
