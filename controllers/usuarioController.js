const bcrypt = require("bcryptjs");
const sql = require("mssql");
const {dbConexion} = require("../DB/config");

const generarToken = require("../helpers/generarToken");

const registrarUsuario = async (req,res) =>{
    try {
        // Guardar un nuevo Usuario
        const {nombreUsuario, correo, contraseña} = req.body;

        // Evitar campos vacios
        if(!nombreUsuario || !correo || !contraseña){
            return res.status(400).json({error: "No pueden ir campos vacios"})
        }

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        const contraEncriptada = bcrypt.hashSync(contraseña, salt);

        // Genera el token de verificación
        const tokenVerificacion = generarToken();

        // Abrir la conexión 
        const pool = await dbConexion();

        //Ejecutar el SP
        const result = await pool
            .request()
            .input("nombreUsuario", sql.VarChar(100), nombreUsuario)
            .input("correo", sql.VarChar(100), correo)
            .input("contraseña", sql.VarChar(255), contraEncriptada)
            .input('tokenVerificacion', sql.NVarChar, tokenVerificacion)
            .output("Mensaje", sql.VarChar(200)) // Para recibir el mensaje de salida
            .execute("SP_Agregar_Usuario");

            // Verificar si el mensaje es de error o éxito
            const mensaje = result.output.Mensaje; // El mensaje de salida del SP
            if (mensaje === 'Usuario Creado correctamente') {
                // Respuesta exitosa
                res.status(200).json({ mensaje });
            } else if (mensaje === 'El correo ya está registrado') {
                // Error de conflicto (correo duplicado)
                res.status(409).json({ error: mensaje });
            } else {
                // Otro tipo de error desde el SP
                res.status(400).json({ error: mensaje });
            }

    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Error en el servidor. No se pudo registrar el usuario."});
    }
}


const confirmar = async (req, res) =>{

    try {

        const {token} = req.params;

        // Abrir la conexión 
        const pool = await dbConexion();

        // Consulta para obtener el usuario por token
        const resultado = await pool.request()
            .input('tokenVerificacion', sql.NVarChar, token)
            .execute('SP_Obtener_Usuario_Por_Token')
            
        const usuario = resultado.recordset[0];

        if (!usuario) {
            const error = new Error("Token no válido");
            return res.status(404).json({ msg: error.message });
        }

        // Obtener el resultado
        res.status(200).json({ msg: 'Cuenta confirmada', usuario });

    
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Error al confirmar la cuenta"})
    }

}

const Autenticar = async (req,res) =>{
    const {correo, contraseña} = req.body

    // Abrir la conexión 
    const pool = await dbConexion();

    // Comprobar si el Usuario existe
    const resultado = await pool.request()
        .input("correo", sql.NVarChar(255), correo)
        .execute("SP_Autenticar_Usuario");

    const usuario = resultado.recordset[0];

    if(!usuario){
        const error = new Error("El Usuario no existe");
        return res.status(404).json({ msg: error.message})
    }

    // Comprobar si el Usuario está confirmado
    if(!usuario.verificado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({msg: error.message});
    }

    // Comprobar la contraseña
    const esContraseñaCorrecta = await bcrypt.compare(contraseña, usuario.contraseña)

    if(!esContraseñaCorrecta){
        const error = new Error("Contraseña incorrecta");
        return res.status(401).json({msg: error.message});
    }
}

module.exports = {
    registrarUsuario,
    confirmar,
    Autenticar
}