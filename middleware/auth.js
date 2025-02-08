const jwt = require("jsonwebtoken")
const sql = require("mssql");
const {dbConexion} = require("../DB/config");

const checkAuth = async (req, res, next) => {

    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ // Comprobamos que envie el token pero tambien el Bearer
        //console.log('Si tiene el token con Bearer')
    
        try {
            token = req.headers.authorization.split(' ')[1]; 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Buscar el usuario que contiene ese Token

            const usuarioId = decoded.id

            const conexion = await dbConexion();
            const resultado = await conexion
                .request()
                .input('usuarioId', sql.Int, usuarioId)
                .query('SELECT id, nombreUsuario, correo FROM Gestion.Usuario WHERE id = @usuarioId');
        
            // Verifica si el usuario no fue encontrado
            if(resultado.recordset.length === 0){
                return res.status(404).json({message: 'Usuario no encontrado'});
            }

            // Obtener el usuario encontrado
            req.usuario = resultado.recordset[0]
            return next();


        } catch (error) {
            const e = new Error('Token no Válido');
            res.status(403).json({msg: e.message});
        }
    }    
    
    if(!token){
        const error = new Error('Token no Válido o inexistente');
        res.status(403).json({msg: error.message});
    }
    next();
}

module.exports = checkAuth
