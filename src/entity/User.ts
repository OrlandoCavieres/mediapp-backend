import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinTable } from "typeorm"
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from "class-validator"
import { UserType } from "./UserType";
import { Professional } from "./Professional"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 200, nullable: true })
    @IsOptional()
    @MaxLength(200)
    name: string

    @Column({ length: 100, nullable: true })
    @IsOptional()
    @MaxLength(100)
    city: string

    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Column()
    @IsNotEmpty()
    password: string

    @ManyToOne(() => UserType, { eager: true })
    @JoinTable()
    user_type: UserType

    @ManyToOne(() => Professional, { eager: true })
    @JoinTable()
    assignedProfessional: Professional
}
