const socket = io()

let container = document.getElementById('containerItem')


socket.on('prodNew',  data =>{

        container.innerHTML += `
        <div class="cardProd">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <p>Precio: $${data.price} </p>
        <p>Stock: ${data.stock} </p>
        </div>`
    
})