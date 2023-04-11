const logout = document.getElementById('logout');
const agregarCarrito = document.getElementById('agregarCarrito');
const goCarrito = document.getElementById('goCarrito')

const tituloProd = document.getElementById('titulo');


goCarrito.addEventListener('click', async(e) =>{
    e.preventDefault();
    const response = await fetch('/api/cart', {method:'GET'})
    const carritos = await response.json();
    let idCarrito = carritos[0]._id
    window.location.replace(`http://localhost:3005/carts/${idCarrito}`)
})

const addCarrito = async (param)=>{
    const response = await fetch('/api/cart', {method:'GET'}) 
    const carritos = await response.json()
    if (carritos.length !== 0) {
        let idCarrito = carritos[0]._id;
        await fetch(`/api/cart/${idCarrito}/products/${param}`, {method:'POST'}) 
    } else {
        await fetch('/api/cart', {method:'POST'})
        const response2 = await fetch('/api/cart', {method:'GET'}) 
        const carritosNuevos = await response2.json()
        let idCarrito = carritosNuevos[0]._id;
        await fetch(`/api/cart/${idCarrito}/products/${param}`, {method:'POST'})
    }
}

logout.addEventListener('click', e =>{
    e.preventDefault()
    fetch('/api/session/login', {
        method: 'DELETE',
    }).then(result => result.json())
    .then(json => {
        if(json.status === 'succes') window.location.replace('http://localhost:3005/')
        console.log(json)
    })
})