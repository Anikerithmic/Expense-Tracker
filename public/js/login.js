const loginForm = document.querySelector('#login-form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const loginBtn = document.querySelector('#login-Btn');
const errorMessageContainer = document.querySelector('#error-message');

loginForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();

    const userData = {
        email: email.value,
        password: password.value
    };

    try {

        const response = await axios.post("http://localhost:4000/user/login", userData);
        console.log('Login successful:', response.data);

        errorMessageContainer.textContent = '';
        clearInputs();
    }
    catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
            errorMessageContainer.textContent = err.response.data.error;
        } else {
            console.log('Error during login:', err);
        }
    }
}

function clearInputs() {
    email.value = '';
    password.value = '';
}