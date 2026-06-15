import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const WORDS_URL =
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';
const BATCH_SIZE = 1000;

async function main() {
  const prisma = new PrismaClient();
  console.log('Fetching words dictionary...');

  const response = await axios.get(WORDS_URL);
  const words = Object.keys(response.data);

  console.log(`Downloaded ${words.length} words. Starting import...`);

  let imported = 0;
  let skipped = 0;

  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE);

    const result = await prisma.$executeRaw`
      INSERT INTO words (word, created_at)
      SELECT unnest(${batch}::text[]), NOW()
      ON CONFLICT (word) DO NOTHING
    `;

    imported += Number(result);
    skipped += batch.length - Number(result);

    if (i % 10000 === 0) {
      console.log(
        `Progress: ${i}/${words.length} (${Math.round((i / words.length) * 100)}%)`,
      );
    }
  }

  console.log(
    `Import complete. Imported: ${imported}, Skipped (duplicates): ${skipped}`,
  );
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
