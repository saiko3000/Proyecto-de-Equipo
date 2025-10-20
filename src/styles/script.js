// ==================== ESTADO GLOBAL ====================
const AppState = {
    currentUser: null,
    currentModule: 'inventory',
    sidebarCollapsed: false,
    recoveryStep: 'pin',
    products: [
        { id: '1', name: 'Martillo de Carpintero 16oz', code: 'MART-001', category: 'Herramientas', stock: 25, location: 'Pasillo A - Estante 2' },
        { id: '2', name: 'Cemento Gris 50kg', code: 'CEM-001', category: 'Construcción', stock: 45, location: 'Almacén Principal - Zona B' },
        { id: '3', name: 'Cable Eléctrico Calibre 12', code: 'CABL-001', category: 'Electricidad', stock: 8, location: 'Pasillo C - Estante 1' },
        { id: '4', name: 'Pintura Vinílica Blanca 19L', code: 'PINT-001', category: 'Pintura', stock: 22, location: 'Almacén Secundario - Zona A' },
        { id: '5', name: 'Tubería PVC 2" (6m)', code: 'TUB-045', category: 'Plomería', stock: 15, location: 'Pasillo B - Estante 3' }
    ],
    transactions: [
        { id: '1', type: 'entrada', productId: '1', productName: 'Martillo de Carpintero 16oz', productCode: 'MART-001', quantity: 10, date: '2024-10-10 10:30', createdBy: 'Pedro Almacén', status: 'pendiente', reason: 'Reabastecimiento semanal' },
        { id: '2', type: 'salida', productId: '3', productName: 'Cable Eléctrico Calibre 12', productCode: 'CABL-001', quantity: 5, date: '2024-10-10 09:15', createdBy: 'Pedro Almacén', status: 'pendiente', reason: 'Pedido especial cliente #45' }
    ],
    employees: [
        { id: '1', name: 'Juan Pérez García', position: 'Gerente', email: 'juan.perez@ferreteria.com', phone: '555-1234', salary: 15000, status: 'active', hireDate: '2022-01-15' },
        { id: '2', name: 'María López Hernández', position: 'Cajero', email: 'maria.lopez@ferreteria.com', phone: '555-5678', salary: 8000, status: 'active', hireDate: '2023-03-20' },
        { id: '3', name: 'Carlos Ramírez Díaz', position: 'Almacenista', email: 'carlos.ramirez@ferreteria.com', phone: '555-9012', salary: 9000, status: 'active', hireDate: '2023-06-10' },
        { id: '4', name: 'Ana Martínez Soto', position: 'Vendedor', email: 'ana.martinez@ferreteria.com', phone: '555-3456', salary: 7500, status: 'inactive', hireDate: '2021-11-05' }
    ],
    notifications: []
};

const AppConfig = {
    users: [
        { username: 'administrador', password: 'admin123', role: 'admin', fullName: 'Administrador del Sistema' },
        { username: 'supervisor', password: 'super123', role: 'cashier', fullName: 'Supervisor de Inventario' },
        { username: 'almacenista', password: 'almacen123', role: 'warehouse', fullName: 'Encargado de Almacén' }
    ],
    rolePermissions: {
        admin: ['inventory', 'reports', 'employees', 'notifications'],
        cashier: ['inventory', 'reports'],
        warehouse: ['inventory', 'reports']
    },
    ADMIN_PIN: '1234'
};

// ==================== UTILIDADES ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    
    const icons = { success: '✓', error: '✗', info: 'ℹ' };
    
    toast.innerHTML = '<span class="toast-icon">' + (icons[type] || icons.info) + '</span>' +
                    '<span class="toast-message">' + message + '</span>';
    
    container.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
}

// ==================== LOGIN ====================
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = AppConfig.users.find(function(u) {
        return u.username === username && u.password === password;
    });
    
    if (user) {
        AppState.currentUser = {
            username: user.username,
            role: user.role,
            fullName: user.fullName,
            email: '',
            phone: '',
            address: ''
        };
        showToast('¡Bienvenido, ' + user.fullName + '!');
        showMainApp();
    } else {
        showToast('Usuario o contraseña incorrectos', 'error');
    }
});

