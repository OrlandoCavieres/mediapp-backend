import { Router } from 'express'
import { authToken } from "../../middlewares/AuthToken"
import { isEmpty, isNotEmpty } from "class-validator"
import { AppDataSource } from "../../data-source"
import { Professional } from "../../entity/Professional"
import { Question } from "../../entity/Question"
import { User } from "../../entity/User"
import { isAdmin } from "../../middlewares/IsAdmin";


type ResultDiagnostic = {
    total: number
}


const router = Router()

router.post('/result-diagnostic', authToken,
    async (req, res) => {
        const result: ResultDiagnostic = { total: req.body.total }
        const user: User = req['user']

        if (user.user_type.name === 'Administrador') {
            return res.status(400).json({
                error: 'Acción no permitida para un administrador',
                success: false
            })
        }

        if (isNotEmpty(user.assignedProfessional)) {
            return res.status(400).json({
                error: 'Paciente ya tiene asociado a un profesional',
                success: false
            })
        }

        if (isEmpty(result.total)) {
            return res.status(400).json({
                error: 'El resultado no se encuentra en la solicitud',
                success: false
            })
        }

        const maxScore = await AppDataSource.getRepository(Question).count() * 3
        const [profs, profsCount] = await AppDataSource.getRepository(Professional).findAndCount()
        const indexCut = Math.ceil(maxScore / profsCount)
        const indexes = profs.map((value, index) => index * indexCut)

        let profSelected: Professional = null

        for (let i = 0; i < indexes.length - 1; i++) {
            if (result.total >= indexes[i] && result.total < indexes[i + 1]) {
                profSelected = profs[i]
            }
        }
        if (profSelected === null) profSelected = profs.slice(-1)[0]

        user.assignedProfessional = profSelected
        await AppDataSource.getRepository(User).save(user)

        res.status(200).json({
            message: 'Paciente asociado con éxito a un profesional',
            assignedProfessional: profSelected,
            success: true
        })
})

router.get('/patient-assigns', authToken, isAdmin,
    async (req, res) => {
        const users = await AppDataSource.getRepository(User).find({
            select: { id: true, email: true, name: true,
                assignedProfessional: { id: true, name: true, specialty: true } },
            order: { name: 'ASC' },
            where: { user_type: { name: 'Paciente' }}
        })

        res.status(200).json({
            list: users,
            success: true
        })
    })

export default router
