const formLogin = document.getElementById('formLogin');


formLogin.addEventListener('submit', e=>{
    
    e.preventDefault();
    const data = new FormData(formLogin);
    const objeto={};
    data.forEach((value,key)=>objeto[key]=value)

    fetch('/api/session/login', {
        method:'POST',
        body: JSON.stringify(objeto),
        headers:{
            'Content-type': 'application/json'
        },
    }).then(result => result.json())
    .then(json=>{
        if(json.status === 'succes') window.location.replace('http://localhost:3005/products')
        else console.log(json);
    });
})
