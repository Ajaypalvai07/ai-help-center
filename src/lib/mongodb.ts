import { MongoClient, Collection, Document } from 'mongodb';
import { config } from '../config';

class MongoDB {
  private client: MongoClient;

  constructor() {
    this.client = new MongoClient(config.mongoUri);
  }

  async getCollection<T extends Document>(name: string): Promise<Collection<T>> {
    await this.client.connect();
    return this.client.db().collection<T>(name);
  }
}

export const mongodb = new MongoDB(); 