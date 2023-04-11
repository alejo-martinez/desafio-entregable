const finCompraBtn = document.getElementById('finCompra');
const idCartSpan = document.querySelector('.oculto')

let idCart = idCartSpan.innerHTML;

finCompraBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    fetch(`/api/cart/${idCart}/purchase`, {method:'POST'}).then(result => result.json()).then(json =>{
        if(json.status === 'succes') window.location.replace('http://localhost:3005/products')
    })
})

