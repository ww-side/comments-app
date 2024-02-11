import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { GetAllCommentsDto } from './dto/get-all-comments.dto';
import { SaveCommentDto } from './dto/save-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async saveComment(comment: SaveCommentDto): Promise<CommentEntity> {
    const { parent_id } = comment;

    const existingComment = await this.commentRepository.findOne({
      where: { id: parent_id },
    });

    if (!existingComment && parent_id !== null) {
      throw new NotFoundException(`Comment doesn't exist`);
    }

    const savedComment = await this.commentRepository.save(comment);
    return this.commentRepository.findOne({ where: { id: savedComment.id } });
  }

  async getAllComments(): Promise<GetAllCommentsDto[]> {
    const allComments = await this.commentRepository.find();

    const commentDictionary = {};
    allComments.forEach((comment) => {
      commentDictionary[comment.id] = { ...comment, replies: [] };
    });

    const commentsHierarchy = [];
    allComments.forEach((comment) => {
      if (comment.parent_id === null) {
        commentsHierarchy.push(commentDictionary[comment.id]);
      } else if (commentDictionary[comment.parent_id]) {
        commentDictionary[comment.parent_id].replies.push(
          commentDictionary[comment.id],
        );
      }
    });

    return commentsHierarchy;
  }
}
