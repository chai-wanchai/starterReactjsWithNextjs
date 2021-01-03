import { Column, PrimaryGeneratedColumn, Entity, UpdateDateColumn, CreateDateColumn, PrimaryColumn, Generated } from 'typeorm';


@Entity({ name: 'access_app' })
export class AccessApp {
  @PrimaryColumn({ type: 'uuid' })
  @Generated("uuid")
  access_id?: string;
  @Column({ type:'varchar' })
  giftCode?: string;
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}