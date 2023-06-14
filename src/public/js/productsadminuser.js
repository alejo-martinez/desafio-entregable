const logout = document.getElementById('logout');

const mostrarform = (id)=>{
    const divForm = document.getElementById(`upd${id}`);
    if(divForm.classList.contains('hide')) {
        divForm.classList.remove('hide');
    } else divForm.classList.add('hide')
}

    const updateProduct = async(idProd)=>{
            const key = document.getElementById(`campo${idProd}`).value;
            const value = document.getElementById(`valor${idProd}`).value;
            console.log(key);
            console.log(value);
            const datos = {campo: key, valor: value}
            const response = await fetch(`/api/products/${idProd}`, {
                method:'PUT',
                body: JSON.stringify(datos),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json();
            if(json.status ==='succes') window.location.reload()
            else {console.log(json.error);}
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

const borrarProd = (id) =>{
    Swal.fire({
        title: 'Estas seguro que quieres borrar el producto?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar!'
      }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/products/${id}`,{method:'DELETE'}).then(result => result.json()).then(json=>{
                if(json.status === 'succes'){
                    Swal.fire(
                      'Borrado!',
                      'El producto fue borrado.',
                      'success'
                    )
                } else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    })
                }
            })
        }
      })
}