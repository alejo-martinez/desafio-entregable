const formRegistro = document.getElementById('formRegistro')

formRegistro.addEventListener('submit', e =>{
    e.preventDefault()
    const data = new FormData(formRegistro)
    const objeto = {}
    data.forEach((value, key)=>objeto[key] = value)
    fetch('api/session/register', {
        method:'POST',
        body: JSON.stringify(objeto),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(result => result.json())
    .then(json=>{
        if(json.status === 'succes') window.location.replace('http://localhost:3005/')
        console.log(json)
    });
})