const inputAmount = document.querySelector('#amount');
const inputDescription = document.querySelector('#discription');
const inputCategory = document.querySelector('#category');
const myForm = document.querySelector('#my-form');
const expenseList = document.getElementById('expense-list');

myForm.addEventListener('submit', onSubmit);

window.addEventListener("DOMContentLoaded", () => {
    axios.get("http://localhost:4000/get-expenses")
        .then(response => {
            console.log('Recieved Expenses:', response);
            showExpenses(response.data);
        })
        .catch(err => {
            console.log(err);
        });
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

        axios.post("http://localhost:4000/create-expense", expense)
            .then(response => {
                const responseData = response.data;
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


        // const expenseId = Date.now().toString(); 
    }
}


function deleteButton(expense, expenseItem) {

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';

    deleteBtn.onclick = function () {
        expenseItem.remove();

        const apiUrl = `http://localhost:4000/delete-expense/${expense.id}`;
        axios.delete(apiUrl)
            .then(response => {
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

                // myForm.removeEventListener('submit', onSubmit);
                // myForm.addEventListener('submit', onUpdate(e, editExpense));
              

                
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
    // else if (expenses && typeof expenses === 'object') {
    //     const expenseArray = expenses.allExpenses || [];
    //     expenseArray.forEach((expense) => {
    //         const expenseItem = document.createElement('li');

    //         expenseItem.textContent =
    //             expenseItem.username + ', ' +
    //             expenseItem.contact + ',' +
    //             expenseItem.email;

    //         listItem.appendChild(expenseElement);
    //         expenseList.appendChild(listItem);

    //         deleteButton(expenses, expenseItem);
    //         editButton(expenses, expenseItem);
    //     });
    // }

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
                console.log("newExpense:"+ responseData);
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


function clearInputs() {
    inputAmount.value = '';
    inputDescription.value = '';
    inputCategory.value = 'Open this select menu';
}
