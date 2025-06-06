import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { IdCard } from './id-card';
import { SocialLink } from './social-link';
import { Favorite } from './favorite';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  full_name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  avatar?: string;

  @CreateDateColumn()
  created_at?: Date;

  @CreateDateColumn()
  updated_at?: Date;

  @OneToOne(() => IdCard, (idCard) => idCard.user, { cascade: true })
  idCard?: IdCard;

  @OneToMany(() => SocialLink, (link) => link.user)
  socialLinks?: SocialLink[];

  @OneToMany(() => Favorite, (fav) => fav.user)
  favorites?: Favorite[];

  // @OneToMany(() => Favorite, (fav) => fav.favoriteUser)
  // favoritedBy?: Favorite[];
}
