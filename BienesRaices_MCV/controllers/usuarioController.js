import { check, validationResult } from "express-validator"
import Usuario from "../models/Usuario.js"
import { generarId } from "../helpers/tokens.js"
import { emailRegistro } from "../helpers/emails.js"

 
const formularioLogin =  (req, res) => {
    res.render('auth/login.pug', {
        pagina: 'Iniciar sesión'
    })
}

const formularioRegistro =  (req, res) => {
    res.render('auth/registro.pug', {
        pagina: 'Resgistrarse ahora ',
        csrfToken : req.csrfToken()
    })
}

//Insertar datos a la bd
const registrar = async (req, res) => {
    //Validacion
    await check('nombre').notEmpty().withMessage('El campo nombre no debe de estar vacio').run(req)
    await check('email').isEmail().withMessage('Email no valido').run(req)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
    await check('repetirpassword').equals(req.body.password).withMessage('Contraseñas no coinciden').run(req)

    let resultado = validationResult(req)

    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            //Autocompletado
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    const {nombre, email, password} = req.body;
    //Validar usuarios duplicados
    const usuarioExiste = await Usuario.findOne( { where: {email }})
    if (usuarioExiste) {
        return res.render('auth/registro',{
            pagina: 'Crear cuenta',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El correo '+ req.body.email+ ' ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    //Crear usuario
    const usuario = await Usuario.create({
        nombre,
        email, 
        password,
        token: generarId()
    })

    //Enviar confirmaciòn mediante email
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada satisfactoriamente',
        mensaje: 'Se ha enviado un correo de confirmación a ' +email+ ' presiona en el enlace'
    })
}

//Comprobar cuenta

const confirmar = async (req, res) => {
    const {token }= req.params.token
    console.log(token)
    //Validar is el token es valido
    const usuario = await Usuario.findOne({where:{token}})
    if (!usuario) {
        return res.render('auth/confirmar-cuenta',{
            pagina:'Error al realizar la confirmación de su cuenta',    
            mensaje: 'Uppss... al parecer hubo un error al confirmar su cuenta, intente nuevamente por favor.',
            error: true
        })
    }
    //Confirmar cuenta
    usuario.token = null;
    usuario.confirmar = true;
    await usuario.save()
    res.render('auth/confirmar-cuenta',{
        pagina:'Cuenta confirmada',    
        mensaje: 'La cuenta ha sido confirmada correctamente'
    })
}

const formularioResetpsswd =  (req, res) => {
    res.render('auth/psswdReset', {
        pagina: 'Olvide mi contraseña',
        csrfToken : req.csrfToken()
    })
}
const ressetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('Email no valido').run(req)
    let resultado = validationResult(req)

    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/psswdReset', {
            pagina: 'Recupera el acceso a tu cuenta',
            csrfToken : req.csrfToken(),
            errores : resultado.array()  
        })
    }
}

export {
    formularioLogin,
    formularioRegistro,
    formularioResetpsswd,
    ressetPassword,
    confirmar,
    registrar
}

// Se esta usando bcryptjs
// https://masteringjs.io/tutorials/node/bcrypt#:~:text=bcrypt's%20hash()%20function%20is,passwords%20harder%20to%20brute%20force.