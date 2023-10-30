import { Router } from 'express'
import Authentication from "./routes/Authentication"
import Questions from "./routes/Questions"
import ProfessionalsRouter from "./routes/Professionals"
import AssignProfessional from "./routes/AssignProfessional";


const router = Router()

router.use('/api', Authentication)
router.use('/api', Questions)
router.use('/api', ProfessionalsRouter)
router.use('/api', AssignProfessional)


export default router
