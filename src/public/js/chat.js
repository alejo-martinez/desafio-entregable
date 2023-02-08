const socket = io()

let user = document.getElementById('user')
let sendMessage = document.getElementById('sendMessage')
let mensajesEscritos = document.getElementById('mensajesEscritos')
let mensajeNew = document.getElementById('mensajeNew')
let btnEnviar = document.getElementById('btnEnviar')

btnEnviar.addEventListener('click', e =>{
                if (user.value.trim().length>0 && sendMessage.value.trim().length>0) {
                        socket.emit('mensaje', {usuario: user.value, message: sendMessage.value})
                        sendMessage.value= ""
                }
})

socket.on('mensajesNuevos', data =>{
    let messages = ""
        data.forEach(msg => {
            console.log(msg);
            messages += messages+ `${msg.usuario} dice: ${msg.message}<br/>`
        });
        mensajesEscritos.innerHTML=messages
})