import nodemailer from 'nodemailer';


const emailRegistro = async(datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.Email_Host,
        port: process.env.Email_Port,
        auth: {
          user: process.env.Email_User,
          pass: process.env.Email_Pass
        }
    });
    const {email, nombre, token} = datos

    //Rnviar Email
    await transport.sendMail({
        from: 'ac61887gmail.com',
        to: email,
        subject: 'Confirma tu cuenta en PuntoInmobilidario.com ',
        text: 'Confirma tu cuenta en PuntoInmobilidario.com ',
        html: `<p>Bienvenido ${nombre}, estas a un paso de formar parte de PuntoInmobiliario </p>
              <p>Tu cuenta estacasi lista, solo es necesario confirmarla mediante el siguiente enlace: 
              <a href="${process.env.Backend_URL}:${process.env.port ?? 3000}/auth/confirmar/${token}"> Confirmar cuenta </a></p>
              
              <p>Si no creaste esta cuenta, solo ignora el mensaje </p>
        `
    })
}

export{
    emailRegistro
}
// https://app.mailgun.com/app/sending/domains/sandboxf8de9a49ae2949a2902d4bc8d9838931.mailgun.org
