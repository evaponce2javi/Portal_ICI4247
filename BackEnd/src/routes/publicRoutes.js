const express = require('express');
const router = express.Router();
const { 
    obtenerDepartamentos, 
    obtenerPresupuestos, 
    obtenerContratos 
} = require('../controllers/publicController');

router.get('/departamentos', obtenerDepartamentos);
router.get('/presupuestos', obtenerPresupuestos);
router.get('/contratos', obtenerContratos);

module.exports = router;