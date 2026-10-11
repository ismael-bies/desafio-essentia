import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectMongo = async (): Promise<void> => {
  try {
    const mongoUri = process.env['MONGO_URI'];
    
    if (!mongoUri) {
      throw new Error('A variável de ambiente MONGO_URI não foi definida no arquivo .env!');
    }

    await mongoose.connect(mongoUri);
    console.log('🍃 Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('❌ Erro crítico ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};
