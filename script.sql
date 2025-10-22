-- Crear la base de datos (puedes cambiar el nombre)
CREATE DATABASE IF NOT EXISTS inventario_db;

-- Seleccionar la base de datos
USE inventario_db;

-- Creación de la tabla ROLES
CREATE TABLE ROLES (
    id_rol INT AUTO_INCREMENT,
    nombre_rol VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_rol)
);

-- Creación de la tabla USUARIO
CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT,
    nombre_usuario VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INT,
    fecha_creacion DATETIME,
    fecha_ultima DATETIME,
    estado VARCHAR(50),
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_rol) REFERENCES ROLES(id_rol)
);

-- Creación de la tabla DISPOSITIVOS_RECORDADOS
CREATE TABLE DISPOSITIVOS_RECORDADOS (
    id_dispositivo INT AUTO_INCREMENT,
    id_usuario INT,
    token VARCHAR(255),
    user_agent VARCHAR(255),
    ip VARCHAR(45),
    fecha_creacion DATETIME,
    fecha_expiracion DATETIME,
    PRIMARY KEY (id_dispositivo),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- Creación de la tabla CATEGORIAS
CREATE TABLE CATEGORIAS (
    id_categoria INT AUTO_INCREMENT,
    nombre_categoria VARCHAR(255) NOT NULL,
    descripcion TEXT,
    PRIMARY KEY (id_categoria)
);

-- Creación de la tabla PRODUCTOS
CREATE TABLE PRODUCTOS (
    id_producto INT AUTO_INCREMENT,
    nombre_producto VARCHAR(255) NOT NULL,
    descripcion TEXT,
    sku VARCHAR(100),
    precio_compra DECIMAL(10, 2),
    codigo_barras VARCHAR(255),
    fecha_actualizacion DATETIME,
    stock INT,
    id_categoria INT,
    PRIMARY KEY (id_producto),
    FOREIGN KEY (id_categoria) REFERENCES CATEGORIAS(id_categoria)
);

-- Creación de la tabla MOVIMIENTO_INVENTARIO
CREATE TABLE MOVIMIENTO_INVENTARIO (
    id_movimiento INT AUTO_INCREMENT,
    motivo VARCHAR(255),
    fecha_movimiento DATETIME,
    cantidad INT,
    tipo_movimiento VARCHAR(50),
    id_producto INT,
    id_usuario INT,
    PRIMARY KEY (id_movimiento),
    FOREIGN KEY (id_producto) REFERENCES PRODUCTOS(id_producto),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- Creación de la tabla AJUSTES_INVENTARIO
CREATE TABLE AJUSTES_INVENTARIO (
    id_ajuste INT AUTO_INCREMENT,
    id_producto INT,
    id_usuario INT,
    cantidad INT,
    tipo_ajuste VARCHAR(50),
    motivo TEXT,
    fecha_ajuste DATETIME,
    PRIMARY KEY (id_ajuste),
    FOREIGN KEY (id_producto) REFERENCES PRODUCTOS(id_producto),
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

-- Creación de la tabla HISTORIAL_PRECIOS
CREATE TABLE HISTORIAL_PRECIOS (
    id_historial_precio INT AUTO_INCREMENT,
    id_producto INT,
    precio DECIMAL(10, 2),
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    PRIMARY KEY (id_historial_precio),
    FOREIGN KEY (id_producto) REFERENCES PRODUCTOS(id_producto)
);

-- Creación de la tabla PROVEEDORES
CREATE TABLE PROVEEDORES (
    id_proveedor INT AUTO_INCREMENT,
    nombre_proveedor VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    PRIMARY KEY (id_proveedor)
);

-- Creación de la tabla PRODUCTO_PROVEEDOR
CREATE TABLE PRODUCTO_PROVEEDOR (
    id_producto_proveedor INT AUTO_INCREMENT,
    precio_compra DECIMAL(10, 2),
    tiempo_entrega VARCHAR(100),
    id_producto INT,
    id_proveedor INT,
    PRIMARY KEY (id_producto_proveedor),
    FOREIGN KEY (id_producto) REFERENCES PRODUCTOS(id_producto),
    FOREIGN KEY (id_proveedor) REFERENCES PROVEEDORES(id_proveedor)
);