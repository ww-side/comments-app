import { IsNotEmpty } from 'class-validator';

export class SaveCommentDto {
  @IsNotEmpty()
  readonly parent_id: string | null;

  @IsNotEmpty()
  readonly user_id: string;

  @IsNotEmpty()
  readonly content: string;
}