function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    document.getElementById('userName').textContent = AppState.currentUser.fullName;
    var roleText = AppState.currentUser.role === 'admin' ? 'Administrador' : 
                  AppState.currentUser.role === 'cashier' ? 'Supervisor' : 'Almacenista';
    document.getElementById('userRole').textContent = roleText;
    
    var editBtn = document.getElementById('editProfileBtn');
    // Si no es admin, muestra el botón. Si es admin, lo oculta.
    editBtn.style.display = AppState.currentUser.role === 'admin' ? 'none' : 'flex'; 
    
    renderSidebar();
    renderContent();
}

// ==================== SIDEBAR ====================
function renderSidebar() {
    var nav = document.getElementById('sidebarNav');
    var modules = [
        { id: 'inventory', name: 'Inventario', icon: '📦' },
        { id: 'reports', name: 'Reportes', icon: '📊' },
        { id: 'employees', name: 'Empleados', icon: '👥' },
        { id: 'notifications', name: 'Notificaciones', icon: '🔔' }
    ];
    
    var allowedModules = modules.filter(function(m) {
        return AppConfig.rolePermissions[AppState.currentUser.role].indexOf(m.id) !== -1;
    });
    
    nav.innerHTML = allowedModules.map(function(module) {
        var pendingCount = module.id === 'notifications' ? 
            AppState.notifications.filter(function(n) { return n.status === 'pendiente'; }).length : 0;
        var badge = pendingCount > 0 ? '<span class="nav-badge">' + pendingCount + '</span>' : '';
        var isActive = AppState.currentModule === module.id ? 'active' : '';
        
        return '<button class="nav-item ' + isActive + '" onclick="changeModule(\'' + module.id + '\')">' +
               '<span class="nav-icon">' + module.icon + '</span>' +
               '<span class="nav-text">' + module.name + '</span>' +
               badge +
               '</button>';
    }).join('');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
    AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
}

function changeModule(moduleId) {
    AppState.currentModule = moduleId;
    renderSidebar();
    renderContent();
}

// ==================== CONTENIDO PRINCIPAL ====================
function renderContent() {
    switch(AppState.currentModule) {
        case 'inventory':
            renderInventory();
            break;
        case 'reports':
            renderReports();
            break;
        case 'employees':
            renderEmployees();
            break;
        case 'notifications':
            renderNotifications();
            break;
    }
}

// ==================== INVENTARIO (Lógica de Vistas) ====================
function renderInventory() {
    var content = document.getElementById('mainContent');
    var role = AppState.currentUser.role;
    
    // VISTA ALMACENISTA (Gestión de Stock)
    if (role === 'warehouse') {
        content.innerHTML = '<div class="content-header">' +
            '<h2>Gestión de Inventario - Almacenista</h2>' +
            '<p class="text-muted">Registra entradas, salidas y transferencias de mercancía</p>' +
            '</div>' +
            '<div class="tabs">' +
            '<div class="tab-list">' +
            '<button class="tab-button active" onclick="switchTab(event, \'view\')">📦 Ver Inventario</button>' +
            '<button class="tab-button" onclick="switchTab(event, \'entry\')">➕ Entrada</button>' +
            '<button class="tab-button" onclick="switchTab(event, \'exit\')">➖ Salida</button>' +
            '<button class="tab-button" onclick="switchTab(event, \'transfer\')">🔄 Transferencias</button>' +
            '</div>' +
            '<div class="tab-content active" id="tab-view">' + renderInventoryTable() + '</div>' +
            '<div class="tab-content" id="tab-entry">' + renderEntryForm() + '</div>' +
            '<div class="tab-content" id="tab-exit">' + renderExitForm() + '</div>' +
            '<div class="tab-content" id="tab-transfer">' + renderTransferForm() + '</div>' +
            '</div>';
    } 
    // VISTA SUPERVISOR (Aprobación de Transacciones)
    else if (role === 'cashier') {
        var pendingCount = AppState.transactions.filter(function(t) { return t.status === 'pendiente'; }).length;
        var pendingBadge = pendingCount > 0 ? '<span class="badge badge-danger">' + pendingCount + '</span>' : '';
        
        content.innerHTML = '<div class="content-header">' +
            '<h2>Gestión de Inventario - Supervisor</h2>' +
            '<p class="text-muted">Aprueba transacciones y realiza ajustes</p>' +
            '</div>' +
            '<div class="tabs">' +
            '<div class="tab-list">' +
            '<button class="tab-button active" onclick="switchTab(event, \'view\')">📦 Ver Inventario</button>' +
            '<button class="tab-button" onclick="switchTab(event, \'approve\')">✓ Aprobar ' + pendingBadge + '</button>' +
            '</div>' +
            '<div class="tab-content active" id="tab-view">' + renderInventoryTable() + '</div>' +
            '<div class="tab-content" id="tab-approve">' + renderApprovalTable() + '</div>' +
            '</div>';
    } 
    // VISTA ADMIN (Solo tabla)
    else {
        content.innerHTML = '<div class="content-header">' +
            '<h2>Gestión de Inventario</h2>' +
            '<p class="text-muted">Vista general del inventario</p>' +
            '</div>' + renderInventoryTable();
    }
    
    attachInventoryListeners();
}

