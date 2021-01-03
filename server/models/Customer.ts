import { Column, PrimaryGeneratedColumn, Entity, UpdateDateColumn, CreateDateColumn, PrimaryColumn, Generated } from 'typeorm';


@Entity({ name: 'customer' })
export class Customer {
  @PrimaryColumn({ type: 'integer' })
	id?: number;
	@Column({ type:'varchar' })
	lineId?: string;
	@Column({ type:'varchar' })
	phoneNo?: string;
	@Column({ type:'varchar' })
	email?: string;
	@Column({ type:'varchar' })
	name?: string;
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}