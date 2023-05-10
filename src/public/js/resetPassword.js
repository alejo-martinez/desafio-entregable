const formEnvPass = document.getElementById('formEnvPass');
const inputPassword = document.getElementById('inputpassword');
const inputPassword2 = document.getElementById('inputpassword2');

formEnvPass.addEventListener('submit', e =>{
    e.preventDefault();
    let pass = inputPassword.value;
    let passconfirm = inputPassword2.value;
    // console.log(password);
    if(pass === passconfirm){
        fetch('/api/session/updatepass', {
            method:'POST',
            body: JSON.stringify({password: pass}),
            headers:{
                'Content-type': 'application/json'
            }
        })
        .then(result => result.json())
        .then(json => console.log(json))
    } else {
        console.log('las contraseñas no coinciden');
    }
})