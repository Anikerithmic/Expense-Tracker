
const inputAmount = document.querySelector('#amount');
const inputDescription = document.querySelector('#discription');
const inputCategory = document.querySelector('#category');
const myForm = document.querySelector('#my-form');
const expenseList = document.getElementById('expense-list');
const buyPremiumBtn = document.querySelector('#rzp-btn');

myForm.addEventListener('submit', onSubmit);

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get("http://localhost:4000/get-expenses", { headers: { "Authorization": token } })
        const { expenses, userIsPremium } = response.data;
        if (userIsPremium) {
            updateUIForPremiumUser();
        }
        console.log('Recieved Expenses:', response);
        showExpenses(expenses);

    } catch (err) {
        console.error(err);
    }
});

function onSubmit(e) {
    e.preventDefault();

    const amount = inputAmount.value;
    const description = inputDescription.value;
    const category = inputCategory.value;

    if (!amount || !description || category === 'Open this select menu') {
        alert('Please Enter All Input Fields!');
    } else {
        const expense = {
            amount,
            description,
            category
        };
        const token = localStorage.getItem('token');

        axios.post("http://localhost:4000/create-expense", expense, { headers: { "Authorization": token } })
            .then(response => {
                const responseData = response.data;
                setTimeout(() => {
                    axios.get("http://localhost:4000/get-expenses", { headers: { "Authorization": token } })
                        .then(response => {
                            console.log('Received Expenses:', response);
                            showExpenses(response.data);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }, 0);

                clearInputs();
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }
}

function deleteButton(expense, expenseItem) {

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';

    deleteBtn.onclick = function () {

        const token = localStorage.getItem('token');

        axios.delete(`http://localhost:4000/delete-expense/${expense.id}`, { headers: { "Authorization": token } })
            .then(response => {
                expenseItem.remove();
                console.log('Expense Deleted:', response.data);
            })
            .catch(err => {
                console.log(err);
            });
    };
    deleteBtn.classList.add('btn', 'btn-dark');
    deleteBtn.style.marginInline = '10px';

    expenseItem.appendChild(deleteBtn);
}

function editButton(expense, expenseItem) {

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';


    editBtn.onclick = function (e) {
        const apiUrl = `http://localhost:4000/edit-expense/${expense.id}`;
        axios.put(apiUrl, expense)
            .then((response) => {

                const editExpense = response.data;
                console.log(editExpense);
                onUpdate(e, response.data);
                expenseItem.remove();

                inputAmount.value = editExpense.amount;
                inputDescription.value = editExpense.description;
                inputCategory.value = editExpense.category;

            })
            .catch((err) => {
                console.error('Error getting expense for edit:', err);
            });

    }

    editBtn.classList.add('btn', 'btn-dark');
    editBtn.style.marginInline = '12px';

    expenseItem.appendChild(editBtn);

    expenseItem.style.marginBottom = '10px';

    expenseList.appendChild(expenseItem);
}


function showExpenses(expenses) {
    expenseList.innerHTML = '';

    if (Array.isArray(expenses)) {

        expenses.forEach(expense => {
            const expenseItem = document.createElement('li');

            expenseItem.innerHTML =
                `Rs.${expense.amount}/- | ${expense.description} | ${expense.category} `;

            expenseList.appendChild(expenseItem);

            deleteButton(expense, expenseItem);
            editButton(expense, expenseItem, onUpdate);
        })
    }
    clearInputs();
}

function onUpdate(e, editExpense) {
    e.preventDefault();
    const id = editExpense.id;
    const amount = inputAmount.value;
    const description = inputDescription.value;
    const category = inputCategory.value;

    if (!amount || !description || category === 'Open this select menu') {
        alert('Please Enter All Input Fields!');
    } else {
        const expense = {
            id,
            amount,
            description,
            category
        };

        axios.put(`http://localhost:4000/edit-expense/${id}`, expense)
            .then(response => {
                const responseData = response.data;
                console.log("newExpense:" + responseData);
                setTimeout(() => {
                    axios.get("http://localhost:4000/get-expenses")
                        .then(response => {
                            console.log('Received Expenses:', response);
                            showExpenses(response.data);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }, 0);

                clearInputs();
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }
}

buyPremiumBtn.onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/purchase/premiumMembership', { headers: { "Authorization": token } })
    console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post('http://localhost:4000/purchase/updateTransactionStatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } });

            alert('You Are Premium user now.');
            window.location.href = './';

        }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async (response) => {
        console.log(response);
        alert('Something went wrong');
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:4000/purchase/updateTransactionStatus', {
                order_id: options.order_id,
                error_description: response.error.description
            }, { headers: { "Authorization": token } });
        } catch (error) {
            console.error('Transaction Failed:', error);
        }
    });
};

function updateUIForPremiumUser() {
    const buyPremiumBtn = document.querySelector('#rzp-btn');
    buyPremiumBtn.style.display = 'none';

    const premiumUserText = document.createElement('p');
    premiumUserText.textContent = 'You are a Premium User!';
    premiumUserText.classList.add('premium-user-text');

    document.body.appendChild(premiumUserText);
    showLeaderBoard();

}

function showLeaderBoard() {
    const leaderBoardBtn = document.createElement('button');
    leaderBoardBtn.classList.add('btn', 'btn-dark', 'leaderboard-btn');
    leaderBoardBtn.textContent = 'Show LeaderBoard';
    document.body.appendChild(leaderBoardBtn);

    leaderBoardBtn.onclick = async () => {
        const token = localStorage.getItem('token');
        try {
            const userLeaderBoardArray = await axios.get('http://localhost:4000/premiumUser/getUserleaderBoard', { headers: { "Authorization": token } });
            console.log(userLeaderBoardArray);
            userLeaderBoardArray.data.forEach((ele) => {
                if (ele.totalExpense === null) {
                    ele.totalExpense = 0;
                }
            });

            const leaderBoardElem = document.createElement('ul');
            leaderBoardElem.innerHTML = '<h4>Leader Board:</h4>';

            userLeaderBoardArray.data.forEach((userDetails) => {
                const listItem = document.createElement('li');
                listItem.textContent = `Name: ${userDetails.username} | Total Expense: Rs.${userDetails.totalExpense}/-`;
                leaderBoardElem.appendChild(listItem);
            });

            document.body.appendChild(leaderBoardElem);

        } catch (error) {
            console.log('Failed Loading LeaderBoard data.', error);
        }
    };
}

function clearInputs() {
    inputAmount.value = '';
    inputDescription.value = '';
    inputCategory.value = 'Open this select menu';
}