const jwt = require('jsonwebtoken');

//======================
// Verificar Token 
//======================

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    // verify a token symmetric
    jwt.verify(token, process.env.SECRETO, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: " Token no valido"
                }
            })
        }

        req.usuario = decoded.usuarioDB;
        console.log(decoded.usuarioDB);

    });
}
module.exports = {
    verificaToken
}
