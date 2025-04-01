import {PrismaClient} from '@prisma/client';

const PrismaClientSingleton =() => {
    return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient  | undefined };

type PrismaClientSingleton = ReturnType<typeof PrismaClientSingleton>;
const prisma = globalForPrisma.prisma ?? PrismaClientSingleton();

export default prisma

if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function saveFileMetadata(fileUrl: string, file: File) {
    await prisma.uploadedFile.create({
        data: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileUrl: fileUrl
        }
    });
}