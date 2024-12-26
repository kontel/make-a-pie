import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const mockPies = [
    {
      name: "Classic Apple Pie",
      description: "Traditional American apple pie with cinnamon and flaky crust",
      imageUrl: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5",
    },
    {
      name: "Cherry Pie",
      description: "Sweet-tart cherry filling in a buttery golden crust",
      imageUrl: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13",
    },
    {
      name: "Blueberry Pie",
      description: "Fresh blueberries with a hint of lemon zest",
      imageUrl: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5",
    }
  ];

  for (const pie of mockPies) {
    await prisma.pIE_Entry.create({
      data: pie
    });
  }

  console.log('Added mock pies successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 