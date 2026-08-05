import { MeiliSearch } from 'meilisearch';
import dotenv from 'dotenv';
dotenv.config();

const meiliClient = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILI_MASTER_KEY || 'masterKey',
});

export const setupMeilisearch = async () => {
  try {
    const index = meiliClient.index('products');
    await index.updateFilterableAttributes(['categoryId', 'priceTry', 'brand', 'size', 'color']);
    await index.updateSortableAttributes(['priceTry', 'createdAt', 'soldCount', 'avgRating']);
    console.log(' Meilisearch configured');
  } catch (error) {
    console.error(' Meilisearch configuration failed:', error);
  }
};

export default meiliClient;
