const btnMostrar = document.getElementsByClassName('btn-mostrar');
const btnActualizar = document.getElementsByClassName('btn-actualizar');
const btnBorrar = document.getElementsByClassName('btn-borrar')
const ocultos = document.getElementsByClassName('ocultos');
const container = document.getElementById('container')


for(let el of btnBorrar){
    el.addEventListener('click', e=>{
        e.preventDefault();
        const id = el.dataset.id
        fetch(`/api/users/${id}`, {
            method:'DELETE'
        }).then(result => result.json()).then(data => {
            if(data.status === 'succes') location.reload()
        })
    })
}

for(let el of btnMostrar){
    el.addEventListener('click', e =>{
        e.preventDefault();
        let elemento = document.getElementById(el.dataset.id)
        if(elemento.classList.contains('hide')) elemento.classList.remove('hide')
        else elemento.classList.add('hide')
    })
}

for(let el of btnActualizar){
    el.addEventListener('click', e =>{
        e.preventDefault();
        let idu = el.dataset.id;
        let valorInput = document.getElementById(`id${idu}`)
        console.log(valorInput.value);
        let enviar = {id: idu, valor: valorInput.value}
        fetch('/api/users/', {
            method: 'PUT',
            body:JSON.stringify(enviar),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => result.json()).then(data =>{
            if(data.status === 'succes'){
                location.reload();
            }
        })
    })
}