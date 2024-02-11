import { IsNotEmpty } from 'class-validator';

export class SaveCommentDto {
  @IsNotEmpty()
  readonly parent_id: number | null;

  @IsNotEmpty()
  readonly user_id: number;

  @IsNotEmpty()
  readonly content: string;
}
