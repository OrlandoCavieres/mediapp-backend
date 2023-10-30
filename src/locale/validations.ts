import { ValidationError } from "class-validator";

export const translateError = (error: ValidationError) => {
    const fields = {
        password: 'Contraseña',
        email: 'Correo electrónico',
        name: 'Nombre',
        city: 'Ciudad',
        specialty: 'Especialidad',
        statement: 'Enunciado'
    }

    const field = fields[error.property]

    const lengths = {
        'Nombre': 200,
        'Especialidad': 60,
        'Ciudad': 100
    }

    const validationMessages = {
        isNotEmpty: `${field} es un campo obligatorio`,
        isEmail: `${field} no tiene formato correcto`,
        maxLength: `${field} debe tener ${lengths[field]} o menos caracteres`
    }

    return Object.keys(error.constraints).map(error => validationMessages[error])
}
