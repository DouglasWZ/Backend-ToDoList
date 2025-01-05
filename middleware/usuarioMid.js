const validarCorreo = (req, res, next) =>{
    const {correo} = req.body

    // Verificar si el correo existe en el cuerpo de la solicitud
    if(!correo){
        return res.status(400).json({error: 'El Campo "correo" es obligatorio'})
    }

    // Verifica si el correo tiene el formato válido
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        return res.status(400).json({ error: "El formato del correo no es válido" });
    }

    // Si todo está bien, continua al siguiente middleware/controlador
    next();
}

module.exports = {
    validarCorreo
}