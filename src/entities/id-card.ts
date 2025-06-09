import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user';
import { Gender } from '@/enum';

@Entity()
export class IdCard {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.idCard)
  @JoinColumn()
  user?: User;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender?: string;

  @Column()
  dob?: Date;

  @Column()
  address?: string;

  @Column()
  qr_url?: string;

  @Column({ default: false })
  is_deleted?: boolean;

  @Column()
  theme_color?: string;

  @UpdateDateColumn()
  updated_at?: Date;

  @CreateDateColumn()
  created_at?: Date;
}
