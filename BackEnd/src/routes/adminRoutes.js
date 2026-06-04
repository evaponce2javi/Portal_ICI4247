const express = require('express');
const router = express.Router();
const protegerRuta = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
const adminController = require('../controllers/adminController');

const validateSchema = require('../middlewares/validateMiddleware');
const { crearDepartamentoSchema, crearContratoSchema, idParamSchema } = require('../schemas/adminSchemas');

router.use(protegerRuta);
router.use(verificarAdmin);

router.post('/departamentos', validateSchema(crearDepartamentoSchema), adminController.crearDepartamento);
router.put('/departamentos/:id', validateSchema(idParamSchema), adminController.actualizarDepartamento);
router.post('/presupuestos', adminController.crearPresupuesto);
router.put('/presupuestos/:id', validateSchema(idParamSchema), adminController.actualizarPresupuesto);
router.post('/contratos', validateSchema(crearContratoSchema), adminController.crearContrato);
router.put('/contratos/:id', validateSchema(idParamSchema), adminController.actualizarContrato);
router.delete('/contratos/:id', validateSchema(idParamSchema), adminController.eliminarContrato);

module.exports = router;
