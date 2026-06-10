import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export const MAX_SCRIPT_TITLE_LENGTH = 50;
export const MAX_SCRIPT_CONTENT_LENGTH = 10_000;

export class UpsertScriptDto {
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_SCRIPT_TITLE_LENGTH)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(MAX_SCRIPT_CONTENT_LENGTH)
  content!: string;

  @IsOptional()
  @IsString()
  matchMode?: string;
}
