const formRegistro = document.getElementById('formRegistro')

formRegistro.addEventListener('submit', async (e) =>{
    e.preventDefault()
    const data = new FormData(formRegistro)
    const objeto = {}
    data.forEach((value, key)=>objeto[key] = value)
    const responseRegister = await fetch('api/session/register',{method:'POST', body:JSON.stringify(objeto), headers:{'Content-type': 'application/json'}});
    const jsonRegister = await responseRegister.json();
    
    if(jsonRegister.status === 'succes'){
         await fetch('api/cart/', {method:'POST', body:JSON.stringify({email: objeto.email}), headers: {'Content-Type': 'application/json'}});
         window.location.replace('/')
        // const jsonCart = await responseCart.json();const responseCart =   
    }

    // fetch('api/cart/', {
    //     method:'POST',
    //     body: JSON.stringify({email: objeto.email}),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // }).then(result => result.json())
    
    // fetch('api/session/register', {
    //     method:'POST',
    //     body: JSON.stringify(objeto),
    //     headers: {
    //         'Content-type': 'application/json'
    //     }
    // }).then(result => result.json())
    // .then(json=>{
    //     if(json.status === 'succes') window.location.replace('http://localhost:3005/')
    //     console.log(json)
    // });
})