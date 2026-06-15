import { Injectable } from '@nestjs/common';
import { DictionaryService } from '../services/dictionary.service';
import { ListWordsDto, CursorPaginatedWordsDto } from '../dtos/list-words.dto';

@Injectable()
export class ListWordsUseCase {
  constructor(private readonly dictionaryService: DictionaryService) {}

  async execute(
    params: ListWordsDto,
  ): Promise<{ data: CursorPaginatedWordsDto; cached: boolean }> {
    return this.dictionaryService.listWords(params);
  }
}
