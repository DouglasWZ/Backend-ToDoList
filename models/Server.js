const express = require('express');
const {dbConexion} = require('../DB/config');

class Server {

    constructor(){
        this.app = express();
        this.puerto = process.env.PORT;   

        this.usuariosPath = '/api/usuarios';
        
        // Conectar Base de datos
        this.conectarBD();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    // Métodos //

    middlewares(){
        this.app.use(express.json());
    }

    // Conectar con la BD
    async conectarBD(){
        this.pool = await dbConexion();
    }

    // Rutas
    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuario'));
    }



    // Escucha de la aplicación
    listen(){
        this.app.listen(this.puerto, ()=>{
            console.log(`Servidor ejecutandose correctamente en el puerto ${this.puerto}`);
        })
    }
}

module.exports = Server;