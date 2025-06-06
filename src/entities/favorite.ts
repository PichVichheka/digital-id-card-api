import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';

@Entity()
@Unique([
  'user',
  // 'favoriteUser'
])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id?: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user?: User;

  // @ManyToOne(() => User, (user) => user.favoritedBy, { onDelete: 'CASCADE' })
  // favoriteUser?: User;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
