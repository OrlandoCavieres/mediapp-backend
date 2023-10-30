import * as jwt from 'jsonwebtoken'
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"

export const authToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']

    if (typeof authHeader !== 'undefined') {
        const tokenParts = authHeader.split(' ')
        const token = tokenParts[1]

        jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
            if (err) { res.sendStatus(401) }
            else {
                req.user = await AppDataSource.getRepository(User).findOneBy({ id: payload['id'] })
                next()
            }
        })
    }
    else { res.sendStatus(401) }
}
