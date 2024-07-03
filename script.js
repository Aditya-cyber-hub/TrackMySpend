
document.addEventListener('DOMContentLoaded', (event) => {
    loadHistory();
    updateSummary();
});

function saveData() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const type = document.getElementById('income-expense').value;

    if (name === "" || description === "" || isNaN(amount) || category === "select" || type === "select") {
        alert("Please fill out all fields.");
        return;
    }

    const data = {
        name,
        description,
        amount,
        category,
        type,
        date: new Date().toLocaleString(),
        id: new Date().getTime()
    };

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(data);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    addHistoryItem(data);
    updateSummary();
    document.getElementById('name').value = "";
    document.getElementById('description').value = "";
    document.getElementById('amount').value = "";
    document.getElementById('category').value = "select";
    document.getElementById('income-expense').value = "select";
}

function addHistoryItem(data) {
    const historyDiv = document.getElementById('history');
    const item = document.createElement('div');
    item.className = 'history-item';
    item.setAttribute('data-id', data.id);
    item.innerHTML = `
        <h4>${data.name}</h4>
        <p>${data.description}</p>
        <p>Amount: ${data.amount}</p>
        <p>Category: ${data.category}</p>
        <p>Type: ${data.type}</p>
        <p>Date: ${data.date}</p>
        <button onclick="removeItem(${data.id})">Remove</button>
    `;
    historyDiv.insertBefore(item, historyDiv.firstChild);
    
}

function loadHistory() {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.forEach(item => addHistoryItem(item));
}

function removeItem(id) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = expenses.filter(item => item.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    document.querySelector(`.history-item[data-id="${id}"]`).remove();
    updateSummary();
}

function clearHistory() {
    localStorage.removeItem('expenses');
    document.getElementById('history').innerHTML = '';
    updateSummary();
}

function updateSummary() {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeByCategory = {};
    let expenseByCategory = {};

    expenses.forEach(item => {
        if (item.type === 'income') {
            totalIncome += item.amount;
            incomeByCategory[item.category] = (incomeByCategory[item.category] || 0) + item.amount;
        } else if (item.type === 'expense') {
            totalExpense += item.amount;
            expenseByCategory[item.category] = (expenseByCategory[item.category] || 0) + item.amount;
        }
    });

    document.getElementById('total-income').innerText = totalIncome;
    document.getElementById('total-expense').innerText = totalExpense;
    document.getElementById('net-profit').innerText = totalIncome - totalExpense;

    createPieChart('income-chart', expenses.filter(e => e.type === 'income'));
    createPieChart('expense-chart', expenses.filter(e => e.type === 'expense'));
}


function createPieChart(chartId, data) {
    const categories = Array.from(new Set(data.map(item => item.category)));
    const categoryData = categories.map(category => {
        return {
            name: category,
            value: data.filter(item => item.category === category).reduce((acc, item) => acc + item.amount, 0)
        };
    });

    const chartContainer = document.getElementById(chartId);
    chartContainer.innerHTML = '';  // Clear previous chart

    const chart = document.createElement('canvas');
    chartContainer.appendChild(chart);

    new Chart(chart, {
        type: 'pie',
        data: {
            labels: categoryData.map(item => item.name),
            datasets: [{
                data: categoryData.map(item => item.value),
                backgroundColor: ['pink', 'lightblue', 'orange', 'yellow', 'green', 'purple', 'red', 'blue', 'grey', 'brown', 'black']
            }]
        },
        options: {
            responsive: true
        }
    });
}

