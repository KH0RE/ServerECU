  
module.exports = {
    secret:  process.env.AUTH_SECRET  || "hola",
    expires: process.env.AUTH_EXPIRES || "1800000",
    rounds:  process.env.AUTH_ROUNDS  || 10
} 