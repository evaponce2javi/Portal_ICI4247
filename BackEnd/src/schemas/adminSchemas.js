const { z } = require('zod');

const crearDepartamentoSchema = z.object({
    body: z.object({
        nombre: z.string({ required_error: "El nombre es obligatorio" })
                 .min(3, "El nombre debe tener al menos 3 caracteres"),
        descripcion: z.string().optional()
    })
});

const crearContratoSchema = z.object({
    body: z.object({
        titulo: z.string({ required_error: "El título es obligatorio" }),
        proveedor: z.string({ required_error: "El proveedor es obligatorio" }),
        monto: z.number({ required_error: "El monto es obligatorio", invalid_type_error: "El monto debe ser numérico" })
                .positive("El monto debe ser mayor a 0"),
        fechaInicio: z.string().datetime({ message: "Formato de fecha inválido. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)" }),
        departamentoId: z.number().int().positive()
    })
});

const idParamSchema = z.object({
    params: z.object({
        id: z.coerce.number().int().positive("El ID debe ser un número entero positivo")
    })
});

module.exports = { crearDepartamentoSchema, crearContratoSchema, idParamSchema };