function renderInventoryTable() {
    // ... (Código para generar la tabla de inventario)
    return '<div class="table-container">' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th>Código</th>' +
        '<th>Producto</th>' +
        '<th>Categoría</th>' +
        '<th>Stock</th>' +
        '<th>Ubicación</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        AppState.products.map(function(p) {
            return '<tr>' +
                '<td>' + p.code + '</td>' +
                '<td>' + p.name + '</td>' +
                '<td>' + p.category + '</td>' +
                '<td><span class="badge badge-primary">' + p.stock + ' unidades</span></td>' +
                '<td>📍 ' + p.location + '</td>' +
                '</tr>';
        }).join('') +
        '</tbody>' +
        '</table>' +
        '</div>';
}

function renderEntryForm() {
    // ... (Código para generar el formulario de entrada)
    return '<div class="card">' +
        '<h3>Nueva Entrada de Mercancía</h3>' +
        '<form id="entryForm" style="margin-top: 1.5rem;">' +
        '<div class="form-group">' +
        '<label class="form-label">Producto *</label>' +
        '<select class="form-select" id="entryProduct" required>' +
        '<option value="">Selecciona un producto</option>' +
        AppState.products.map(function(p) {
            return '<option value="' + p.id + '">' + p.code + ' - ' + p.name + '</option>';
        }).join('') +
        '</select>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="form-label">Cantidad *</label>' +
        '<input type="number" class="form-input" id="entryQuantity" min="1" required>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="form-label">Motivo *</label>' +
        '<textarea class="form-textarea" id="entryReason" placeholder="Ej: Reabastecimiento semanal" required></textarea>' +
        '</div>' +
        '<button type="submit" class="btn btn-primary">➕ Registrar Entrada</button>' +
        '</form>' +
        '</div>';
}

function renderExitForm() {
    // ... (Código para generar el formulario de salida)
    return '<div class="card">' +
        '<h3>Nueva Salida de Mercancía</h3>' +
        '<form id="exitForm" style="margin-top: 1.5rem;">' +
        '<div class="form-group">' +
        '<label class="form-label">Producto *</label>' +
        '<select class="form-select" id="exitProduct" required>' +
        '<option value="">Selecciona un producto</option>' +
        AppState.products.map(function(p) {
            return '<option value="' + p.id + '">' + p.code + ' - ' + p.name + ' (Stock: ' + p.stock + ')</option>';
        }).join('') +
        '</select>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="form-label">Cantidad *</label>' +
        '<input type="number" class="form-input" id="exitQuantity" min="1" required>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="form-label">Motivo *</label>' +
        '<textarea class="form-textarea" id="exitReason" placeholder="Ej: Venta directa" required></textarea>' +
        '</div>' +
        '<button type="submit" class="btn btn-primary">➖ Registrar Salida</button>' +
        '</form>' +
        '</div>';
}

