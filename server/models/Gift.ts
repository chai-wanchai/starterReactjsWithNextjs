import { Column, PrimaryGeneratedColumn, Entity, UpdateDateColumn, CreateDateColumn, PrimaryColumn, Generated } from 'typeorm';


@Entity({ name: 'gift' })
export class Gift {
  @PrimaryColumn({ type: 'varchar' })
	code?: string;
	@Column({ type:'text' })
	description?: string;
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}