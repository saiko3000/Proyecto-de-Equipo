// ==================== MÓDULO DE INVENTARIO (CRUD COMPLETO) ====================

// Variables locales del módulo
let inventoryFilterCategory = '';
let inventorySearchTerm = '';
let currentEditingProduct = null;
let currentEditingTransaction = null;

// ==================== CRUD DE PRODUCTOS ====================

// CREATE - Agregar nuevo producto
function createProduct(productData) {
    const newProduct = {
        id: generateId(),
        name: productData.name,
        code: productData.code,
        category: productData.category,
        stock: parseInt(productData.stock) || 0,
        minStock: parseInt(productData.minStock) || 0,
        maxStock: parseInt(productData.maxStock) || 100,
        price: parseFloat(productData.price) || 0,
        location: productData.location || '',
        description: productData.description || ''
    };
    
    AppState.products.push(newProduct);
    saveToLocalStorage('products', AppState.products);
    return newProduct;
}

// READ - Obtener productos (con filtros)
function getProducts(filters = {}) {
    let filtered = [...AppState.products];
    
    if (filters.category && filters.category !== '') {
        filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.searchTerm && filters.searchTerm !== '') {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.code.toLowerCase().includes(term)
        );
    }
    
    if (filters.lowStock) {
        filtered = filtered.filter(p => p.stock <= p.minStock);
    }
    
    return filtered;
}

// UPDATE - Actualizar producto
function updateProduct(productId, productData) {
    const index = AppState.products.findIndex(p => p.id === productId);
    if (index === -1) return false;
    
    AppState.products[index] = {
        ...AppState.products[index],
        name: productData.name,
        code: productData.code,
        category: productData.category,
        stock: parseInt(productData.stock) || 0,
        minStock: parseInt(productData.minStock) || 0,
        maxStock: parseInt(productData.maxStock) || 100,
        price: parseFloat(productData.price) || 0,
        location: productData.location || '',
        description: productData.description || ''
    };
    
    saveToLocalStorage('products', AppState.products);
    return true;
}

// DELETE - Eliminar producto
function deleteProduct(productId) {
    const index = AppState.products.findIndex(p => p.id === productId);
    if (index === -1) return false;
    
    AppState.products.splice(index, 1);
    saveToLocalStorage('products', AppState.products);
    return true;
}

// ==================== CRUD DE TRANSACCIONES ====================

// CREATE - Registrar nueva transacción
function createTransaction(transactionData) {
    const product = AppState.products.find(p => p.id === transactionData.productId);
    if (!product) return null;
    
    const newTransaction = {
        id: generateId(),
        type: transactionData.type,
        productId: product.id,
        productName: product.name,
        productCode: product.code,
        quantity: parseInt(transactionData.quantity),
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        createdBy: AppState.currentUser.fullName,
        status: AppState.currentUser.role === 'admin' ? 'aprobada' : 'pendiente',
        reason: transactionData.reason || ''
    };
    
    AppState.transactions.push(newTransaction);
    
    // Si el usuario es admin, aplicar inmediatamente
    if (AppState.currentUser.role === 'admin') {
        if (newTransaction.type === 'entrada') {
            product.stock += newTransaction.quantity;
        } else {
            product.stock -= newTransaction.quantity;
        }
        saveToLocalStorage('products', AppState.products);
    }
    
    saveToLocalStorage('transactions', AppState.transactions);
    return newTransaction;
}