function renderTransferForm() {
    // ... (Código para generar el formulario de transferencia)
    return '<div class="card">' +
        '<h3>Nueva Transferencia</h3>' +
        '<form id="transferForm" style="margin-top: 1.5rem;">' +
        '<div class="form-group">' +
        '<label class="form-label">Producto *</label>' +
        '<select class="form-select" id="transferProduct" required>' +
        '<option value="">Selecciona un producto</option>' +
        AppState.products.map(function(p) {
            return '<option value="' + p.id + '">' + p.code + ' - ' + p.name + '</option>';
        }).join('') +
        '</select>' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="form-label">Ubicación Destino *</label>' +
        '<input type="text" class="form-input" id="transferLocation" placeholder="Ej: Pasillo C - Estante 2" required>' +
        '</div>' +
        '<button type="submit" class="btn btn-primary">🔄 Realizar Transferencia</button>' +
        '</form>' +
        '</div>';
}

function renderApprovalTable() {
    // ... (Código para generar la tabla de aprobación de transacciones)
    var pending = AppState.transactions.filter(function(t) { return t.status === 'pendiente'; });
    
    if (pending.length === 0) {
        return '<div class="empty-state">' +
            '<div class="empty-state-icon">✓</div>' +
            '<h3>No hay transacciones pendientes</h3>' +
            '<p>Todas las transacciones han sido procesadas</p>' +
            '</div>';
    }
    
    return '<div class="table-container">' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th>Tipo</th>' +
        '<th>Producto</th>' +
        '<th>Cantidad</th>' +
        '<th>Fecha</th>' +
        '<th>Creado por</th>' +
        '<th>Motivo</th>' +
        '<th>Acciones</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        pending.map(function(t) {
            var typeClass = t.type === 'entrada' ? 'badge-success' : 'badge-warning';
            var typeText = t.type === 'entrada' ? 'Entrada' : 'Salida';
            var quantityClass = t.type === 'entrada' ? 'text-success' : 'text-warning';
            var quantitySign = t.type === 'entrada' ? '+' : '-';
            
            return '<tr>' +
                '<td><span class="badge ' + typeClass + '">' + typeText + '</span></td>' +
                '<td>' + t.productCode + ' - ' + t.productName + '</td>' +
                '<td class="' + quantityClass + '">' + quantitySign + t.quantity + '</td>' +
                '<td>' + t.date + '</td>' +
                '<td>' + t.createdBy + '</td>' +
                '<td>' + t.reason + '</td>' +
                '<td>' +
                '<div class="table-actions">' +
                '<button class="btn btn-success btn-sm" onclick="approveTransaction(\'' + t.id + '\')">✓</button>' +
                '<button class="btn btn-danger btn-sm" onclick="rejectTransaction(\'' + t.id + '\')">✗</button>' +
                '</div>' +
                '</td>' +
                '</tr>';
        }).join('') +
        '</tbody>' +
        '</table>' +
        '</div>';
}

function attachInventoryListeners() {
    var entryForm = document.getElementById('entryForm');
    if (entryForm) {
        entryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var productId = document.getElementById('entryProduct').value;
            var quantity = parseInt(document.getElementById('entryQuantity').value);
            var reason = document.getElementById('entryReason').value;
            
            var product = AppState.products.find(function(p) { return p.id === productId; });
            
            AppState.transactions.push({
                id: String(AppState.transactions.length + 1),
                type: 'entrada',
                productId: product.id,
                productName: product.name,
                productCode: product.code,
                quantity: quantity,
                date: new Date().toLocaleString('es-MX'),
                createdBy: AppState.currentUser.fullName,
                status: 'pendiente',
                reason: reason
            });
            
            showToast('Entrada registrada. Pendiente de aprobación del supervisor.');
            entryForm.reset();
        });
    }
    
    var exitForm = document.getElementById('exitForm');
    if (exitForm) {
        exitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var productId = document.getElementById('exitProduct').value;
            var quantity = parseInt(document.getElementById('exitQuantity').value);
            var reason = document.getElementById('exitReason').value;
            
            var product = AppState.products.find(function(p) { return p.id === productId; });
            
            if (quantity > product.stock) {
                showToast('La cantidad excede el stock disponible', 'error');
                return;
            }
            
            AppState.transactions.push({
                id: String(AppState.transactions.length + 1),
                type: 'salida',
                productId: product.id,
                productName: product.name,
                productCode: product.code,
                quantity: quantity,
                date: new Date().toLocaleString('es-MX'),
                createdBy: AppState.currentUser.fullName,
                status: 'pendiente',
                reason: reason
            });
            
            showToast('Salida registrada. Pendiente de aprobación del supervisor.');
            exitForm.reset();
        });
    }
    
    var transferForm = document.getElementById('transferForm');
    if (transferForm) {
        transferForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var productId = document.getElementById('transferProduct').value;
            var location = document.getElementById('transferLocation').value;
            
            var product = AppState.products.find(function(p) { return p.id === productId; });
            product.location = location;
            
            showToast('Transferencia completada: ' + product.name + ' movido a ' + location);
            transferForm.reset();
        });
    }
}

