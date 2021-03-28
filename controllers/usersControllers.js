const express = require('express')
const path = require('path')
const User = require('../models/user')
const ObjectId  = require("mongodb")
const fs = require('fs-extra');
const { unlink } = require('fs-extra')
const  bcrypt = require ('bcrypt');
const authConfig = require('../middlaware/auth')
const jwt = require('jsonwebtoken')


async function verTodos(req, res) {
    const users = await User.find();
    console.log(users);
    return res.json(users);

}


async function crearOne(req, res) {
    let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds) )
    try {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: password,
          //  imagenPath: req.file.path
        }).then(user => {
            return res.status(200).json({
                ok: true,
                user,
                msg: "Creado con exito"
            })
        }).catch(error => {
            return res.status(500).json({
                ok: true,
                user: null,
                msg: error
            })
        })
    } catch (error) {
        return res.status(400).json({
            msg: 'No se pudo crear',
            error
        })
    }
}

async function eliminar (req, res) {
    const { id } = req.params
    const img = await User.findByIdAndDelete(id)

    if(img) {
       await unlink(path.resolve(img.imagenPath))
       //await fs.unlink(path.resolve(img.imagenPath))
       console.log('Eliminado con exito')
    }else{
        console.log('Eliminado con exito')
    }

    return res.json(img);
}

/*async function editar (req, res) {
    const { id } = req.params;
    const body = req.body;
    const img = await User.findByIdAndUpdate(id, body)
    
     return res.json(img);
}*/

async function editar (req, res) {
    const { id } = req.params;
    const body = req.body;

    const img = await User.findByIdAndUpdate(id, body)
   
    return res.json({
        msg: 'Actualizada',
        img
    })
}


async function login (req, res) {

     await User.find({
       email : req.body.email 
    }).exec((err, content) => {
        if (err || content  === null || content.length === 0 ) {
            res.status(400).send("Usuario incorrecto");
        }else {

           try {
                 bcrypt.compare(req.body.password, content[0].password,
                    (err, response) => {
                        if(err){
                            res.status(404).send("Usuario incorrecto");
                        } else {
                            const token = jwt.sign({data: req.body.email}, process.env.AUTH_SECRET,{
                                algorithm: 'HS256',
                                expiresIn: parseInt(process.env.AUTH_EXPIRES)
                            })
                            console.log(token)
                            res.status(200).json({
                                token
                            })
                          }
                    })
           
           } catch (error) {
            res.status(404).send("usuario incorrecto");
           }
        }
    })
    
   


    /*try {
        if(user)
        {
           bcrypt.compareSync(user.password)
            if(clave)
            {
                console.log('OK')
                console.log(user)
                const token = jwt.sign({
                    'email' : usuario.email
                }, process.env.AUTH_SECRET,{
                    algorithm: 'HS256',
                    expiresIn: parseInt(process.env.AUTH_EXPIRES)
                })
                console.log(token)
                res.status(200).json({
                    token
                })
            }else {
                return res.s  const clave =tatus(400).json({
                    msg: 'Contraseña Incorrecta :v'
                })
            }
        }else if(!user)
            {
                 return res.status(400).json({
                     msg: 'Usuario no encontrado :c'
                 })       
            }
    } catch (error) {
        return res.status(400).json({
            msg: 'No se pudo crear :3',
            error
        })
    }*/
    
   
} 


module.exports = {
    crearOne,
    eliminar,
    verTodos,
    editar, 
    login
}