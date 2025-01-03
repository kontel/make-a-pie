import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type GlobalWithPrisma = typeof globalThis & {
  prisma: PrismaClient | undefined;
};

const globalWithPrisma = globalThis as GlobalWithPrisma;

export const prisma = globalWithPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalWithPrisma.prisma = prisma;