function approveTransaction(id) {
    var transaction = AppState.transactions.find(function(t) { return t.id === id; });
    var product = AppState.products.find(function(p) { return p.id === transaction.productId; });
    
    if (transaction.type === 'entrada') {
        product.stock += transaction.quantity;
    } else {
        product.stock -= transaction.quantity;
    }
    
    transaction.status = 'aprobada';
    showToast('Transacción aprobada y stock actualizado');
    renderContent();
}

function rejectTransaction(id) {
    var transaction = AppState.transactions.find(function(t) { return t.id === id; });
    transaction.status = 'rechazada';
    showToast('Transacción rechazada', 'info');
    renderContent();
}

// ==================== REPORTES ====================
function renderReports() {
    var content = document.getElementById('mainContent');
    
    content.innerHTML = '<div class="content-header">' +
        '<h2>Reportes de Inventario</h2>' +
        '<p class="text-muted">Analiza el estado y movimientos del inventario</p>' +
        '</div>' +
        '<div class="kpi-grid">' +
        '<div class="kpi-card">' +
        '<div class="kpi-header">' +
        '<span class="kpi-label">Valor Total</span>' +
        '<span class="kpi-icon" style="color: var(--success);">💰</span>' +
        '</div>' +
        '<div class="kpi-value">' + formatCurrency(584000) + '</div>' +
        '<div class="kpi-description">1,420 productos</div>' +
        '</div>' +
        '<div class="kpi-card">' +
        '<div class="kpi-header">' +
        '<span class="kpi-label">Stock Bajo</span>' +
        '<span class="kpi-icon" style="color: var(--warning);">⚠️</span>' +
        '</div>' +
        '<div class="kpi-value">5</div>' +
        '<div class="kpi-description">Requieren reabastecimiento</div>' +
        '</div>' +
        '<div class="kpi-card">' +
        '<div class="kpi-header">' +
        '<span class="kpi-label">Movimientos</span>' +
        '<span class="kpi-icon" style="color: var(--primary);">📦</span>' +
        '</div>' +
        '<div class="kpi-value">433</div>' +
        '<div class="kpi-description">Últimos 7 días</div>' +
        '</div>' +
        '<div class="kpi-card">' +
        '<div class="kpi-header">' +
        '<span class="kpi-label">Categorías</span>' +
        '<span class="kpi-icon" style="color: #8b5cf6;">📊</span>' +
        '</div>' +
        '<div class="kpi-value">6</div>' +
        '<div class="kpi-description">Categorías activas</div>' +
        '</div>' +
        '</div>' +
        '<div class="table-container">' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th>Código</th>' +
        '<th>Producto</th>' +
        '<th>Stock Actual</th>' +
        '<th>Stock Mínimo</th>' +
        '<th>Estado</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr>' +
        '<td>CABL-001</td>' +
        '<td>Cable Eléctrico Calibre 12</td>' +
        '<td class="text-warning">8</td>' +
        '<td>20</td>' +
        '<td><span class="badge badge-warning">Bajo</span></td>' +
        '</tr>' +
        '<tr>' +
        '<td>TUB-045</td>' +
        '<td>Tubería PVC 2" (6m)</td>' +
        '<td class="text-danger">6</td>' +
        '<td>18</td>' +
        '<td><span class="badge badge-danger">Crítico</span></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';
}

