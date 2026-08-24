const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const group = await prisma.chatGroup.create({
        data: {
            name: "Coding Club",
        },
    });

    console.log("GROUP CREATED:", group);
}

main()
    .catch((error) => {
        console.error("ERROR:", error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });