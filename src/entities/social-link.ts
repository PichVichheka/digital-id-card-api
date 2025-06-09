import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user';

@Entity()
export class SocialLink {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.socialLinks, { onDelete: 'CASCADE' })
  user?: User;

  @Column()
  platform?: string; // e.g., Twitter, GitHub, LinkedIn

  @Column()
  url?: string;

  @Column({ default: false })
  is_deleted?: boolean;

  @UpdateDateColumn()
  updated_at?: Date;

  @CreateDateColumn()
  created_at?: Date;
}
