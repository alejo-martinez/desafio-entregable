const finCompraBtn = document.getElementById('finCompra');
const idCartSpan = document.querySelector('.oculto')

// let idCart = idCartSpan.innerHTML;

finCompraBtn.addEventListener('click', async(e) =>{
    e.preventDefault();
    const response = await fetch('/api/session/current');
    const data = await response.json();
    const idCart = await data.payload.carrito;
    fetch(`/api/cart/${idCart}/purchase`, {method:'POST'}).then(result => result.json()).then(json =>{
        if(json.status === 'succes') window.location.replace('/products')
    })
})

