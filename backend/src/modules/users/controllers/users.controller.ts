import {
  Controller,
  Get,
  Query,
  UseGuards,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '@/shared/decorators/current-user.decorator';
import {
  IUsersRepository,
  USERS_REPOSITORY,
} from '../repositories/users.repository.interface';
import { UserResponseDto } from '../dtos/user-response.dto';
import { ListHistoryUseCase } from '@/modules/history/use-cases/list-history.use-case';
import { ListFavoritesUseCase } from '@/modules/favorites/use-cases/list-favorites.use-case';
import {
  CursorPaginatedWordEntriesDto,
  ErrorResponseDto,
} from '@/shared/dtos/cursor-paginated.dto';
import { PaginationQueryDto } from '@/shared/dtos/pagination-query.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly listHistoryUseCase: ListHistoryUseCase,
    private readonly listFavoritesUseCase: ListFavoritesUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async getProfile(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    const found = await this.usersRepository.findById(user.sub);
    if (!found) throw new NotFoundException('User not found');
    return found.toResponse() as UserResponseDto;
  }

  @Get('me/history')
  @ApiOperation({ summary: 'Get user word history with cursor pagination' })
  @ApiOkResponse({ type: CursorPaginatedWordEntriesDto })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async getHistory(
    @CurrentUser() user: JwtPayload,
    @Query() query: PaginationQueryDto,
  ) {
    return this.listHistoryUseCase.execute({
      userId: user.sub,
      limit: query.limit ?? 20,
      cursor: query.cursor,
    });
  }

  @Get('me/favorites')
  @ApiOperation({ summary: 'Get user favorites with cursor pagination' })
  @ApiOkResponse({ type: CursorPaginatedWordEntriesDto })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async getFavorites(
    @CurrentUser() user: JwtPayload,
    @Query() query: PaginationQueryDto,
  ) {
    return this.listFavoritesUseCase.execute({
      userId: user.sub,
      limit: query.limit ?? 20,
      cursor: query.cursor,
    });
  }
}
