const jwt = require('jsonwebtoken')
const authConfig = require('./auth')
      

let autentica = (req, res, next) => {
    let token = req.headers.authorization || null
    console.log(token)

    jwt.verify(token,  process.env.AUTH_SECRET, (err, decode) =>{
        if(err) 
        {
            return res.status(400).json({
                data : err,
                msg : 'Token Invalido'
            })
        }else {
            req.decode = decode
            let token = jwt.sign({data: decode.data}, process.env.AUTH_SECRET, {
                algorithm: 'HS256',
                expiresIn: parseInt(process.env.AUTH_EXPIRES) // 600000
            })

            req.token = token
            next()
        }
    })

}

module.exports = {
    autentica
}