import { ApiServiceConstructor } from "./AuxiliarTypes"
import { isNotEmpty } from "class-validator"


export default class ApiService {
    protected manager = null
    protected readonly objectId: number = null
    protected readonly action: string = null
    protected modelName: string = 'Model'

    protected element = null
    protected updateElement = null

    constructor({ objectId, action }: ApiServiceConstructor) {
        this.objectId = objectId
        this.action = action
    }

    list = async (req, res) => {
        const all = await this.manager.find()

        res.status(200).json({
            success: true,
            list: all
        })
    }

    decide = async (req, res) => {
        if (this.action === 'create') {
            return this.validateData(req, res)
        }

        if (isNotEmpty(this.objectId)) {
            this.element = await this.manager.findOneBy({ id: this.objectId })

            if (isNotEmpty(this.element)) {
                if (this.action === 'get') return this.singleObject(req, res)
                else if (this.action === 'delete') return this.delete(req, res)
                else if (this.action === 'update') return this.validateData(req, res)
            }
            return res.sendStatus(404)
        }

        return res.sendStatus(400)
    }

    validateData = async (req, res) => {
        return res.sendStatus(400)
    }

    singleObject = async (req, res) => {
        return res.status(200).json({
            success: true,
            element: this.element
        })
    }

    create = async (req, res) => {}

    update = async (req, res) => {}

    delete = async (req, res) => {
        await this.manager.delete(this.element)

        return res.status(200).json({
            message: `${this.modelName} eliminado con éxito`,
            success: true
        })
    }
}
