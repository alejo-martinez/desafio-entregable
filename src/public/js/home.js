const socket = io()

let container = document.getElementById('containerItem')
// let titulo = document.getElementById('title')
// let descripcion = document.getElementById('description')
// let precio = document.getElementById('price')
// let stock = document.getElementById('stock')


// socket.on('prodAct', (data)=>{
//     let productos = "";
//     data.forEach((prod) =>{
//         // productos += prod.title
//         container.innerHTML = prod.title
//     })

// })

socket.on('arrayAct', data =>{
    console.log(data);

    data.forEach(prod =>{
        // console.log(prod);
        container.innerHTML += `
        <div style="display: flex; flex-flow: column nowrap; margin: 7px 10px">
        <h3>${prod.title}</h3>
        <p>${prod.description} </p>
        <p>Precio: ${prod.price} </p>
        <p>Stock: ${prod.stock} </p>
    
        </div>`
    })
})

// socket.emit('message', 'hola desde el lado del cliente')


    