import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ListWordsDto {
  @ApiPropertyOptional({ description: 'Search filter (prefix match)', example: 'fire' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Number of results per page', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Cursor for pagination (base64 encoded)' })
  @IsOptional()
  @IsString()
  cursor?: string;
}

export class CursorPaginatedWordsDto {
  results!: string[];
  totalDocs!: number;
  previous!: string | null;
  next!: string | null;
  hasNext!: boolean;
  hasPrev!: boolean;
}
