export const FAVORITES_QUEUE = 'favorites';

export interface AddFavoriteJobPayload {
  userId: string;
  word: string;
}

export const ADD_FAVORITE_JOB = 'add-favorite';
