export interface FavoriteEntry {
  word: string;
  added: Date;
}

export interface FavoritesListResult {
  results: FavoriteEntry[];
  totalDocs: number;
  previous: string | null;
  next: string | null;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IFavoritesRepository {
  addFavorite(userId: string, wordId: number): Promise<void>;
  removeFavorite(userId: string, wordId: number): Promise<void>;
  isFavorite(userId: string, wordId: number): Promise<boolean>;
  listFavorites(params: {
    userId: string;
    limit: number;
    cursor?: string;
  }): Promise<FavoritesListResult>;
}

export const FAVORITES_REPOSITORY = Symbol('IFavoritesRepository');
