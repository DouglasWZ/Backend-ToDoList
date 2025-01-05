const {Router} = require('express');
const {registrarUsuario, confirmar, Autenticar, perfil} = require('../controllers/usuarioController');
const checkAuth = require('../middleware/auth');
const {validarCorreo} = require('../middleware/usuarioMid');

const router = Router();

router.post('/', validarCorreo, registrarUsuario)
router.get('/confirmar/:token', confirmar)
router.post('/login', Autenticar)

// Rutas Privadas
router.get('/perfil', checkAuth, perfil)

module.exports = router;