// ==================== EMPLEADOS ====================
function renderEmployees() {
    var content = document.getElementById('mainContent');
    var activeEmployees = AppState.employees.filter(function(e) { return e.status === 'active'; });
    var totalSalary = activeEmployees.reduce(function(sum, e) { return sum + e.salary; }, 0);
    var avgSalary = AppState.employees.reduce(function(sum, e) { return sum + e.salary; }, 0) / AppState.employees.length;
    
    content.innerHTML = '<div class="content-header-actions">' +
        '<div>' +
        '<h2>Gestión de Empleados</h2>' +
        '<p class="text-muted">Administra el personal de la ferretería</p>' +
        '</div>' +
        '<button class="btn btn-primary" onclick="showToast(\'Función en desarrollo\', \'info\')">➕ Nuevo Empleado</button>' +
        '</div>' +
        '<div class="table-container">' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th>Nombre</th>' +
        '<th>Puesto</th>' +
        '<th>Email</th>' +
        '<th>Teléfono</th>' +
        '<th>Salario</th>' +
        '<th>Estado</th>' +
        '<th>Acciones</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        AppState.employees.map(function(emp) {
            var statusClass = emp.status === 'active' ? 'badge-success' : 'badge-warning';
            var statusText = emp.status === 'active' ? 'Activo' : 'Inactivo';
            
            return '<tr>' +
                '<td>' + emp.name + '</td>' +
                '<td>' + emp.position + '</td>' +
                '<td>' + emp.email + '</td>' +
                '<td>' + emp.phone + '</td>' +
                '<td>' + formatCurrency(emp.salary) + '</td>' +
                '<td><span class="badge ' + statusClass + '">' + statusText + '</span></td>' +
                '<td>' +
                '<div class="table-actions">' +
                '<button class="btn btn-ghost btn-sm" onclick="showToast(\'Función en desarrollo\', \'info\')">✏️</button>' +
                '<button class="btn btn-ghost btn-sm" onclick="deleteEmployee(\'' + emp.id + '\')">🗑️</button>' +
                '</div>' +
                '</td>' +
                '</tr>';
        }).join('') +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<div class="kpi-grid">' +
        '<div class="kpi-card">' +
        '<div class="kpi-label">Total Empleados</div>' +
        '<div class="kpi-value" style="font-size: 1.5rem;">' + AppState.employees.length + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
        '<div class="kpi-label">Empleados Activos</div>' +
        '<div class="kpi-value" style="font-size: 1.5rem;">' + activeEmployees.length + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
        '<div class="kpi-label">Nómina Mensual</div>' +
        '<div class="kpi-value" style="font-size: 1.5rem;">' + formatCurrency(totalSalary) + '</div>' +
        '</div>' +
        '<div class="kpi-card">' +
        '<div class="kpi-label">Salario Promedio</div>' +
        '<div class="kpi-value" style="font-size: 1.5rem;">' + formatCurrency(avgSalary) + '</div>' +
        '</div>' +
        '</div>';
}

function deleteEmployee(id) {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
        AppState.employees = AppState.employees.filter(function(e) { return e.id !== id; });
        showToast('Empleado eliminado correctamente');
        renderContent();
    }
}

// ==================== NOTIFICACIONES ====================
function renderNotifications() {
    var content = document.getElementById('mainContent');
    
    content.innerHTML = '<div class="content-header">' +
        '<h2>🔔 Notificaciones</h2>' +
        '<p class="text-muted">Gestiona las solicitudes de recuperación de contraseña</p>' +
        '</div>' +
        '<div class="empty-state">' +
        '<div class="empty-state-icon">🔔</div>' +
        '<h3>No hay solicitudes pendientes</h3>' +
        '<p>Todas las solicitudes de recuperación han sido procesadas</p>' +
        '</div>';
}

