import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AddFavoriteUseCase } from './add-favorite.use-case';
import { RemoveFavoriteUseCase } from './remove-favorite.use-case';
import { ListFavoritesUseCase } from './list-favorites.use-case';
import { FAVORITES_REPOSITORY } from '@/modules/favorites/repositories/favorites.repository.interface';
import { WORDS_REPOSITORY } from '@/modules/dictionary/repositories/words.repository.interface';

describe('Favorites Use Cases', () => {
  let addFavoriteUseCase: AddFavoriteUseCase;
  let removeFavoriteUseCase: RemoveFavoriteUseCase;
  let listFavoritesUseCase: ListFavoritesUseCase;

  const mockFavoritesRepository = {
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    isFavorite: jest.fn(),
    listFavorites: jest.fn(),
  };

  const mockWordsRepository = {
    findByWord: jest.fn(),
    upsertWord: jest.fn(),
    listWords: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddFavoriteUseCase,
        RemoveFavoriteUseCase,
        ListFavoritesUseCase,
        { provide: FAVORITES_REPOSITORY, useValue: mockFavoritesRepository },
        { provide: WORDS_REPOSITORY, useValue: mockWordsRepository },
      ],
    }).compile();

    addFavoriteUseCase = module.get<AddFavoriteUseCase>(AddFavoriteUseCase);
    removeFavoriteUseCase =
      module.get<RemoveFavoriteUseCase>(RemoveFavoriteUseCase);
    listFavoritesUseCase =
      module.get<ListFavoritesUseCase>(ListFavoritesUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  describe('AddFavoriteUseCase', () => {
    it('should add a word to favorites', async () => {
      mockWordsRepository.upsertWord.mockResolvedValue({ id: 1, word: 'fire' });
      mockFavoritesRepository.addFavorite.mockResolvedValue(undefined);

      await expect(
        addFavoriteUseCase.execute('user-1', 'fire'),
      ).resolves.toBeUndefined();
      expect(mockWordsRepository.upsertWord).toHaveBeenCalledWith('fire');
      expect(mockFavoritesRepository.addFavorite).toHaveBeenCalledWith(
        'user-1',
        1,
      );
    });

    it('should throw ConflictException if word is already favorited', async () => {
      mockWordsRepository.upsertWord.mockResolvedValue({ id: 1, word: 'fire' });
      mockFavoritesRepository.addFavorite.mockRejectedValue(
        new ConflictException('Word is already in favorites'),
      );

      await expect(
        addFavoriteUseCase.execute('user-1', 'fire'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('RemoveFavoriteUseCase', () => {
    it('should remove a word from favorites', async () => {
      mockWordsRepository.findByWord.mockResolvedValue({ id: 1, word: 'fire' });
      mockFavoritesRepository.removeFavorite.mockResolvedValue(undefined);

      await expect(
        removeFavoriteUseCase.execute('user-1', 'fire'),
      ).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if word does not exist in db', async () => {
      mockWordsRepository.findByWord.mockResolvedValue(null);

      await expect(
        removeFavoriteUseCase.execute('user-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
      expect(mockFavoritesRepository.removeFavorite).not.toHaveBeenCalled();
    });
  });

  describe('ListFavoritesUseCase', () => {
    it('should list favorites with pagination', async () => {
      const mockResult = {
        results: [{ word: 'fire', added: new Date() }],
        totalDocs: 1,
        previous: null,
        next: null,
        hasNext: false,
        hasPrev: false,
      };
      mockFavoritesRepository.listFavorites.mockResolvedValue(mockResult);

      const result = await listFavoritesUseCase.execute({
        userId: 'user-1',
        limit: 20,
      });

      expect(result.results).toHaveLength(1);
      expect(result.results[0].word).toBe('fire');
    });
  });
});
