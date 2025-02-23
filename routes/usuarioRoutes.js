const {Router} = require('express');
const {registrarUsuario, confirmar, Autenticar, perfil, olvidePassword, comprobarToken, nuevoPassword} = require('../controllers/usuarioController');
const checkAuth = require('../middleware/auth');
const {validarCorreo} = require('../middleware/usuarioMid');

const router = Router();

router.post('/', validarCorreo, registrarUsuario)
router.get('/confirmar/:token', confirmar)
router.post('/login', Autenticar)
router.post('/olvide-password', olvidePassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

// Rutas Privadas
router.get('/perfil', checkAuth, perfil)

module.exports = router;
