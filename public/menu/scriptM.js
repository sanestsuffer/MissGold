const apiUrl = 'http://localhost:3000/api/menu';

const menuForm = document.getElementById('menuForm');
const menuList = document.getElementById('menuList');

menuForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('menuId').value;
    const data = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        image: document.getElementById('image').value,
        category: document.getElementById('category').value,
    };

    if (id) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } else {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    menuForm.reset();
    document.getElementById('menuId').value = '';
    loadMenu();
});

function formatVND(value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

async function loadMenu() {
    const res = await fetch(apiUrl);
    const items = await res.json();

    menuList.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';

        div.innerHTML = `
            <strong>${item.name}</strong><br>
            Price: ${formatVND(item.price)}<br>
            Category: ${item.category}<br>
            <img src="${item.image}" alt="${item.name}"><br>
            <div class="menu-actions">
                <button onclick="editItem('${item._id}')">Edit</button>
                <button onclick="deleteItem('${item._id}')">Delete</button>
            </div>
        `;
        menuList.appendChild(div);
    });
}

async function editItem(id) {
    const res = await fetch(`${apiUrl}/${id}`);
    const item = await res.json();

    document.getElementById('menuId').value = item._id;
    document.getElementById('name').value = item.name;
    document.getElementById('price').value = item.price;
    document.getElementById('image').value = item.image;
    document.getElementById('category').value = item.category;
}

async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        loadMenu();
    }
}

loadMenu();
