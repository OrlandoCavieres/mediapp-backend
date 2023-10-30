import { Router } from 'express'
import UserService from "../../services/UserService";
import { authToken } from "../../middlewares/AuthToken";


const router = Router()

router.post('/login', async(req, res) => {
    await new UserService().login(req, res)
})

router.post('/register', async (req, res) => {
    await new UserService().register(req, res)
})

router.post('/patient/onboard', authToken,
    async (req, res) => {
    await new UserService().patientOnboard(req, res)
})


const authRouter = Router()

authRouter.use('/auth', router)

export default authRouter
