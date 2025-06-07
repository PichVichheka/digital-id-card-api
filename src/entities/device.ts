// src/entities/device.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DeviceType } from '@/enum';
import { User } from './user';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  device_name?: string;

  @Column()
  device_type?: string;

  @Column({ type: 'varchar', nullable: true })
  ip_address?: string;

  @Column()
  browser?: string;

  @Column()
  os?: string;

  @CreateDateColumn()
  logged_in_at?: Date;

  @ManyToOne(() => User, (user) => user.devices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @CreateDateColumn()
  created_at?: Date;
}
