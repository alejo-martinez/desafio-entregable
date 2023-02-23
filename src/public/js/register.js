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
    })
})