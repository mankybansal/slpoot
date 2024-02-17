import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Ensure `prisma` is available globally for TypeScript
// This is especially useful if you're using TypeScript, but optional in plain JavaScript
declare global {
  var prisma: PrismaClient | undefined;
}

export default prisma;
