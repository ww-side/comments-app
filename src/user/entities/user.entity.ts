import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  email: string;
}
