const logout = document.getElementById('logout');
const agregarCarrito = document.getElementById('agregarCarrito');
const goCarrito = document.getElementById('goCarrito')
const tituloProd = document.getElementById('titulo');
const divProd = document.getElementById(`prod${tituloProd}`)


goCarrito.addEventListener('click', async(e) =>{
    e.preventDefault();
    const response = await fetch('/api/session/current');
    const user = await response.json();
    window.location.replace(`/carts/${user.payload.carrito}`)
})

const addCarrito = async (id, stock)=>{
    const response = await fetch('api/session/current');
    const json = await response.json();
    if(stock !== 0) await fetch(`api/cart/${json.payload.carrito}/products/${id}`, {method:'POST'});
    else divProd.innerHTML=`<span style="color:red;">No hay suficiente stock de este producto</span>`;
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