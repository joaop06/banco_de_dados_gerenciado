import {
    Column,
    Entity,
    Unique,
    CreateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity('produto')
@Unique(['descricao', 'criado_por'])
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, nullable: false })
    descricao: string;

    @Column({ length: 10, nullable: false })
    categoria: string;

    @Column('decimal', { precision: 15, scale: 2, nullable: false })
    valor: number;

    @CreateDateColumn({ name: 'criado_em', type: 'datetime' })
    criado_em: Date;

    @Column({ length: 20 })
    criado_por: string;
}
