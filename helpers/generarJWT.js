const jwt = require("jsonwebtoken")

const generarJTW = (id) => {
    return jwt.sign({ id },process.env.JWT_SECRET, {
        expiresIn: "30d", // Cunado expira el JWT
    })
};

module.exports = generarJTW
