document.addEventListener('DOMContentLoaded', () => {
    const tablesGrid = document.getElementById('tablesGrid');
    const tableBadge = document.getElementById('tableBadge');
    const categoryGrid = document.getElementById('categoryGrid');
    const menuGrid = document.getElementById('menuGrid'); 
    const navTabs = document.querySelectorAll('.nav-tab');
    const savedOrders = localStorage.getItem('orders');

    let selectedTable = 0;
    let selectedMenu = null;
    const orders = {}; 
    if (savedOrders) {
        Object.assign(orders, JSON.parse(savedOrders));
    }

    function renderOrder() {
        const orderContent = document.querySelector('.order-content');
        const currentOrder = orders[selectedTable] || [];

        orderContent.innerHTML = ''; // clear

        if (currentOrder.length === 0) {
            orderContent.innerHTML = `
                <div class="empty-icon">📄</div>
                <div class="empty-text">Chưa có món trong đơn</div>
                <div class="empty-subtitle">Vui lòng chọn món trong thực đơn bên trái màn hình</div>
            `;
        } else {
            currentOrder.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'order-item';

                div.innerHTML = `
                    <span>${item.name}</span>
                    <div>
                        <button class="decrease">➖</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase">➕</button>
                        <button class="remove">🗑️</button>
                    </div>
                    <div>${item.price * item.quantity}đ</div>
                `;

                div.querySelector('.decrease').addEventListener('click', () => changeQuantity(index, -1));
                div.querySelector('.increase').addEventListener('click', () => changeQuantity(index, 1));
                div.querySelector('.remove').addEventListener('click', () => removeItem(index));

                orderContent.appendChild(div);
            });
        }

        updateTotal();
        localStorage.setItem('orders', JSON.stringify(orders));
        updateTableStatus();
    }

    function updateTableStatus() {
        document.querySelectorAll('.table-card').forEach(card => {
            const tableNumber = Number(card.querySelector('.table-number').textContent);
            const order = orders[tableNumber] || [];
            if (order.length > 0) {
                card.classList.add('occupied');
            } else {
                card.classList.remove('occupied');
            }
        });
    }

    function changeQuantity(index, delta) {
        const order = orders[selectedTable];
        if (!order) return;
        order[index].quantity += delta;
        if (order[index].quantity <= 0) {
            order.splice(index, 1);
        }
        renderOrder();
    }

    function removeItem(index) {
        const order = orders[selectedTable];
        if (!order) return;
        order.splice(index, 1);
        renderOrder();
    }

    function updateTotal() {
        const currentOrder = orders[selectedTable] || [];
        const total = currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
        document.getElementById('totalAmount').textContent = total + 'đ';
    }

    fetch('/api/table')
        .then(res => res.json())
        .then(data => {
            data.forEach((table, index) => {
                const tableCard = document.createElement('div');
                tableCard.className = 'table-card';
                if (index === 0) tableCard.classList.add('selected');
                if (table.currentOrder && table.currentOrder.length > 0) {
                    tableCard.classList.add('occupied');
                }

                tableCard.innerHTML = `
                    <div class="table-icon"></div>
                    <div class="table-number">${table.tableNumber}</div>
                `;

                tableCard.addEventListener('click', () => {
                    document.querySelectorAll('.table-card').forEach(card => card.classList.remove('selected'));
                    tableCard.classList.add('selected');
                    selectedTable = table.tableNumber;
                    tableBadge.textContent = `🏠 Bàn ${table.tableNumber}`;

                    renderOrder();

                    const autoMenu = document.getElementById('autoMenu');
                    if (autoMenu && autoMenu.checked) {
                        showMenuTab();
                    }
                });

                tablesGrid.appendChild(tableCard);
            });
        })
        .catch(error => console.error('Lỗi tải danh sách bàn:', error));

    function renderMenuItems(container, menuItems) {
        container.innerHTML = '';
        menuItems.forEach(menu => {
            const menuCard = document.createElement('div');
            menuCard.className = 'menu-card';
            menuCard.innerHTML = `
                <div class="menu-icon">${menu.image || ''}</div>
                <div class="menu-name">${menu.name}</div>
                <div class="menu-price">${menu.price}</div>
            `;
            menuCard.addEventListener('click', () => {
                selectedMenu = menu;

                if (!orders[selectedTable]) {
                    orders[selectedTable] = [];
                }

                const existingItem = orders[selectedTable].find(item => item.name === menu.name);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    orders[selectedTable].push({
                        name: menu.name,
                        price: menu.price,
                        quantity: 1
                    });
                }

                renderOrder();
            });
            container.appendChild(menuCard);
        });
    }

    fetch('/api/menu')
        .then(res => res.json())
        .then(menuList => {
            const categories = [...new Set(menuList.map(menu => menu.category))];

            categoryGrid.innerHTML = '';
            categories.forEach((catName, index) => {
                const catBtn = document.createElement('button');
                catBtn.className = 'category-btn';
                if (index === 0) catBtn.classList.add('selected');
                catBtn.textContent = catName;

                catBtn.addEventListener('click', () => {
                    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('selected'));
                    catBtn.classList.add('selected');

                    const filteredMenus = menuList.filter(menu => menu.category === catName);
                    renderMenuItems(menuGrid, filteredMenus);
                });

                categoryGrid.appendChild(catBtn);

                if (index === 0) {
                    const filteredMenus = menuList.filter(menu => menu.category === catName);
                    renderMenuItems(menuGrid, filteredMenus);
                }
            });
        })
        .catch(error => console.error('Lỗi tải danh sách menu:', error));


    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const isTableTab = tab.textContent.includes('Phòng bàn');
            tablesGrid.style.display = isTableTab ? 'grid' : 'none';
            menuGrid.style.display = isTableTab ? 'none' : 'block';
            categoryGrid.style.display = isTableTab ? 'none' : 'block';
        });
    });

    function showMenuTab() {
        navTabs.forEach(t => t.classList.remove('active'));
        navTabs.forEach(t => {
            if (t.textContent.includes('Thực đơn')) {
                t.classList.add('active');
            }
        });
        tablesGrid.style.display = 'none';
        menuGrid.style.display = 'block';
        categoryGrid.style.display = 'block';
    }
});
