// ==================== ESTADO GLOBAL ====================
const AppState = {
    currentUser: null,
    currentModule: 'inventory',
    sidebarCollapsed: false,
    recoveryStep: 'pin',
    products: [
        { id: '1', name: 'Martillo de Carpintero 16oz', code: 'MART-001', category: 'Herramientas', stock: 25, minStock: 10, maxStock: 50, price: 299.99, location: 'Pasillo A - Estante 2', description: 'Martillo profesional de carpintero' },
        { id: '2', name: 'Cemento Gris 50kg', code: 'CEM-001', category: 'Construcción', stock: 45, minStock: 20, maxStock: 100, price: 189.50, location: 'Almacén Principal - Zona B', description: 'Cemento de alta resistencia' },
        { id: '3', name: 'Cable Eléctrico Calibre 12', code: 'CABL-001', category: 'Electricidad', stock: 8, minStock: 15, maxStock: 80, price: 45.00, location: 'Pasillo C - Estante 1', description: 'Cable eléctrico calibre 12 por metro' },
        { id: '4', name: 'Pintura Vinílica Blanca 19L', code: 'PINT-001', category: 'Pintura', stock: 22, minStock: 10, maxStock: 40, price: 459.00, location: 'Almacén Secundario - Zona A', description: 'Pintura vinílica lavable' },
        { id: '5', name: 'Tubería PVC 2" (6m)', code: 'TUB-045', category: 'Plomería', stock: 15, minStock: 12, maxStock: 60, price: 125.00, location: 'Pasillo B - Estante 3', description: 'Tubería PVC de 2 pulgadas' }
    ],
    transactions: [
        { id: '1', type: 'entrada', productId: '1', productName: 'Martillo de Carpintero 16oz', productCode: 'MART-001', quantity: 10, date: '2024-10-10 10:30', createdBy: 'Pedro Almacén', status: 'pendiente', reason: 'Reabastecimiento semanal' },
        { id: '2', type: 'salida', productId: '3', productName: 'Cable Eléctrico Calibre 12', productCode: 'CABL-001', quantity: 5, date: '2024-10-10 09:15', createdBy: 'Pedro Almacén', status: 'pendiente', reason: 'Pedido especial cliente #45' }
    ],
    employees: [
        { id: '1', name: 'Juan Pérez García', position: 'Gerente', email: 'juan.perez@ferreteria.com', phone: '555-1234', salary: 15000, status: 'active', hireDate: '2022-01-15', address: 'Av. Principal 123' },
        { id: '2', name: 'María López Hernández', position: 'Cajero', email: 'maria.lopez@ferreteria.com', phone: '555-5678', salary: 8000, status: 'active', hireDate: '2023-03-20', address: 'Calle Secundaria 456' },
        { id: '3', name: 'Carlos Ramírez Díaz', position: 'Almacenista', email: 'carlos.ramirez@ferreteria.com', phone: '555-9012', salary: 9000, status: 'active', hireDate: '2023-06-10', address: 'Av. Central 789' },
        { id: '4', name: 'Ana Martínez Soto', position: 'Vendedor', email: 'ana.martinez@ferreteria.com', phone: '555-3456', salary: 7500, status: 'inactive', hireDate: '2021-11-05', address: 'Col. Norte 321' }
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
    ADMIN_PIN: '1234',
    categories: ['Herramientas', 'Construcción', 'Electricidad', 'Plomería', 'Pintura', 'Seguridad']
};