// READ - Obtener transacciones (con filtros)
function getTransactions(filters = {}) {
    let filtered = [...AppState.transactions];
    
    if (filters.status) {
        filtered = filtered.filter(t => t.status === filters.status);
    }
    
    if (filters.type) {
        filtered = filtered.filter(t => t.type === filters.type);
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// UPDATE - Actualizar transacción
function updateTransaction(transactionId, transactionData) {
    const index = AppState.transactions.findIndex(t => t.id === transactionId);
    if (index === -1) return false;
    
    const product = AppState.products.find(p => p.id === transactionData.productId);
    if (!product) return false;
    
    AppState.transactions[index] = {
        ...AppState.transactions[index],
        productId: product.id,
        productName: product.name,
        productCode: product.code,
        quantity: parseInt(transactionData.quantity),
        type: transactionData.type,
        reason: transactionData.reason || ''
    };
    
    saveToLocalStorage('transactions', AppState.transactions);
    return true;
}

// DELETE - Eliminar transacción
function deleteTransaction(transactionId) {
    const index = AppState.transactions.findIndex(t => t.id === transactionId);
    if (index === -1) return false;
    
    AppState.transactions.splice(index, 1);
    saveToLocalStorage('transactions', AppState.transactions);
    return true;
}

// Aprobar/Rechazar transacción
function approveTransaction(transactionId) {
    const transaction = AppState.transactions.find(t => t.id === transactionId);
    if (!transaction) return false;
    
    const product = AppState.products.find(p => p.id === transaction.productId);
    if (!product) return false;
    
    if (transaction.type === 'entrada') {
        product.stock += transaction.quantity;
    } else {
        product.stock -= transaction.quantity;
    }
    
    transaction.status = 'aprobada';
    
    saveToLocalStorage('products', AppState.products);
    saveToLocalStorage('transactions', AppState.transactions);
    return true;
}

function rejectTransaction(transactionId) {
    const transaction = AppState.transactions.findIndex(t => t.id === transactionId);
    if (transaction === -1) return false;
    
    AppState.transactions[transaction].status = 'rechazada';
    saveToLocalStorage('transactions', AppState.transactions);
    return true;
}

// ==================== INTERFAZ DEL MÓDULO ====================

function renderInventoryModule() {
    const content = document.getElementById('mainContent');
    
    content.innerHTML = `
        <div class="content-header-actions">
            <div>
                <h2>Gestión de Inventario</h2>
                <p class="text-muted">Administra productos y movimientos</p>
            </div>
            <button class="btn btn-primary" onclick="showProductModal()">
                <svg class="svg-icon" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nuevo Producto
            </button>
        </div>

        <div class="tabs">
            <div class="tab-list">
                <button class="tab-button active" data-tab="products">
                    📦 Productos
                </button>
                <button class="tab-button" data-tab="movements">
                    🔄 Movimientos
                </button>
            </div>

            <div id="productsTab" class="tab-content active">
                <div class="card" style="margin-bottom: 1rem;">
                    <div class="form-group" style="margin-bottom: 0; display: flex; gap: 1rem;">
                        <div style="flex: 1;">
                            <input type="text" id="productSearch" class="form-input" placeholder="Buscar por nombre o código..." oninput="filterInventory()">
                        </div>
                        <select id="categoryFilter" class="form-select" style="width: 200px;" onchange="filterInventory()">
                            <option value="">Todas las categorías</option>
                            ${AppConfig.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <div id="productsTableContainer"></div>
            </div>

            <div id="movementsTab" class="tab-content">
                <div class="content-header-actions" style="margin-bottom: 1rem;">
                    <div></div>
                    <button class="btn btn-primary" onclick="showTransactionModal()">
                        <svg class="svg-icon" viewBox="0 0 24 24">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Registrar Movimiento
                    </button>
                </div>
                <div id="transactionsTableContainer"></div>
            </div>
        </div>
    `;
    
    setupTabListeners();
    renderProductsTable();
    renderTransactionsTable();
}

function filterInventory() {
    inventorySearchTerm = document.getElementById('productSearch').value;
    inventoryFilterCategory = document.getElementById('categoryFilter').value;
    renderProductsTable();
}

function renderProductsTable() {
    const container = document.getElementById('productsTableContainer');
    const products = getProducts({ 
        searchTerm: inventorySearchTerm, 
        category: inventoryFilterCategory 
    });
    
    if (products.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><p>No se encontraron productos</p></div>';
        return;
    }
    
    let html = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Stock</th>
                        <th>Precio</th>
                        <th>Ubicación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    products.forEach(product => {
        const stockClass = product.stock <= product.minStock ? 'text-danger' : 'text-success';
        html += `
            <tr>
                <td><strong>${product.code}</strong></td>
                <td>${product.name}</td>
                <td><span class="badge badge-primary">${product.category}</span></td>
                <td class="${stockClass}"><strong>${product.stock}</strong> / ${product.maxStock}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.location}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-ghost" onclick="editProduct('${product.id}')" title="Editar">
                            <svg class="svg-icon" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="confirmDeleteProduct('${product.id}')" title="Eliminar">
                            <svg class="svg-icon" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function renderTransactionsTable() {
    const container = document.getElementById('transactionsTableContainer');
    const transactions = getTransactions();
    
    if (transactions.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔄</div><p>No hay movimientos registrados</p></div>';
        return;
    }
    
    let html = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Usuario</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    transactions.forEach(transaction => {
        const typeClass = transaction.type === 'entrada' ? 'badge-success' : 'badge-warning';
        const statusClass = transaction.status === 'aprobada' ? 'badge-success' : 
                           transaction.status === 'rechazada' ? 'badge-danger' : 'badge-warning';
        
        html += `
            <tr>
                <td>${formatDate(transaction.date)}</td>
                <td><span class="badge ${typeClass}">${transaction.type.toUpperCase()}</span></td>
                <td>${transaction.productName} <small>(${transaction.productCode})</small></td>
                <td><strong>${transaction.quantity}</strong></td>
                <td>${transaction.createdBy}</td>
                <td><span class="badge ${statusClass}">${transaction.status}</span></td>
                <td>
                    <div class="table-actions">
                        ${transaction.status === 'pendiente' && hasPermission('notifications') ? `
                            <button class="btn btn-sm btn-success" onclick="approveTransaction('${transaction.id}'); renderTransactionsTable();" title="Aprobar">✓</button>
                            <button class="btn btn-sm btn-danger" onclick="rejectTransaction('${transaction.id}'); renderTransactionsTable();" title="Rechazar">✗</button>
                        ` : ''}
                        <button class="btn btn-sm btn-ghost" onclick="editTransaction('${transaction.id}')" title="Editar">
                            <svg class="svg-icon" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="confirmDeleteTransaction('${transaction.id}')" title="Eliminar">
                            <svg class="svg-icon" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Mostrar modal de producto (crear/editar)
function showProductModal(productId = null) {
    currentEditingProduct = productId;
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    
    if (productId) {
        const product = AppState.products.find(p => p.id === productId);
        if (!product) return;
        
        title.textContent = 'Editar Producto';
        document.getElementById('productName').value = product.name;
        document.getElementById('productCode').value = product.code;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productMinStock').value = product.minStock;
        document.getElementById('productMaxStock').value = product.maxStock;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productLocation').value = product.location;
        document.getElementById('productDescription').value = product.description;
    } else {
        title.textContent = 'Nuevo Producto';
        document.getElementById('productForm').reset();
    }
    
    modal.classList.remove('hidden');
}

function editProduct(productId) {
    showProductModal(productId);
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
    currentEditingProduct = null;
}

function saveProduct() {
    const productData = {
        name: document.getElementById('productName').value,
        code: document.getElementById('productCode').value,
        category: document.getElementById('productCategory').value,
        stock: document.getElementById('productStock').value,
        minStock: document.getElementById('productMinStock').value,
        maxStock: document.getElementById('productMaxStock').value,
        price: document.getElementById('productPrice').value,
        location: document.getElementById('productLocation').value,
        description: document.getElementById('productDescription').value
    };
    
    if (!productData.name || !productData.code || !productData.category) {
        showToast('Por favor completa los campos requeridos', 'error');
        return;
    }
    
    if (currentEditingProduct) {
        updateProduct(currentEditingProduct, productData);
        showToast('Producto actualizado correctamente', 'success');
    } else {
        createProduct(productData);
        showToast('Producto creado correctamente', 'success');
    }
    
    closeProductModal();
    renderProductsTable();
}

function confirmDeleteProduct(productId) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        if (deleteProduct(productId)) {
            showToast('Producto eliminado correctamente', 'success');
            renderProductsTable();
        }
    }
}

// Transacciones
function showTransactionModal(transactionId = null) {
    currentEditingTransaction = transactionId;
    const modal = document.getElementById('transactionModal');
    const title = document.getElementById('transactionModalTitle');
    const productSelect = document.getElementById('transactionProduct');
    
    // Llenar select de productos
    productSelect.innerHTML = '<option value="">Selecciona un producto</option>';
    AppState.products.forEach(product => {
        productSelect.innerHTML += `<option value="${product.id}">${product.name} (${product.code})</option>`;
    });
    
    if (transactionId) {
        const transaction = AppState.transactions.find(t => t.id === transactionId);
        if (!transaction) return;
        
        title.textContent = 'Editar Movimiento';
        document.getElementById('transactionType').value = transaction.type;
        document.getElementById('transactionProduct').value = transaction.productId;
        document.getElementById('transactionQuantity').value = transaction.quantity;
        document.getElementById('transactionReason').value = transaction.reason;
    } else {
        title.textContent = 'Registrar Movimiento';
        document.getElementById('transactionForm').reset();
    }
    
    modal.classList.remove('hidden');
}

function editTransaction(transactionId) {
    showTransactionModal(transactionId);
}

function closeTransactionModal() {
    document.getElementById('transactionModal').classList.add('hidden');
    currentEditingTransaction = null;
}

function saveTransaction() {
    const transactionData = {
        type: document.getElementById('transactionType').value,
        productId: document.getElementById('transactionProduct').value,
        quantity: document.getElementById('transactionQuantity').value,
        reason: document.getElementById('transactionReason').value
    };
    
    if (!transactionData.productId || !transactionData.quantity) {
        showToast('Por favor completa los campos requeridos', 'error');
        return;
    }
    
    if (currentEditingTransaction) {
        updateTransaction(currentEditingTransaction, transactionData);
        showToast('Movimiento actualizado correctamente', 'success');
    } else {
        createTransaction(transactionData);
        showToast('Movimiento registrado correctamente', 'success');
    }
    
    closeTransactionModal();
    renderTransactionsTable();
}

function confirmDeleteTransaction(transactionId) {
    if (confirm('¿Estás seguro de eliminar este movimiento?')) {
        if (deleteTransaction(transactionId)) {
            showToast('Movimiento eliminado correctamente', 'success');
            renderTransactionsTable();
        }
    }
}
