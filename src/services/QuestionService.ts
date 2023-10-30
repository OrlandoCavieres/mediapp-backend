import { AppDataSource } from "../data-source"
import { ApiServiceConstructor } from "./AuxiliarTypes"
import ApiService from "./ApiService"
import { Question } from "../entity/Question"
import { isEmpty, isNotEmpty, validate } from "class-validator";
import { translateError } from "../locale/validations";
import { QuestionAlternative } from "../entity/QuestionAlternative";


function shuffle(array: QuestionAlternative[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


export default class QuestionService extends ApiService {
    protected errors = {}
    protected altManager = AppDataSource.getRepository(QuestionAlternative)
    protected relatedObjects = []

    constructor({ objectId, action }: ApiServiceConstructor) {
        super({objectId, action})

        this.manager = AppDataSource.getRepository(Question)
        this.modelName = 'Pregunta'
    }

    list = async (req, res) => {
        let all: Question[] = await this.manager.find({ order: { statement: 'ASC' } })

        if (req.user.user_type.name === 'Paciente') {
            all = all.map(question => {
                question.alternatives = shuffle(question.alternatives)
                return question
            })
        }

        res.status(200).json({
            success: true,
            list: all
        })
    }

    validateData = async (req, res) => {
        const questionObject = this.manager.create({ statement: req.body.statement })
        const questionValidation = await validate(questionObject)
        const alternativesObjects = []

        if (questionValidation.length > 0) {
            questionValidation.forEach(val => {
                this.errors[val.property] = translateError(val)
            })
        }

        if (isEmpty(req.body.alternatives)) {
            this.errors['withoutAlternatives'] = ['La solicitud no tiene un apartado de alternativas']
        }

        if (req.body.alternatives) {
            const alts = req.body.alternatives

            if (alts.length !== 3) {
                this.errors['alternativesNumber'] = ['Una pregunta debe tener 3 alternativas']
            }
            else {
                for (let i = 0; i < alts.length; i++) {
                    const alter = alts[i]

                    const alternativeObject = this.altManager.create({
                        sentence: alter.sentence, answerWeight: Number(alter.weight)
                    })
                    const alternativeVal = await validate(alternativeObject)

                    if (alternativeVal.length > 0) {
                        this.errors[`alternative-${i + 1}`] = ['La alternativa dada presenta problemas en sus valores']
                    }
                    alternativesObjects.push(alternativeObject)
                }

                const sentences = alts.map(alt => alt.sentence)
                    .filter(alt => isNotEmpty(alt)).map(alt => alt.toLowerCase())
                const weights = alts.map(alt => Number(alt.weight))
                    .filter(alt => !isNaN(alt))

                const sentencesUnique = new Set(sentences)
                const weightsUnique = new Set(weights)

                if (sentencesUnique.size !== 3) {
                    this.errors['alternativesSentences'] = ['Los valores de texto de cada alternativa deben ser distintos']
                }
                if (weightsUnique.size !== 3) {
                    this.errors['alternativesWeights'] = ['Los valores de peso de respuesta de cada alternativa deben ser distintos']
                }
            }
        }

        if (Object.keys(this.errors).length > 0) {
            return res.status(200).json({
                errors: this.errors,
                success: false
            })
        }

        if (this.action === 'create') {
            this.element = questionObject
            this.relatedObjects = alternativesObjects
            return this.create(req, res)
        }

        if (this.action === 'update') {
            this.updateElement = questionObject
            this.relatedObjects = alternativesObjects
            return this.update(req, res)
        }
    }

    create = async (req, res) => {
        for (const relatedObject of this.relatedObjects) {
            await this.altManager.save(relatedObject)
        }
        this.element.alternatives = this.relatedObjects
        await this.manager.save(this.element)

        return res.status(200).json({
            message: `${this.modelName} creado con éxito`,
            success: true
        })
    }

    update = async (req, res) => {
        this.element.statement = this.updateElement.statement

        for (const alternative of this.element.alternatives) {
            const searchNewAlter = this.relatedObjects.filter(relObj => relObj.answerWeight === alternative.answerWeight)[0]
            alternative.sentence = searchNewAlter.sentence
            await this.altManager.save(alternative)
        }
        await this.manager.save(this.element)

        res.status(200).json({
            message: `${this.modelName} actualizado con éxito`,
            success: true
        })
    }

    delete = async (req, res) => {
        for (let i = 0; i < this.element.alternatives.length; i++) {
            await this.altManager.delete(this.element.alternatives[i])
        }

        await AppDataSource.createQueryBuilder()
            .delete()
            .from(Question)
            .where('id = :id', { id: this.element.id })
            .execute()

        return res.status(200).json({
            message: `${this.modelName} eliminado con éxito`,
            success: true
        })
    }
}
