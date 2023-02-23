const logout = document.getElementById('logout')

logout.addEventListener('click', e =>{
    e.preventDefault()
    fetch('/api/session/login', {
        method: 'DELETE',
    }).then(result => result.json())
    .then(json => {
        if(json.status === 'succes') window.location.replace('http://localhost:3005/')
        console.log(json)
    })
})