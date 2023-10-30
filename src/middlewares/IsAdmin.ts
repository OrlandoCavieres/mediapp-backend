export const isAdmin = async (req, res, next) => {
    if (req.user) {
        const userType = req.user.user_type
        if (userType && userType.name === 'Administrador') {
            next()
        }
        else { res.sendStatus(403) }
    }
    else { res.sendStatus(401) }
}
