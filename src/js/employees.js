// ==================== MÓDULO DE EMPLEADOS (CRUD COMPLETO) ====================

let currentEditingEmployee = null;

// ==================== CRUD DE EMPLEADOS ====================

// CREATE - Agregar nuevo empleado
function createEmployee(employeeData) {
    const newEmployee = {
        id: generateId(),
        name: employeeData.name,
        position: employeeData.position,
        email: employeeData.email || '',
        phone: employeeData.phone || '',
        salary: parseFloat(employeeData.salary) || 0,
        status: employeeData.status || 'active',
        hireDate: employeeData.hireDate || new Date().toISOString().split('T')[0],
        address: employeeData.address || ''
    };
    
    AppState.employees.push(newEmployee);
    saveToLocalStorage('employees', AppState.employees);
    return newEmployee;
}

// READ - Obtener empleados (con filtros)
function getEmployees(filters = {}) {
    let filtered = [...AppState.employees];
    
    if (filters.status) {
        filtered = filtered.filter(e => e.status === filters.status);
    }
    
    if (filters.searchTerm && filters.searchTerm !== '') {
        const term = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(e => 
            e.name.toLowerCase().includes(term) || 
            e.position.toLowerCase().includes(term) ||
            e.email.toLowerCase().includes(term)
        );
    }
    
    return filtered;
}

// UPDATE - Actualizar empleado
function updateEmployee(employeeId, employeeData) {
    const index = AppState.employees.findIndex(e => e.id === employeeId);
    if (index === -1) return false;
    
    AppState.employees[index] = {
        ...AppState.employees[index],
        name: employeeData.name,
        position: employeeData.position,
        email: employeeData.email || '',
        phone: employeeData.phone || '',
        salary: parseFloat(employeeData.salary) || 0,
        status: employeeData.status || 'active',
        hireDate: employeeData.hireDate || AppState.employees[index].hireDate,
        address: employeeData.address || ''
    };
    
    saveToLocalStorage('employees', AppState.employees);
    return true;
}

// DELETE - Eliminar empleado
function deleteEmployee(employeeId) {
    const index = AppState.employees.findIndex(e => e.id === employeeId);
    if (index === -1) return false;
    
    AppState.employees.splice(index, 1);
    saveToLocalStorage('employees', AppState.employees);
    return true;
}

// ==================== INTERFAZ DEL MÓDULO ====================

function renderEmployeesModule() {
    const content = document.getElementById('mainContent');
    
    content.innerHTML = `
        <div class="content-header-actions">
            <div>
                <h2>Gestión de Empleados</h2>
                <p class="text-muted">Administra el personal de la ferretería</p>
            </div>
            <button class="btn btn-primary" onclick="showEmployeeModal()">
                <svg class="svg-icon" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nuevo Empleado
            </button>
        </div>

        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-header">
                    <span class="kpi-label">Total Empleados</span>
                    <span class="kpi-icon">👥</span>
                </div>
                <div class="kpi-value">${AppState.employees.length}</div>
                <div class="kpi-description">Personal registrado</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-header">
                    <span class="kpi-label">Empleados Activos</span>
                    <span class="kpi-icon">✓</span>
                </div>
                <div class="kpi-value">${AppState.employees.filter(e => e.status === 'active').length}</div>
                <div class="kpi-description">En servicio actualmente</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-header">
                    <span class="kpi-label">Nómina Total</span>
                    <span class="kpi-icon">💰</span>
                </div>
                <div class="kpi-value">${formatCurrency(AppState.employees.filter(e => e.status === 'active').reduce((sum, e) => sum + e.salary, 0))}</div>
                <div class="kpi-description">Salarios mensuales</div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 1rem;">
            <div class="form-group" style="margin-bottom: 0; display: flex; gap: 1rem;">
                <div style="flex: 1;">
                    <input type="text" id="employeeSearch" class="form-input" placeholder="Buscar por nombre, puesto o email..." oninput="filterEmployees()">
                </div>
                <select id="statusFilter" class="form-select" style="width: 200px;" onchange="filterEmployees()">
                    <option value="">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                </select>
            </div>
        </div>

        <div id="employeesTableContainer"></div>
    `;
    
    renderEmployeesTable();
}

