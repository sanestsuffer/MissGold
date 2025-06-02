const apiUrl = 'http://localhost:3000/api/table';

const tableList = document.getElementById('tableList');
const createTableForm = document.getElementById('createTableForm');
const addItemForm = document.getElementById('addItemForm');

async function loadTables() {
    const res = await fetch(apiUrl);
    const tables = await res.json();

    tableList.innerHTML = '';
    tables.forEach(table => {
        const div = document.createElement('div');
        div.className = 'table-item';

        div.innerHTML = `
            <strong>Table #${table.tableNumber}</strong> - ${table.isAvailable ? 'Available' : 'Occupied'}
            <button onclick="deleteTable('${table.tableNumber}')">Delete Table</button>
            <div>
                <h4>Current Order:</h4>
                ${table.currentOrder.length === 0 ? '<p>No items.</p>' : ''}
                <ul>
                    ${table.currentOrder.map(item => `
                        <li class="order-item">
                            ${item.menuItem.name || 'Unknown Item'} x ${item.quantity}
                            ${item.note ? `(Note: ${item.note})` : ''}
                            <button onclick="removeItem('${table.tableNumber}', '${item._id}')">Remove</button>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        tableList.appendChild(div);
    });
}

createTableForm.addEventListener('submit', async e => {
    e.preventDefault();
    const tableNumber = document.getElementById('tableNumber').value;

    await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ tableNumber: parseInt(tableNumber, 10) }),
    });

    createTableForm.reset();
    loadTables();
});

async function deleteTable(tableNumber) {
    if (confirm(`Delete table #${tableNumber}?`)) {
        await fetch(`${apiUrl}/${tableNumber}`, {
            method: 'DELETE',
        });
        loadTables();
    }
}

loadTables();
