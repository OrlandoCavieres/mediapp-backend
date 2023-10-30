import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { isNotEmpty, validate } from "class-validator"
import { translateError } from "../locale/validations"
import { UserType } from "../entity/UserType"

export default class UserService {
    private manager = AppDataSource.getRepository(User)
    private newUser = null
    private errorResponse = null

    login = async (req, res) => {
        await this.validateAuth(req)

        if (this.errorResponse) {
            return res.status(200).json(this.errorResponse)
        }

        const user = await this.manager.findOneBy({ email: req.body.email })

        if (user) {
            const passwordCorrect = await bcrypt.compare(req.body.password, user.password)

            if (passwordCorrect) {
                const token = jwt.sign({ email: user.email, id: user.id }, process.env.SECRET_KEY)
                delete user['password']

                return res.status(200).json({
                    success: true, token, user
                })
            }

            return res.status(200).json({ errors: { password: ['Contraseña incorrecta'] }, success: false })
        }

        return res.status(200).json({ errors: { email: ['Email no encontrado'] }, success: false })
    }

    patientOnboard = async (req, res) => {
        const body = req.body
        const hasName = isNotEmpty(body.name)
        const hasCity = isNotEmpty(body.city)

        if (hasName && hasCity) {
            const user = req.user
            user.name = body.name
            user.city = body.city

            const validation = await validate(user)

            if (validation.length > 0) {
                const mapErrors = {}

                validation.forEach(val => {
                    mapErrors[val.property] = translateError(val)
                })

                return res.status(400).json({
                    errors: mapErrors,
                    success: false
                })
            }

            await this.manager.save(user)

            return res.status(200).json({
                message: 'Identificación completada con éxito',
                success: true
            })
        }

        const errors = {}
        if (!hasName) errors['name'] = ['Nombre es campo requerido']
        if (!hasCity) errors['city'] = ['Ciudad es campo requerido']

        return res.status(400).json({
            errors, success: false
        })
    }

    register = async (req, res) => {
        const body = req.body
        await this.validateAuth(req)

        if (this.errorResponse) {
            return res.status().json(this.errorResponse)
        }

        const emailExists = await this.manager.findOneBy({ email: body.email })

        if (emailExists) {
            return res.status(400).json({
                errors: { email: ['Correo ya se encuentra ocupado'] },
                success: false
            })
        }

        this.newUser.password = await bcrypt.hash(body.password, 10)
        await this.manager.save(this.newUser)

        const token = jwt.sign({ email: this.newUser.email, id: this.newUser.id }, process.env.SECRET_KEY)

        delete this.newUser['password']

        return res.status(200).json({
            message: 'Usuario creado con éxito',
            success: true,
            token,
            user: this.newUser
        })
    }

    private validateAuth = async (req) => {
        this.newUser = this.manager.create({ email: req.body.email, password: req.body.password })
        this.newUser.user_type = await AppDataSource.getRepository(UserType).findOneBy({ id: 2 })
        const validation = await validate(this.newUser)

        if (validation.length > 0) {
            const mapErrors = {}

            validation.forEach(val => {
                mapErrors[val.property] = translateError(val)
            })

            this.errorResponse = {
                errors: mapErrors,
                success: false,
            }
        }
    }
}
