import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn
} from 'typeorm';

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: "name", length: 100, nullable: false })
    Name: string;

    @Column({ name: "qty", nullable: false })
    Qty: number;

    @Column({ name: "price", nullable: false })
    Price: number;

    @Column({ name: "description", nullable: false })
    Description: string;

    @Column({ name: "production_date", nullable: false })
    ProductionDate: Date;

    @CreateDateColumn({ name: "created_at", nullable: false })
    CreatedAt: Date;

    @UpdateDateColumn({ name: "updated_at", nullable: true })
    UpdatedAt: Date;
}
