import { Test, TestingModule } from '@nestjs/testing';
import { AddHistoryUseCase } from './add-history.use-case';
import { ListHistoryUseCase } from './list-history.use-case';
import { HISTORY_REPOSITORY } from '@/modules/history/repositories/history.repository.interface';
import { WORDS_REPOSITORY } from '@/modules/dictionary/repositories/words.repository.interface';

describe('History Use Cases', () => {
  let addHistoryUseCase: AddHistoryUseCase;
  let listHistoryUseCase: ListHistoryUseCase;

  const mockHistoryRepository = {
    addEntry: jest.fn(),
    listHistory: jest.fn(),
  };

  const mockWordsRepository = {
    findByWord: jest.fn(),
    upsertWord: jest.fn(),
    listWords: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddHistoryUseCase,
        ListHistoryUseCase,
        { provide: HISTORY_REPOSITORY, useValue: mockHistoryRepository },
        { provide: WORDS_REPOSITORY, useValue: mockWordsRepository },
      ],
    }).compile();

    addHistoryUseCase = module.get<AddHistoryUseCase>(AddHistoryUseCase);
    listHistoryUseCase = module.get<ListHistoryUseCase>(ListHistoryUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  describe('AddHistoryUseCase', () => {
    it('should upsert word and add history entry', async () => {
      mockWordsRepository.upsertWord.mockResolvedValue({ id: 42, word: 'fire' });
      mockHistoryRepository.addEntry.mockResolvedValue(undefined);

      await expect(
        addHistoryUseCase.execute('user-1', 'fire'),
      ).resolves.toBeUndefined();

      expect(mockWordsRepository.upsertWord).toHaveBeenCalledWith('fire');
      expect(mockHistoryRepository.addEntry).toHaveBeenCalledWith('user-1', 42);
    });
  });

  describe('ListHistoryUseCase', () => {
    it('should return paginated history', async () => {
      const now = new Date().toISOString();
      const mockResult = {
        results: [
          { word: 'fire', added: now },
          { word: 'water', added: now },
        ],
        totalDocs: 2,
        previous: null,
        next: null,
        hasNext: false,
        hasPrev: false,
      };
      mockHistoryRepository.listHistory.mockResolvedValue(mockResult);

      const result = await listHistoryUseCase.execute({
        userId: 'user-1',
        limit: 20,
      });

      expect(result.results).toHaveLength(2);
      expect(result.totalDocs).toBe(2);
    });

    it('should pass cursor to repository', async () => {
      const cursor = Buffer.from(new Date().toISOString()).toString('base64');
      mockHistoryRepository.listHistory.mockResolvedValue({
        results: [],
        totalDocs: 0,
        previous: null,
        next: null,
        hasNext: false,
        hasPrev: true,
      });

      await listHistoryUseCase.execute({ userId: 'user-1', limit: 10, cursor });

      expect(mockHistoryRepository.listHistory).toHaveBeenCalledWith({
        userId: 'user-1',
        limit: 10,
        cursor,
      });
    });
  });
});
