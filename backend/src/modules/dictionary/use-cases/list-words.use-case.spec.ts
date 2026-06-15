import { Test, TestingModule } from '@nestjs/testing';
import { ListWordsUseCase } from './list-words.use-case';
import { DictionaryService } from '../services/dictionary.service';

describe('ListWordsUseCase', () => {
  let useCase: ListWordsUseCase;
  const mockDictionaryService = {
    listWords: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListWordsUseCase,
        { provide: DictionaryService, useValue: mockDictionaryService },
      ],
    }).compile();

    useCase = module.get(ListWordsUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns paginated words from service', async () => {
    const paginated = {
      results: ['fire', 'firefly'],
      totalDocs: 2,
      previous: null,
      next: null,
      hasNext: false,
      hasPrev: false,
    };
    mockDictionaryService.listWords.mockResolvedValue({
      data: paginated,
      cached: true,
    });

    const result = await useCase.execute({ limit: 20 });
    expect(result.data).toEqual(paginated);
    expect(result.cached).toBe(true);
  });
});
