const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // =====================================================
  // PASSWORD
  // =====================================================

  const password = await bcrypt.hash("Password@123", 10);

  // =====================================================
  // USERS
  // =====================================================

  const user1 = await prisma.user.upsert({
    where: {
      email: "kajal@example.com",
    },
    update: {},
    create: {
      name: "Kajal Katnoria",
      email: "kajal@example.com",
      password,
    },
  });

  const user2 = await prisma.user.upsert({
    where: {
      email: "student@example.com",
    },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@example.com",
      password,
    },
  });

  console.log("✅ Users created");

  // =====================================================
  // CHAT GROUPS
  // =====================================================

  const codingClub = await prisma.chatGroup.upsert({
    where: {
      id: 1,
    },
    update: {
      name: "Coding Club",
    },
    create: {
      id: 1,
      name: "Coding Club",
    },
  });

  const roboticsClub = await prisma.chatGroup.upsert({
    where: {
      id: 2,
    },
    update: {
      name: "Robotics Club",
    },
    create: {
      id: 2,
      name: "Robotics Club",
    },
  });

  const cseStudents = await prisma.chatGroup.upsert({
    where: {
      id: 3,
    },
    update: {
      name: "CSE Students",
    },
    create: {
      id: 3,
      name: "CSE Students",
    },
  });

  console.log("✅ Chat groups created");

  // Avoid unused-variable warnings
  console.log(
    `Groups: ${codingClub.name}, ${roboticsClub.name}, ${cseStudents.name}`
  );

  // =====================================================
  // EVENTS
  // =====================================================

  await prisma.event.createMany({
    data: [
      {
        title: "Tech Fest 2026",
        description:
          "Annual technical festival of the college.",
        date: new Date("2026-09-15T10:00:00"),
        location: "Main Auditorium",
        createdBy: user1.id,
      },
      {
        title: "Coding Contest",
        description:
          "Competitive programming contest for students.",
        date: new Date("2026-09-20T14:00:00"),
        location: "Computer Center",
        createdBy: user2.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Events created");

  // =====================================================
  // STUDY MATERIAL
  // =====================================================

  await prisma.studyMaterial.createMany({
    data: [
      {
        title: "Data Structures Notes",
        description:
          "Complete notes for Data Structures and Algorithms.",
        subject: "Data Structures",
        fileUrl:
          "https://example.com/dsa-notes.pdf",
        fileType: "pdf",
        uploadedBy: user1.id,
      },
      {
        title: "DBMS Notes",
        description:
          "Database Management Systems study material.",
        subject: "DBMS",
        fileUrl:
          "https://example.com/dbms-notes.pdf",
        fileType: "pdf",
        uploadedBy: user2.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Study materials created");

  // =====================================================
  // MARKETPLACE ITEMS
  // =====================================================

  await prisma.marketplaceItem.createMany({
    data: [
      {
        title: "Engineering Calculator",
        description:
          "Casio scientific calculator in good condition.",
        price: 500,
        image: null,
        category: "Electronics",
        status: "AVAILABLE",
        sellerId: user1.id,
      },
      {
        title: "DSA Notes",
        description:
          "Complete handwritten DSA notes for placement preparation.",
        price: 200,
        image: null,
        category: "Books",
        status: "AVAILABLE",
        sellerId: user2.id,
      },
      {
        title: "College Backpack",
        description:
          "Good quality college backpack, lightly used.",
        price: 800,
        image: null,
        category: "Accessories",
        status: "AVAILABLE",
        sellerId: user1.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Marketplace items created");

  // =====================================================
  // FINISHED
  // =====================================================

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });