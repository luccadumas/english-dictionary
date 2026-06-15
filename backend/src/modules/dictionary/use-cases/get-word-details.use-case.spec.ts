import { Test, TestingModule } from '@nestjs/testing';
import { GetWordDetailsUseCase } from './get-word-details.use-case';
import { DictionaryService } from '../services/dictionary.service';

describe('GetWordDetailsUseCase', () => {
  let useCase: GetWordDetailsUseCase;
  const mockDictionaryService = {
    getWordDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetWordDetailsUseCase,
        { provide: DictionaryService, useValue: mockDictionaryService },
      ],
    }).compile();

    useCase = module.get(GetWordDetailsUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns word details from service', async () => {
    const payload = [{ word: 'fire', meanings: [] }];
    mockDictionaryService.getWordDetails.mockResolvedValue({
      data: payload,
      cached: false,
    });

    const result = await useCase.execute('fire');

    expect(mockDictionaryService.getWordDetails).toHaveBeenCalledWith('fire');
    expect(result.data).toEqual(payload);
    expect(result.cached).toBe(false);
  });
});