// ==================== TABS ====================
function switchTab(event, tabName) {
    var tabButtons = event.target.closest('.tab-list').querySelectorAll('.tab-button');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    event.target.classList.add('active');
    
    var tabContents = event.target.closest('.tabs').querySelectorAll('.tab-content');
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    var selectedTab = document.getElementById('tab-' + tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// ==================== RECUPERACIÓN DE CONTRASEÑA ====================
function showPasswordRecovery() {
    document.getElementById('passwordRecoveryModal').classList.remove('hidden');
    AppState.recoveryStep = 'pin';
    updateRecoveryModal();
}

function closePasswordRecovery() {
    document.getElementById('passwordRecoveryModal').classList.add('hidden');
    document.getElementById('adminPin').value = '';
    document.getElementById('recoveryUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

function updateRecoveryModal() {
    var pinStep = document.getElementById('pinStep');
    var passwordStep = document.getElementById('passwordStep');
    var title = document.getElementById('recoveryModalTitle');
    var actionBtn = document.getElementById('recoveryActionBtn');
    
    if (AppState.recoveryStep === 'pin') {
        pinStep.classList.remove('hidden');
        passwordStep.classList.add('hidden');
        title.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24">' +
            '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>' +
            '</svg> Validación de Seguridad';
        actionBtn.textContent = 'Validar PIN';
    } else {
        pinStep.classList.add('hidden');
        passwordStep.classList.remove('hidden');
        title.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24">' +
            '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>' +
            '</svg> Cambiar Contraseña';
        actionBtn.textContent = 'Cambiar Contraseña';
    }
}

function handleRecoveryAction() {
    if (AppState.recoveryStep === 'pin') {
        var pin = document.getElementById('adminPin').value;
        
        if (!pin) {
            showToast('Por favor ingresa el PIN de seguridad', 'error');
            return;
        }
        
        if (pin === AppConfig.ADMIN_PIN) {
            showToast('PIN validado correctamente');
            AppState.recoveryStep = 'password';
            updateRecoveryModal();
        } else {
            showToast('PIN de seguridad inválido. No se puede acceder al formulario de cambio de contraseña.', 'error');
        }
    } else {
        var username = document.getElementById('recoveryUsername').value;
        var newPassword = document.getElementById('newPassword').value;
        var confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!username || !newPassword || !confirmPassword) {
            showToast('Por favor completa todos los campos', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showToast('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        // Simulación de cambio de contraseña exitoso (sin backend)
        showToast('Contraseña cambiada exitosamente. Puedes iniciar sesión con tu nueva contraseña.');
        closePasswordRecovery();
    }
}

// ==================== LOGOUT ====================
function showLogoutDialog() {
    document.getElementById('logoutDialog').classList.remove('hidden');
}

function closeLogoutDialog() {
    document.getElementById('logoutDialog').classList.add('hidden');
}

function confirmLogout() {
    showToast('Sesión cerrada correctamente. ¡Hasta pronto!');
    AppState.currentUser = null;
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    closeLogoutDialog();
}

// ==================== EDITAR PERFIL ====================
function showEditProfile() {
    document.getElementById('editProfileModal').classList.remove('hidden');
    document.getElementById('profileName').value = AppState.currentUser.fullName;
    document.getElementById('profileEmail').value = AppState.currentUser.email || '';
    document.getElementById('profilePhone').value = AppState.currentUser.phone || '';
    document.getElementById('profileAddress').value = AppState.currentUser.address || '';
}

function closeEditProfile() {
    document.getElementById('editProfileModal').classList.add('hidden');
}

function saveProfile() {
    var name = document.getElementById('profileName').value;
    
    if (!name) {
        showToast('El nombre completo es obligatorio', 'error');
        return;
    }
    
    AppState.currentUser.fullName = name;
    AppState.currentUser.email = document.getElementById('profileEmail').value;
    AppState.currentUser.phone = document.getElementById('profilePhone').value;
    AppState.currentUser.address = document.getElementById('profileAddress').value;
    
    document.getElementById('userName').textContent = name;
    
    showToast('Perfil actualizado correctamente');
    closeEditProfile();
}