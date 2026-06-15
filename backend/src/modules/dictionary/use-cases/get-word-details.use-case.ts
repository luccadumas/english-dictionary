import { Injectable } from '@nestjs/common';
import { DictionaryService } from '../services/dictionary.service';

@Injectable()
export class GetWordDetailsUseCase {
  constructor(private readonly dictionaryService: DictionaryService) {}

  async execute(word: string): Promise<{ data: unknown; cached: boolean }> {
    return this.dictionaryService.getWordDetails(word);
  }
}
