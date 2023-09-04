const inputAmount = document.querySelector('#amount');
const inputDescription = document.querySelector('#discription'); 
const inputCategory = document.querySelector('#category');
const myForm = document.querySelector('#my-form');
const expenseList = document.getElementById('expense-list'); 

myForm.addEventListener('submit', onSubmit);

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

  
        const expenseId = Date.now().toString();

   
        localStorage.setItem(expenseId, JSON.stringify(expense));

        const expenseItem = document.createElement('li');

        expenseItem.innerHTML =
            `Rs.${expense.amount}/- | ${expense.description} | ${expense.category} `;

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('btn','btn-dark');
        deleteBtn.style.marginInline = '10px';

        // Deleting expense item from local storage and list
        deleteBtn.onclick = function () {
            expenseItem.remove();
            localStorage.removeItem(expenseId);
        };
        expenseItem.appendChild(deleteBtn);

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.textContent = 'Edit';
        editBtn.classList.add('btn', 'btn-dark');
        editBtn.style.marginInline = '12px';


        editBtn.onclick = function () {
            inputAmount.value = expense.amount;
            inputDescription.value = expense.description;
            inputCategory.value = expense.category;
            expenseItem.remove(); 
            localStorage.removeItem(expenseId); 
        };
        expenseItem.appendChild(editBtn);

        expenseItem.style.marginBottom = '10px';

        expenseList.appendChild(expenseItem);


        inputAmount.value = '';
        inputDescription.value = '';
        inputCategory.value = 'Open this select menu';
    }
}
