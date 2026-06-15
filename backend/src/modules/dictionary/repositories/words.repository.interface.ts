import { CursorPaginatedWordsDto } from '../dtos/list-words.dto';

export interface IWordsRepository {
  listWords(params: {
    search?: string;
    limit: number;
    cursor?: string;
  }): Promise<CursorPaginatedWordsDto>;
  findByWord(word: string): Promise<{ id: number; word: string } | null>;
  upsertWord(word: string): Promise<{ id: number; word: string }>;
}

export const WORDS_REPOSITORY = Symbol('IWordsRepository');
