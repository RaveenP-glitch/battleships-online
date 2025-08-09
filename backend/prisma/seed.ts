import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.move.deleteMany();
  await prisma.ship.deleteMany();
  await prisma.game.deleteMany();
  await prisma.player.deleteMany();

  // Create test players
  console.log('👥 Creating test players...');
  const player1 = await prisma.player.create({
    data: {
      name: 'Admiral Nelson',
    },
  });

  const player2 = await prisma.player.create({
    data: {
      name: 'Captain Hook',
    },
  });

  console.log(`✅ Created players: ${player1.name} and ${player2.name}`);

  // Create a test game
  console.log('🎮 Creating test game...');
  const game = await prisma.game.create({
    data: {
      status: 'WAITING_FOR_PLAYER',
      player1Id: player1.id,
    },
  });

  console.log(`✅ Created game with ID: ${game.id}`);

  // Create some test ships for player1
  console.log('🚢 Creating test ships...');
  const battleship = await prisma.ship.create({
    data: {
      type: 'BATTLESHIP',
      size: 4,
      startX: 0,
      startY: 0,
      direction: 'HORIZONTAL',
      gameId: game.id,
      playerId: player1.id,
    },
  });

  const destroyer1 = await prisma.ship.create({
    data: {
      type: 'DESTROYER',
      size: 3,
      startX: 0,
      startY: 2,
      direction: 'HORIZONTAL',
      gameId: game.id,
      playerId: player1.id,
    },
  });

  const destroyer2 = await prisma.ship.create({
    data: {
      type: 'DESTROYER',
      size: 3,
      startX: 5,
      startY: 5,
      direction: 'VERTICAL',
      gameId: game.id,
      playerId: player1.id,
    },
  });

  console.log(`✅ Created ships: Battleship, Destroyer 1, Destroyer 2`);

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - Players: 2`);
  console.log(`   - Games: 1`);
  console.log(`   - Ships: 3`);
  console.log(`   - Test Game ID: ${game.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 