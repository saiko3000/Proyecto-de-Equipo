<?php
/**
 * ENDPOINT DE PRODUCTOS (CRUD)
 * =============================
 * 
 * Maneja las operaciones CRUD de productos
 * 
 * MÉTODOS SOPORTADOS:
 * - GET:    Listar productos (con filtros opcionales)
 * - POST:   Crear nuevo producto
 * - PUT:    Actualizar producto existente
 * - DELETE: Eliminar producto
 */

require_once 'config.php';
setCorsHeaders();

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Conectar a la base de datos
$conn = getConnection();

// ==================== GET: LISTAR PRODUCTOS ====================
if ($method === 'GET') {
    $category = isset($_GET['category']) ? sanitizeInput($_GET['category']) : '';
    $search = isset($_GET['search']) ? sanitizeInput($_GET['search']) : '';
    $lowStock = isset($_GET['lowStock']) ? true : false;
    
    $sql = "SELECT * FROM products WHERE active = 1";
    
    if ($category !== '') {
        $sql .= " AND category = ?";
    }
    
    if ($search !== '') {
        $sql .= " AND (name LIKE ? OR code LIKE ?)";
    }
    
    if ($lowStock) {
        $sql .= " AND stock <= min_stock";
    }
    
    $sql .= " ORDER BY name ASC";
    
    $stmt = $conn->prepare($sql);
    
    // Bind parameters según los filtros
    if ($category !== '' && $search !== '') {
        $searchParam = "%$search%";
        $stmt->bind_param("sss", $category, $searchParam, $searchParam);
    } elseif ($category !== '') {
        $stmt->bind_param("s", $category);
    } elseif ($search !== '') {
        $searchParam = "%$search%";
        $stmt->bind_param("ss", $searchParam, $searchParam);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $products = $result->fetch_all(MYSQLI_ASSOC);
    
    jsonResponse(true, 'Productos obtenidos', $products);
}

// ==================== POST: CREAR PRODUCTO ====================
elseif ($method === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // Validar campos requeridos
    $required = ['code', 'name', 'category'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            jsonResponse(false, "El campo $field es requerido");
        }
    }
    
    // Verificar que el código no exista
    $checkStmt = $conn->prepare("SELECT id FROM products WHERE code = ?");
    $checkStmt->bind_param("s", $data['code']);
    $checkStmt->execute();
    if ($checkStmt->get_result()->num_rows > 0) {
        jsonResponse(false, 'El código de producto ya existe');
    }
    $checkStmt->close();
    
    // Insertar producto
    $stmt = $conn->prepare("
        INSERT INTO products (code, name, category, description, price, stock, min_stock, max_stock, location)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $price = isset($data['price']) ? floatval($data['price']) : 0.00;
    $stock = isset($data['stock']) ? intval($data['stock']) : 0;
    $minStock = isset($data['minStock']) ? intval($data['minStock']) : 0;
    $maxStock = isset($data['maxStock']) ? intval($data['maxStock']) : 100;
    $description = isset($data['description']) ? $data['description'] : '';
    $location = isset($data['location']) ? $data['location'] : '';
    
    $stmt->bind_param(
        "ssssdiiis",
        $data['code'],
        $data['name'],
        $data['category'],
        $description,
        $price,
        $stock,
        $minStock,
        $maxStock,
        $location
    );
    
    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        jsonResponse(true, 'Producto creado exitosamente', ['id' => $newId]);
    } else {
        jsonResponse(false, 'Error al crear producto');
    }
}

// ==================== PUT: ACTUALIZAR PRODUCTO ====================
elseif ($method === 'PUT') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!isset($data['id'])) {
        jsonResponse(false, 'ID de producto es requerido');
    }
    
    $stmt = $conn->prepare("
        UPDATE products 
        SET name = ?, category = ?, description = ?, price = ?, 
            stock = ?, min_stock = ?, max_stock = ?, location = ?
        WHERE id = ?
    ");
    
    $price = isset($data['price']) ? floatval($data['price']) : 0.00;
    $stock = isset($data['stock']) ? intval($data['stock']) : 0;
    $minStock = isset($data['minStock']) ? intval($data['minStock']) : 0;
    $maxStock = isset($data['maxStock']) ? intval($data['maxStock']) : 100;
    $description = isset($data['description']) ? $data['description'] : '';
    $location = isset($data['location']) ? $data['location'] : '';
    
    $stmt->bind_param(
        "sssdiiisi",
        $data['name'],
        $data['category'],
        $description,
        $price,
        $stock,
        $minStock,
        $maxStock,
        $location,
        $data['id']
    );
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Producto actualizado exitosamente');
    } else {
        jsonResponse(false, 'Error al actualizar producto');
    }
}

// ==================== DELETE: ELIMINAR PRODUCTO ====================
elseif ($method === 'DELETE') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!isset($data['id'])) {
        jsonResponse(false, 'ID de producto es requerido');
    }
    
    // Soft delete (marcar como inactivo)
    $stmt = $conn->prepare("UPDATE products SET active = 0 WHERE id = ?");
    $stmt->bind_param("i", $data['id']);
    
    // Para eliminación permanente, usa:
    // $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    
    if ($stmt->execute()) {
        jsonResponse(true, 'Producto eliminado exitosamente');
    } else {
        jsonResponse(false, 'Error al eliminar producto');
    }
}

else {
    jsonResponse(false, 'Método no soportado');
}

$conn->close();
?>
