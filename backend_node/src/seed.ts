import { DatabaseService } from './services/database-service';

async function seed() {
  try {
    await DatabaseService.initialize();
    console.log('Database seeding');
    await DatabaseService.seed();
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();