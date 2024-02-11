import { IsNotEmpty } from 'class-validator';
import { CommentEntity } from '../entities/comment.entity';

export class GetAllCommentsDto {
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly parent_id: string | null;

  @IsNotEmpty()
  readonly user_id: string;

  @IsNotEmpty()
  readonly content: string;

  @IsNotEmpty()
  readonly created_at: Date;

  @IsNotEmpty()
  readonly replies: CommentEntity[];
}
