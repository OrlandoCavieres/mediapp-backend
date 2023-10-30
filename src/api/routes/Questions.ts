import { Router } from 'express'
import { authToken } from "../../middlewares/AuthToken"
import { isAdmin } from "../../middlewares/IsAdmin";
import QuestionService from "../../services/QuestionService";


const router = Router()

router.route('/')
    .all(authToken)
    .get(async (req, res) => {
        await new QuestionService({}).list(req, res)
    })
    .post(isAdmin, async (req, res) => {
        await new QuestionService({ action: 'create' }).decide(req, res)
    })

router.route('/:id')
    .all(authToken, isAdmin)
    .get(async (req, res) => {
        await new QuestionService({ objectId: Number(req.params.id), action: 'get' }).decide(req, res)
    })
    .delete(async (req, res) => {
        await new QuestionService({ objectId: Number(req.params.id), action: 'delete' }).decide(req, res)
    })
    .put(async (req, res) => {
        await new QuestionService({ objectId: Number(req.params.id), action: 'update' }).decide(req, res)
    })


const questionsRouter = Router()

questionsRouter.use('/questions', router)


export default questionsRouter
