import { AppDataSource } from './data-source';
import { DatabaseService } from './services/database-service';

async function resetDatabase() {
  try {
    await AppDataSource.initialize();
    await AppDataSource.dropDatabase();
    await AppDataSource.synchronize();
    await DatabaseService.seed();
    console.log('Database reset successfully!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();