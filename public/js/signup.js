const signUpForm = document.querySelector('#signup-form');
const username = document.querySelector('#name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const signUpBtn = document.querySelector('#signup-Btn');
const errorMessageContainer = document.querySelector('#error-message');
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

        errorMessageContainer.textContent = '';
        clearInputs();
    }
    catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
            errorMessageContainer.textContent = err.response.data.error;
        } else {
            console.log('Error during sign-up:', err);
        }
    }
}

function clearInputs() {
    username.value = '';
    email.value = '';
    password.value = '';
}