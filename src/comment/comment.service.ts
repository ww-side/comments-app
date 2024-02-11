import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async saveComment(comment: CommentEntity): Promise<CommentEntity> {
    const { parent_id } = comment;

    const existingComment = await this.commentRepository.findOne({
      where: { id: parent_id },
    });

    if (!existingComment) {
      throw new NotFoundException(`Comment doesn't exist`);
    }

    const savedComment = await this.commentRepository.save(comment);
    return this.commentRepository.findOne({ where: { id: savedComment.id } });
  }

  async getAllComments(): Promise<CommentEntity[]> {
    return this.commentRepository.find();
  }
}
