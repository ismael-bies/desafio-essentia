import mongoose from 'mongoose';

export async function connectMongo(): Promise<void> {
  const mongoUri = process.env['MONGO_URI'] || 'mongodb://mongodb:27017/desafio_todo';

  try {
    // Conecta de forma estável ao banco e injeta o nome da database desafio_todo na própria rota
    await mongoose.connect(mongoUri, {
      dbName: 'desafio_todo'
    });
    console.log('🍃 Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('❌ Erro crítico ao conectar no MongoDB:', error);
    throw error;
  }
}
