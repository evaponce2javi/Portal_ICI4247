const express = require('express');
const router = express.Router();
const protegerRuta = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
const adminController = require('../controllers/adminController');

const validateSchema = require('../middlewares/validateMiddleware');
const { crearDepartamentoSchema, crearContratoSchema, idParamSchema } = require('../schemas/adminSchemas');

router.use(protegerRuta);
router.use(verificarAdmin);

router.post('/departamentos', adminController.crearDepartamento);
router.put('/departamentos/:id', adminController.actualizarDepartamento);
router.post('/presupuestos', adminController.crearPresupuesto);
router.put('/presupuestos/:id', adminController.actualizarPresupuesto);
router.post('/contratos', adminController.crearContrato);
router.put('/contratos/:id', adminController.actualizarContrato);
router.delete('/contratos/:id', adminController.eliminarContrato);

module.exports = router;