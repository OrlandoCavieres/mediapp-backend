import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable } from "typeorm"
import { QuestionAlternative } from "./QuestionAlternative";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'text' })
    @IsNotEmpty()
    statement: string

    @OneToMany(() => QuestionAlternative,
        (alternative) => alternative.question, { eager: true, cascade: true })
    @JoinTable()
    alternatives: QuestionAlternative[]
}
