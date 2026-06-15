import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from '@/infra/cache/redis/redis.service';
import { FreeDictionaryApiService } from './free-dictionary-api.service';
import {
  IWordsRepository,
  WORDS_REPOSITORY,
} from '../repositories/words.repository.interface';
import { CursorPaginatedWordsDto, ListWordsDto } from '../dtos/list-words.dto';

const WORDS_LIST_TTL = 3600;
const WORD_DETAIL_TTL = 86400;

@Injectable()
export class DictionaryService {
  constructor(
    @Inject(WORDS_REPOSITORY)
    private readonly wordsRepository: IWordsRepository,
    private readonly redisService: RedisService,
    private readonly freeDictionaryApiService: FreeDictionaryApiService,
  ) {}

  async listWords(
    params: ListWordsDto,
  ): Promise<{ data: CursorPaginatedWordsDto; cached: boolean }> {
    const cacheKey = `entries:en:${JSON.stringify(params)}`;
    const cached =
      await this.redisService.get<CursorPaginatedWordsDto>(cacheKey);

    if (cached) {
      return { data: cached, cached: true };
    }

    const data = await this.wordsRepository.listWords({
      search: params.search,
      limit: params.limit ?? 20,
      cursor: params.cursor,
    });

    await this.redisService.set(cacheKey, data, WORDS_LIST_TTL);
    return { data, cached: false };
  }

  async getWordDetails(
    word: string,
  ): Promise<{ data: unknown; cached: boolean }> {
    const cacheKey = `word:${word}`;
    const cached = await this.redisService.get<unknown>(cacheKey);

    if (cached) {
      return { data: cached, cached: true };
    }

    const data = await this.freeDictionaryApiService.fetchWord(word);
    await this.redisService.set(cacheKey, data, WORD_DETAIL_TTL);
    return { data, cached: false };
  }
}
