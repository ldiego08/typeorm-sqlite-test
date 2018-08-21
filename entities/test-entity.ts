import { IsNotEmpty, Length } from "class-validator";

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("test_entity")
export class MarketplaceListing {
  @PrimaryGeneratedColumn({ name: "id" })
  public id: number;

  @IsNotEmpty()
  @Length(0, 150)
  @Column({ name: "name" })
  public name: string;

  @IsNotEmpty()
  @CreateDateColumn({ name: "create_time" })
  public createdAt: Date;
}
