import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 'Error message' })
  message!: string;
}

export class CursorPaginatedWordsDto {
  @ApiProperty({ example: ['fire', 'firefly', 'fireplace'] })
  results!: string[];

  @ApiProperty({ example: 370099 })
  totalDocs!: number;

  @ApiPropertyOptional({ example: 'eyJpZCI6MTAwfQ==' })
  previous!: string | null;

  @ApiPropertyOptional({ example: 'eyJpZCI6MTMwfQ==' })
  next!: string | null;

  @ApiProperty({ example: true })
  hasNext!: boolean;

  @ApiProperty({ example: false })
  hasPrev!: boolean;
}

export class WordEntryDto {
  @ApiProperty({ example: 'fire' })
  word!: string;

  @ApiProperty({ example: '2024-05-05T19:28:13.531Z' })
  added!: Date;
}

export class CursorPaginatedWordEntriesDto {
  @ApiProperty({ type: [WordEntryDto] })
  results!: WordEntryDto[];

  @ApiProperty({ example: 20 })
  totalDocs!: number;

  @ApiPropertyOptional()
  previous!: string | null;

  @ApiPropertyOptional()
  next!: string | null;

  @ApiProperty()
  hasNext!: boolean;

  @ApiProperty()
  hasPrev!: boolean;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Word added to favorites' })
  message!: string;
}
