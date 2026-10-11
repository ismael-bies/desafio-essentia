import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // É aqui que o Prisma 7 passa a ler de forma segura a URL transacional
    url: process.env['DATABASE_URL'] ?? "mysql://root:root@localhost:3306/desafio-essentia",
  },
});
