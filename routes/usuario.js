const {Router} = require('express');
const {registrarUsuario, confirmar, Autenticar} = require('../controllers/usuarioController')

const router = Router();

router.post('/', registrarUsuario)
router.get('/confirmar/:token', confirmar)
router.post('/login', Autenticar)

module.exports = router;