import { AppDataSource } from "../data-source"
import { Professional } from "../entity/Professional"
import { isEmpty, validate } from "class-validator"
import { translateError } from "../locale/validations"
import { ApiServiceConstructor } from "./AuxiliarTypes"
import ApiService from "./ApiService"


export default class ProfessionalService extends ApiService {
    constructor({ objectId, action }: ApiServiceConstructor) {
        super({objectId, action})

        this.manager = AppDataSource.getRepository(Professional)
        this.modelName = 'Profesional'
    }

    validateData = async (req, res) => {
        if (this.action === 'update') {
            if (isEmpty(req.body.name)) {
                req.body.name = this.element.name
            }
            if (isEmpty(req.body.specialty)) {
                req.body.specialty = this.element.specialty
            }
        }

        const valObject = this.manager.create({
            name: req.body.name,
            specialty: req.body.specialty
        })

        const validation = await validate(valObject)

        if (validation.length > 0) {
            const mapErrors = {}

            validation.forEach(val => {
                mapErrors[val.property] = translateError(val)
            })

            return res.status(200).json({
                errors: mapErrors,
                success: false,
            })
        }

        if (this.action === 'create') {
            this.element = valObject
            return this.create(req, res)
        }
        else if (this.action === 'update') {
            this.updateElement = valObject
            return this.update(req, res)
        }
    }

    create = async (req, res) => {
        const alreadyExists = await this.manager.findOneBy({
            name: this.element.name, specialty: this.element.specialty
        })

        if (alreadyExists) {
            return res.status(200).json({
                errors: { 'general': ['Combinación nombre-especialidad ya existe'] },
                success: false
            })
        }

        await this.manager.save(this.element)

        return res.status(200).json({
            message: 'Profesional creado con éxito',
            success: true,
        })
    }

    update = async (req, res) => {
        const alreadyExists = await this.manager.findOneBy({
            name: this.updateElement.name, specialty: this.updateElement.specialty
        })

        if (alreadyExists && alreadyExists.id !== this.element.id) {
            return res.status(200).json({
                errors: { 'general': ['Combinación nombre-especialidad ya existe'] },
                success: false
            })
        }

        this.element.name = this.updateElement.name
        this.element.specialty = this.updateElement.specialty
        await this.manager.save(this.element)

        return res.status(200).json({
            message: 'Profesional actualizado con éxito',
            success: true,
        })
    }
}
