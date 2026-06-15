import { Injectable, Logger, NotFoundException, BadGatewayException } from '@nestjs/common';
import axios, { type AxiosResponse } from 'axios';
import type { Readable } from 'stream';

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
          throw new NotFoundException(`Word "${word}" not found`);
        }
        if (error.response?.status && error.response.status >= 500) {
          this.logger.error(
            `Dictionary API unavailable for "${word}"`,
            error.message,
          );
          throw new BadGatewayException(
            'Dictionary service temporarily unavailable',
          );
        }
      }
      this.logger.error(
        `Failed to fetch word "${word}" from Free Dictionary API`,
        error,
      );
      throw new NotFoundException(`Word "${word}" not found`);
    }
  }

  async fetchAudioStream(url: string): Promise<AxiosResponse<Readable>> {
    try {
      return await axios.get<Readable>(url, { responseType: 'stream' });
    } catch (error) {
      this.logger.error(`Failed to stream audio from ${url}`, error);
      throw new BadGatewayException('Audio service temporarily unavailable');
    }
  }
}
