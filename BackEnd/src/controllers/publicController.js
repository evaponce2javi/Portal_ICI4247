const prisma = require('../config/db');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const obtenerDepartamentos = async (req, res) => {
    try {
        const departamentos = await prisma.departamento.findMany();
        return sendSuccess(res, 200, departamentos);
    } catch (error) {
        return sendError(res, 500, 'Error al obtener departamentos');
    }
};

const obtenerPresupuestos = async (req, res) => {
    try {
        const presupuestos = await prisma.presupuesto.findMany({ include: { departamento: true } });
        return sendSuccess(res, 200, presupuestos);
    } catch (error) {
        return sendError(res, 500, 'Error al obtener presupuestos');
    }
};


const obtenerContratos = async (req, res) => {
    try {
        const contratos = await prisma.contrato.findMany({ include: { departamento: true } });
        return sendSuccess(res, 200, contratos);
    } catch (error) {
        return sendError(res, 500, 'Error al obtener contratos');
    }
};

module.exports = { obtenerDepartamentos, obtenerPresupuestos, obtenerContratos };