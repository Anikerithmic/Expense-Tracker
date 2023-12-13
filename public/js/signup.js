const signUpForm = document.querySelector('#signup-form');
const username = document.querySelector('#name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const signUpBtn = document.querySelector('#signup-Btn');

signUpForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();

    const userData = {
        username: username.value,
        email: email.value,
        password: password.value
    };

    try {

        const response = await axios.post("http://localhost:4000/user/signup", userData);
        console.log('Sign-Up successful:', response.data);

        clearInputs();
    }
    catch (err) {
        console.log('Error during sign-up:', err);
    }
}

function clearInputs() {
    username.value = '';
    email.value = '';
    password.value = '';
}