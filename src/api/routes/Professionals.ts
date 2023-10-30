import { Router } from 'express'
import { authToken } from "../../middlewares/AuthToken"
import { isAdmin } from "../../middlewares/IsAdmin";
import ProfessionalService from "../../services/ProfessionalService";


const router = Router()

router.route('/')
    .all(authToken, isAdmin)
    .get(async (req, res) => {
        await new ProfessionalService({}).list(req, res)
    })
    .post(async (req, res) => {
        await new ProfessionalService({ action: 'create' }).decide(req, res)
    })

router.route('/:id')
    .all(authToken, isAdmin)
    .get(async (req, res) => {
        await new ProfessionalService({ objectId: Number(req.params.id), action: 'get' })
            .decide(req, res)
    })
    .delete(async (req, res) => {
        await new ProfessionalService({ objectId: Number(req.params.id), action: 'delete' })
            .decide(req, res)
    })
    .put(async (req, res) => {
        await new ProfessionalService({ objectId: Number(req.params.id), action: 'update' })
            .decide(req, res)
    })


const ProfessionalsRouter = Router()

ProfessionalsRouter.use('/professionals', router)


export default ProfessionalsRouter
