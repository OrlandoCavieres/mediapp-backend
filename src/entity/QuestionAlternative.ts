import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm"
import { Question } from "./Question";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

@Entity()
@Index(['question', 'answerWeight'], { unique: true })
export class QuestionAlternative {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 350 })
    @IsNotEmpty()
    sentence: string

    @Column()
    @IsInt()
    @Min(1)
    @Max(3)
    answerWeight: number

    @ManyToOne(() => Question, (question) => question.alternatives)
    question: Question
}
