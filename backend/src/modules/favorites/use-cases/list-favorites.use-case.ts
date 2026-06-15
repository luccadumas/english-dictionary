import { Injectable, Inject } from '@nestjs/common';
import {
  IFavoritesRepository,
  FAVORITES_REPOSITORY,
  FavoritesListResult,
} from '../repositories/favorites.repository.interface';

@Injectable()
export class ListFavoritesUseCase {
  constructor(
    @Inject(FAVORITES_REPOSITORY)
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  async execute(params: {
    userId: string;
    limit: number;
    cursor?: string;
  }): Promise<FavoritesListResult> {
    return this.favoritesRepository.listFavorites(params);
  }
}
