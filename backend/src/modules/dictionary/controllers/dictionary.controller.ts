import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
  NotFoundException,
  ParseIntPipe,
  BadGatewayException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  JwtPayload,
} from '@/shared/decorators/current-user.decorator';
import { ListWordsUseCase } from '../use-cases/list-words.use-case';
import { GetWordDetailsUseCase } from '../use-cases/get-word-details.use-case';
import { FreeDictionaryApiService } from '../services/free-dictionary-api.service';
import { RemoveFavoriteUseCase } from '@/modules/favorites/use-cases/remove-favorite.use-case';
import { AddHistoryUseCase } from '@/modules/history/use-cases/add-history.use-case';
import { FavoritesQueueService } from '@/modules/favorites/queue/favorites-queue.service';
import { IsFavoriteUseCase } from '@/modules/favorites/use-cases/is-favorite.use-case';
import { ListWordsDto } from '../dtos/list-words.dto';
import {
  CursorPaginatedWordsDto,
  ErrorResponseDto,
  MessageResponseDto,
} from '@/shared/dtos/cursor-paginated.dto';
import {
  extractAudioUrl,
  rewriteWordAudioUrls,
} from '../utils/word-audio.util';

@ApiTags('dictionary')
@ApiBearerAuth()
@ApiHeader({ name: 'x-cache', description: 'HIT or MISS' })
@ApiHeader({ name: 'x-response-time', description: 'Request duration in ms' })
@ApiHeader({ name: 'x-request-id', description: 'Unique request identifier' })
@UseGuards(JwtAuthGuard)
@Controller('entries/en')
export class DictionaryController {
  constructor(
    private readonly listWordsUseCase: ListWordsUseCase,
    private readonly getWordDetailsUseCase: GetWordDetailsUseCase,
    private readonly favoritesQueueService: FavoritesQueueService,
    private readonly isFavoriteUseCase: IsFavoriteUseCase,
    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
    private readonly addHistoryUseCase: AddHistoryUseCase,
    private readonly freeDictionaryApiService: FreeDictionaryApiService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List dictionary words with cursor pagination' })
  @ApiOkResponse({ type: CursorPaginatedWordsDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async listWords(
    @Query() query: ListWordsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, cached } = await this.listWordsUseCase.execute(query);
    res.setHeader('x-cache', cached ? 'HIT' : 'MISS');
    return data;
  }

  @Get(':word/is-favorite')
  @ApiOperation({ summary: 'Check if word is in user favorites' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { isFavorite: { type: 'boolean', example: true } },
    },
  })
  async checkFavorite(
    @Param('word') word: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const isFavorite = await this.isFavoriteUseCase.execute(user.sub, word);
    return { isFavorite };
  }

  @Get(':word/audio/:index')
  @ApiOperation({ summary: 'Stream word pronunciation audio (proxied)' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async streamAudio(
    @Param('word') word: string,
    @Param('index', ParseIntPipe) index: number,
    @Res() res: Response,
  ) {
    const { data } = await this.getWordDetailsUseCase.execute(word);
    const audioUrl = extractAudioUrl(data, index);

    if (!audioUrl) {
      throw new NotFoundException(`Audio not found for word "${word}"`);
    }

    try {
      const response = await this.freeDictionaryApiService.fetchAudioStream(audioUrl);
      const contentType = response.headers['content-type'];
      res.set(
        'Content-Type',
        typeof contentType === 'string' ? contentType : 'audio/mpeg',
      );
      response.data.pipe(res);
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;
      throw new BadGatewayException('Audio service temporarily unavailable');
    }
  }

  @Get(':word')
  @ApiOperation({ summary: 'Get word details and register in history' })
  @ApiOkResponse({ description: 'Word definition from Free Dictionary API' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async getWord(
    @Param('word') word: string,
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, cached } = await this.getWordDetailsUseCase.execute(word);
    res.setHeader('x-cache', cached ? 'HIT' : 'MISS');
    await this.addHistoryUseCase.execute(user.sub, word);
    return rewriteWordAudioUrls(word, data);
  }

  @Post(':word/favorite')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Add word to favorites (async via BullMQ queue)',
  })
  @ApiAcceptedResponse({
    type: MessageResponseDto,
    description: 'Favorite job enqueued for processing',
  })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async addFavorite(
    @Param('word') word: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.favoritesQueueService.enqueueAddFavorite(user.sub, word);
    return { message: 'Word added to favorites' };
  }

  @Delete(':word/unfavorite')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove word from favorites' })
  @ApiNoContentResponse({ description: 'Word removed from favorites' })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async removeFavorite(
    @Param('word') word: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.removeFavoriteUseCase.execute(user.sub, word);
  }
}
