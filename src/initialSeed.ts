import { AppDataSource } from "./data-source"
import { UserType } from "./entity/UserType"
import { User } from "./entity/User"
import * as bcrypt from "bcrypt";

export const initialSeed = async () => {
    const userTypes = ['Administrador', 'Paciente']

    for (const userType of userTypes) {
        const typeRepository = AppDataSource.getRepository(UserType)
        const typeExists = await typeRepository.findOneBy({ name: userType })

        if (!typeExists) {
            const newType = typeRepository.create({ name: userType })
            await typeRepository.save(newType)
        }
    }

    const userRepository = AppDataSource.getRepository(User)
    const superAdminExists = await userRepository.findOneBy({ email: 'admin@admin.com' })

    if (!superAdminExists) {
        const admin = userRepository.create({ email: 'admin@admin.com' })
        admin.password = await bcrypt.hash('pass', 10)
        admin.user_type = await AppDataSource.getRepository(UserType).findOneBy({ name: 'Administrador' })
        await userRepository.save(admin)
    }
}
