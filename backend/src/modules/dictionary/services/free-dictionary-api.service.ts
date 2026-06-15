import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios, { type AxiosResponse } from 'axios';
import type { Readable } from 'stream';
import { ApiErrorCode } from '@/shared/errors/api-error-codes';
import { apiException } from '@/shared/errors/api.exception';

const FREE_DICT_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

@Injectable()
export class FreeDictionaryApiService {
  private readonly logger = new Logger(FreeDictionaryApiService.name);

  async fetchWord(word: string): Promise<unknown> {
    try {
      const response = await axios.get<unknown>(`${FREE_DICT_BASE}/${word}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw apiException(
            HttpStatus.NOT_FOUND,
            ApiErrorCode.WORD_NOT_FOUND,
            `Word "${word}" not found`,
            { word },
          );
        }
        if (error.response?.status && error.response.status >= 500) {
          this.logger.error(
            `Dictionary API unavailable for "${word}"`,
            error.message,
          );
          throw apiException(
            HttpStatus.BAD_GATEWAY,
            ApiErrorCode.DICTIONARY_SERVICE_UNAVAILABLE,
            'Dictionary service temporarily unavailable',
          );
        }
      }
      this.logger.error(
        `Failed to fetch word "${word}" from Free Dictionary API`,
        error,
      );
      throw apiException(
        HttpStatus.NOT_FOUND,
        ApiErrorCode.WORD_NOT_FOUND,
        `Word "${word}" not found`,
        { word },
      );
    }
  }

  async fetchAudioStream(url: string): Promise<AxiosResponse<Readable>> {
    try {
      return await axios.get<Readable>(url, { responseType: 'stream' });
    } catch (error) {
      this.logger.error(`Failed to stream audio from ${url}`, error);
      throw apiException(
        HttpStatus.BAD_GATEWAY,
        ApiErrorCode.AUDIO_SERVICE_UNAVAILABLE,
        'Audio service temporarily unavailable',
      );
    }
  }
}