let employeeSearchTerm = '';
let employeeStatusFilter = '';

function filterEmployees() {
    employeeSearchTerm = document.getElementById('employeeSearch').value;
    employeeStatusFilter = document.getElementById('statusFilter').value;
    renderEmployeesTable();
}

function renderEmployeesTable() {
    const container = document.getElementById('employeesTableContainer');
    const employees = getEmployees({ 
        searchTerm: employeeSearchTerm, 
        status: employeeStatusFilter 
    });
    
    if (employees.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👥</div><p>No se encontraron empleados</p></div>';
        return;
    }
    
    let html = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Puesto</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Salario</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    employees.forEach(employee => {
        const statusClass = employee.status === 'active' ? 'badge-success' : 'badge-danger';
        const statusText = employee.status === 'active' ? 'Activo' : 'Inactivo';
        
        html += `
            <tr>
                <td><strong>${employee.name}</strong></td>
                <td>${employee.position}</td>
                <td>${employee.email}</td>
                <td>${employee.phone}</td>
                <td>${formatCurrency(employee.salary)}</td>
                <td><span class="badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-ghost" onclick="editEmployee('${employee.id}')" title="Editar">
                            <svg class="svg-icon" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-ghost" onclick="confirmDeleteEmployee('${employee.id}')" title="Eliminar">
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

// Mostrar modal de empleado (crear/editar)
function showEmployeeModal(employeeId = null) {
    currentEditingEmployee = employeeId;
    const modal = document.getElementById('employeeModal');
    const title = document.getElementById('employeeModalTitle');
    
    if (employeeId) {
        const employee = AppState.employees.find(e => e.id === employeeId);
        if (!employee) return;
        
        title.textContent = 'Editar Empleado';
        document.getElementById('employeeName').value = employee.name;
        document.getElementById('employeePosition').value = employee.position;
        document.getElementById('employeeEmail').value = employee.email;
        document.getElementById('employeePhone').value = employee.phone;
        document.getElementById('employeeSalary').value = employee.salary;
        document.getElementById('employeeStatus').value = employee.status;
        document.getElementById('employeeHireDate').value = employee.hireDate;
        document.getElementById('employeeAddress').value = employee.address;
    } else {
        title.textContent = 'Nuevo Empleado';
        document.getElementById('employeeForm').reset();
        document.getElementById('employeeStatus').value = 'active';
        document.getElementById('employeeHireDate').value = new Date().toISOString().split('T')[0];
    }
    
    modal.classList.remove('hidden');
}

function editEmployee(employeeId) {
    showEmployeeModal(employeeId);
}

function closeEmployeeModal() {
    document.getElementById('employeeModal').classList.add('hidden');
    currentEditingEmployee = null;
}

function saveEmployee() {
    const employeeData = {
        name: document.getElementById('employeeName').value,
        position: document.getElementById('employeePosition').value,
        email: document.getElementById('employeeEmail').value,
        phone: document.getElementById('employeePhone').value,
        salary: document.getElementById('employeeSalary').value,
        status: document.getElementById('employeeStatus').value,
        hireDate: document.getElementById('employeeHireDate').value,
        address: document.getElementById('employeeAddress').value
    };
    
    if (!employeeData.name || !employeeData.position) {
        showToast('Por favor completa los campos requeridos', 'error');
        return;
    }
    
    if (currentEditingEmployee) {
        updateEmployee(currentEditingEmployee, employeeData);
        showToast('Empleado actualizado correctamente', 'success');
    } else {
        createEmployee(employeeData);
        showToast('Empleado creado correctamente', 'success');
    }
    
    closeEmployeeModal();
    renderEmployeesModule();
}

function confirmDeleteEmployee(employeeId) {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
        if (deleteEmployee(employeeId)) {
            showToast('Empleado eliminado correctamente', 'success');
            renderEmployeesModule();
        }
    }
}
