const logout = document.getElementById('logout');
const agregarCarrito = document.getElementById('agregarCarrito');
const goCarrito = document.getElementById('goCarrito')



goCarrito.addEventListener('click', async(e) =>{
    e.preventDefault();
    const response = await fetch('/api/session/current');
    const user = await response.json();
    window.location.replace(`/carts/${user.payload.carrito}`)
})

const addCarrito = async (param)=>{
    const response = await fetch('api/session/current');
    const json = await response.json();
    await fetch(`api/cart/${json.payload.carrito}/products/${param}`, {method:'POST'})
}

logout.addEventListener('click', e =>{
    e.preventDefault()
    fetch('/api/session/login', {
        method: 'DELETE',
    }).then(result => result.json())
    .then(json => {
        if(json.status === 'succes') window.location.replace('/prods')
    })
})