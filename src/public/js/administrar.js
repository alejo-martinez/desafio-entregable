const logout = document.getElementById('logout');
const formCreate = document.getElementById('formcreate');

formCreate.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const data = new FormData(formCreate);
    const response = await fetch('api/products/', {
        method:'POST',
        body: data
    })
    const json = await response.json();
    if(json.status === 'succes') {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Producto creado !`,
            showConfirmButton: false,
            timer: 1500
          })
    }
    else document.getElementById('faildiv').innerHTML=`<span style=color:red;>${JSON.stringify(json.error)}</span>`
})

logout.addEventListener('click', e =>{
    e.preventDefault()
    fetch('/api/session/login', {
        method: 'DELETE',
    }).then(result => result.json())
    .then(json => {
        if(json.status === 'succes') window.location.replace('/prods')
    })
})