const logout = document.getElementById('logout');
const agregarCarrito = document.getElementById('agregarCarrito');
const tituloProd = document.getElementById('titulo');
const divProd = document.getElementById(`prod${tituloProd}`);

const addCarrito = async (id)=>{
    const response = await fetch('api/session/current');
    const json = await response.json();
    const responseAdd = await fetch(`api/cart/${json.payload.carrito}/products/${id}`, {method:'POST'});
    const jsonAdd = await responseAdd.json();
    if(jsonAdd.status === 'error') document.getElementById(`div${id}`).innerHTML=`<span style="color:red;">${jsonAdd.payload}</span>`;
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