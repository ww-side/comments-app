import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text', nullable: true })
  parent_id: string;

  @Column({ type: 'text' })
  user_id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
