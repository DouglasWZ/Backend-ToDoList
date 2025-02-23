const {Router} = require('express');
const {agregarTarea, obtenerTarea} = require('../controllers/tareaController')
const checkAuth = require('../middleware/auth')

const router = Router();

// Rutas Privadas
router.post('/',checkAuth, agregarTarea)
router.get('/', obtenerTarea)

module.exports = router;