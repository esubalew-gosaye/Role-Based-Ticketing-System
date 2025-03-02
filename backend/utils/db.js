import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ['query']  // TODO: remove this on production
});


export default prisma