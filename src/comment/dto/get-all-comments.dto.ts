import { IsNotEmpty } from 'class-validator';
import { CommentEntity } from '../entities/comment.entity';

export class GetAllCommentsDto {
  @IsNotEmpty()
  readonly id: number;

  @IsNotEmpty()
  readonly parent_id: number | null;

  @IsNotEmpty()
  readonly user_id: number;

  @IsNotEmpty()
  readonly content: string;

  @IsNotEmpty()
  readonly created_at: Date;

  @IsNotEmpty()
  readonly replies: CommentEntity[];
}
