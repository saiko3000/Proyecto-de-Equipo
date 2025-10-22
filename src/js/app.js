// ==================== INICIALIZACIÓN DE LA APLICACIÓN ====================

// Cargar datos de localStorage al iniciar
function loadStoredData() {
    const storedProducts = loadFromLocalStorage('products');
    if (storedProducts) AppState.products = storedProducts;
    
    const storedTransactions = loadFromLocalStorage('transactions');
    if (storedTransactions) AppState.transactions = storedTransactions;
    
    const storedEmployees = loadFromLocalStorage('employees');
    if (storedEmployees) AppState.employees = storedEmployees;
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos almacenados
    loadStoredData();
    
    // Setup del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Cargar módulo por defecto si hay sesión activa
    if (AppState.currentUser) {
        showMainApp();
    }
});
