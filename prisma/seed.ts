import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create pies
  const applePie = await prisma.pie.create({
    data: {
      title: "Apple Pie",
      description: "A classic American pie",
      imageData: "https://placehold.co/400x300/e8c39e/ffffff?text=Apple+Pie",
      userName: "Alice",
    },
  });
  const cherryPie = await prisma.pie.create({
    data: {
      title: "Cherry Pie",
      description: "Sweet and tart",
      imageData: "https://placehold.co/400x300/cc3333/ffffff?text=Cherry+Pie",
      userName: "Bob",
    },
  });
  const blueberryPie = await prisma.pie.create({
    data: {
      title: "Blueberry Pie",
      description: "Bursting with flavor",
      imageData: "https://placehold.co/400x300/4444cc/ffffff?text=Blueberry+Pie",
      userName: "Charlie",
    },
  });

  // Create votes
  await prisma.vote.createMany({
    data: [
      { stars: 2, userName: "Bob", pieId: applePie.id },
      { stars: 1, userName: "Charlie", pieId: applePie.id },
      { stars: 3, userName: "Alice", pieId: cherryPie.id },
      { stars: 2, userName: "Charlie", pieId: cherryPie.id },
      { stars: 3, userName: "Alice", pieId: blueberryPie.id },
      { stars: 1, userName: "Bob", pieId: blueberryPie.id },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
