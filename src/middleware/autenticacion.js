const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTE_ID);
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
        //console.log(decoded.usuarioDB);
        next();

    });
}


const verify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTE_ID,
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        correo: payload.email,
        img: payload.picture,
        google: true
    }
}

module.exports = {
    verificaToken, verify
}
