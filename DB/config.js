const sql = require('mssql');

let poolPromise // Variable para almacenar el pool

// Configuración de la base de datos
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Usa true si estás en Azure
        trustServerCertificate: true // Cambiar en producción
    },
    pool: {
        max: 10, // Máximo número de conexiones en el pool
        min: 0,   // Mínimo número de conexiones en el pool
        idleTimeoutMillis: 30000 // Tiempo que una conexión puede estar inactiva antes de ser cerrada
    }
}

const dbConexion = async () => {
    if (!poolPromise) {
        poolPromise = sql.connect(dbConfig)
            .then(pool => {
                console.log('Conexión exitosa a SQL Server');
                return pool; // Retorna el pool de conexiones
            })
            .catch(err => {
                console.error('Error al conectar a SQL Server', err.message);
                process.exit(1);
            });
    }
    return poolPromise; // Devuelve el pool existente
}

// Crear y exportar la conexión

module.exports = {
    dbConexion
};

