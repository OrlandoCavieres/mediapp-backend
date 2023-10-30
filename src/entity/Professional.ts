import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"
import { IsNotEmpty, MaxLength } from "class-validator"

@Entity()
@Index(['name', 'specialty'], { unique: true })
export class Professional {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 200 })
    @IsNotEmpty()
    @MaxLength(200)
    name: string

    @Column({ length: 60 })
    @IsNotEmpty()
    @MaxLength(60)
    specialty: string
}
