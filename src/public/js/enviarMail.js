const formEnvMail = document.getElementById('formEnvMail');
const inputemail = document.getElementById('inputemail');

formEnvMail.addEventListener('submit', e =>{
    e.preventDefault();
    let content = inputemail.value

    fetch(`/api/session/resetpass/${content}`, {
        method:'DELETE',
    })
    .then(result => result.json())
    .then(json => console.log(json))
})