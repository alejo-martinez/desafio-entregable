const finCompraBtn = document.getElementById('finCompra');

finCompraBtn.addEventListener('click', async (e) =>{
    e.preventDefault();
    const response = await fetch('/api/cart', {method:'GET'})
    const carritos = await response.json();
    let idCarrito = carritos[0]._id;
    let carritoConProds = carritos[0].products;
    const response2 = await fetch(`/api/cart/${idCarrito}`);
    const carritoBuscado = await response2.json();
    let carritoConProdsDetalles = carritoBuscado.products; 
    let estock;
    let valido ;
    carritoConProds.forEach(prod => {
        carritoConProdsDetalles.forEach(producto =>{
            return estock = producto.stock;
        })
        if (estock > prod.quantity) {
            return valido = true;
        }
    })
    if (valido === true) {
        fetch(`/api/cart/${idCarrito}/purchase`, {method:'POST'}).then(result => result.json()).then(json=>{
            if (json.status === 'succes') {
                window.location.replace('http://localhost:3005/products')
            }
        })
    }
})