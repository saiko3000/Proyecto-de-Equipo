# PROMPT COMPLETO - Sistema de Gestión de Inventario "Ferretería El Tornillo"

## DESCRIPCIÓN GENERAL DEL PROYECTO

Crea un sistema completo de gestión de inventario para una ferretería llamada "Ferretería El Tornillo". El sistema debe ser una aplicación web moderna desarrollada con React, TypeScript y Tailwind CSS, que permita gestionar inventario, empleados, reportes y notificaciones con un sistema de roles robusto.

---

## SISTEMA DE ROLES Y PERMISOS

El sistema debe implementar **3 roles de usuario** con permisos diferenciados:

### 1. **Administrador** (`admin`)
- **Acceso completo** a todos los módulos del sistema
- **Credenciales**: Usuario: `administrador` / Contraseña: `admin123`
- **Módulos disponibles**:
  - ✅ Inventario (vista completa)
  - ✅ Reportes
  - ✅ Empleados (CRUD completo)
  - ✅ Notificaciones (gestión de recuperación de contraseñas)

### 2. **Supervisor** (`cashier`)
- **Validación y supervisión** de transacciones
- **Credenciales**: Usuario: `supervisor` / Contraseña: `super123`
- **Módulos disponibles**:
  - ✅ Inventario (aprobación de transacciones, órdenes de picking/storage, ajustes)
  - ✅ Reportes
- **Funcionalidades específicas**:
  - Aprobar/rechazar entradas y salidas de inventario
  - Crear órdenes de picking
  - Crear órdenes de almacenamiento
  - Realizar ajustes de stock
  - Editar perfil personal

### 3. **Almacenista** (`warehouse`)
- **Registro de movimientos** de inventario
- **Credenciales**: Usuario: `almacenista` / Contraseña: `almacen123`
- **Módulos disponibles**:
  - ✅ Inventario (registro de entradas, salidas, transferencias)
  - ✅ Reportes
- **Funcionalidades específicas**:
  - Registrar entradas de mercancía (pendientes de aprobación)
  - Registrar salidas de mercancía (pendientes de aprobación)
  - Realizar transferencias entre ubicaciones
  - Consultar stock y ubicaciones
  - Ejecutar órdenes de picking/storage
  - Editar perfil personal

---

## MÓDULOS PRINCIPALES

### 📦 **1. MÓDULO DE INVENTARIO**

El módulo debe adaptar su interfaz según el rol del usuario.

#### **Vista para Almacenista**
5 tabs principales:
1. **Ver Inventario**: Tabla completa con productos, códigos, categorías, stock y ubicaciones
2. **Entrada**: Formulario para registrar entradas de mercancía
   - Selector de producto
   - Cantidad
   - Motivo/razón (textarea)
   - Las entradas quedan en estado "pendiente" hasta que el supervisor las apruebe
3. **Salida**: Formulario para registrar salidas de mercancía
   - Selector de producto (mostrando stock actual)
   - Cantidad (validar que no exceda el stock)
   - Motivo/razón
   - Las salidas quedan en estado "pendiente" hasta que el supervisor las apruebe
4. **Transferencias**: Formulario para mover productos entre ubicaciones
   - Selector de producto
   - Cantidad
   - Ubicación destino
   - Motivo
   - Se ejecuta inmediatamente (actualiza ubicación)
5. **Consultar Stock**: Búsqueda y consulta de inventario con filtros

#### **Vista para Supervisor**
5 tabs principales:
1. **Ver Inventario**: Tabla completa de productos
2. **Aprobar**: Gestión de transacciones pendientes
   - Tabla con entradas y salidas pendientes
   - Información completa: producto, código, cantidad, fecha, creado por, motivo
   - Badges de estado
   - Botones de aprobar (✓) y rechazar (✗)
   - Al aprobar, actualiza el stock automáticamente
3. **Órdenes de Picking**: Crear órdenes para que almacenistas recojan productos
   - Formulario: producto, cantidad
   - Tabla de órdenes pendientes y completadas
   - Almacenistas pueden marcar como completadas
4. **Órdenes de Storage**: Crear órdenes de almacenamiento
   - Formulario: producto, cantidad, ubicación destino
   - Tabla de órdenes pendientes y completadas
5. **Ajustes**: Realizar ajustes directos de stock
   - Selector de producto
   - Nueva cantidad (ajuste manual)
   - Motivo/razón
   - Se ejecuta inmediatamente

#### **Productos Iniciales**
```typescript
[
  {
    id: "1",
    name: "Martillo de Carpintero 16oz",
    code: "MART-001",
    category: "Herramientas",
    stock: 25,
    location: "Pasillo A - Estante 2",
  },
  {
    id: "2",
    name: "Cemento Gris 50kg",
    code: "CEM-001",
    category: "Construcción",
    stock: 45,
    location: "Almacén Principal - Zona B",
  },
  {
    id: "3",
    name: "Cable Eléctrico Calibre 12",
    code: "CABL-001",
    category: "Electricidad",
    stock: 8,
    location: "Pasillo C - Estante 1",
  },
  {
    id: "4",
    name: "Pintura Vinílica Blanca 19L",
    code: "PINT-001",
    category: "Pintura",
    stock: 22,
    location: "Almacén Secundario - Zona A",
  },
  {
    id: "5",
    name: "Tubería PVC 2\" (6m)",
    code: "TUB-045",
    category: "Plomería",
    stock: 15,
    location: "Pasillo B - Estante 3",
  },
]
```

### 📊 **2. MÓDULO DE REPORTES**

Disponible para todos los roles. Incluye:

#### **KPIs Principales** (4 tarjetas)
1. **Valor Total del Inventario**: Suma total en pesos + cantidad de productos
2. **Stock Bajo**: Número de productos que requieren reabastecimiento
3. **Movimientos**: Total de entradas/salidas en los últimos 7 días
4. **Categorías**: Número de categorías activas

#### **Gráficas Analíticas**
1. **Movimientos de Inventario** (LineChart)
   - Eje X: Últimos 7 días
   - 2 líneas: Entradas (verde) y Salidas (naranja)
   - Mostrar tendencias

2. **Valor por Categoría** (PieChart)
   - Distribución del valor del inventario por categoría
   - Colores diferenciados
   - Porcentajes

#### **Tabs de Reportes**
1. **Stock Bajo**: Tabla de productos que requieren reabastecimiento
   - Código, nombre, categoría
   - Stock actual vs Stock mínimo
   - Proveedor sugerido
   - Badge de estado (Crítico <50% / Bajo)

2. **Movimientos Recientes**: Historial de transacciones
   - Fecha/hora
   - Producto
   - Tipo (Entrada/Salida con badge)
   - Cantidad (+/- con color)
   - Empleado que lo realizó
   - Motivo

3. **Productos Más Movidos**: Ranking de productos
   - Top 5 productos
   - Código, nombre
   - Número de movimientos
   - Tendencia (↑ al alza / ↓ a la baja)

### 👥 **3. MÓDULO DE EMPLEADOS** (Solo Administrador)

Sistema CRUD completo para gestión de personal:

#### **Funcionalidades**
- **Crear** nuevos empleados
- **Editar** información de empleados
- **Eliminar** empleados
- **Buscar/filtrar** por nombre, puesto o email

#### **Campos del Empleado**
```typescript
{
  id: string;
  name: string;
  position: string; // Gerente, Cajero, Vendedor, Almacenista
  email: string;
  phone: string;
  salary: number;
  status: "active" | "inactive";
  hireDate: string;
}
```

#### **Empleados Iniciales**
```typescript
[
  {
    name: "Juan Pérez García",
    position: "Gerente",
    email: "juan.perez@ferreteria.com",
    phone: "555-1234",
    salary: 15000,
    status: "active",
    hireDate: "2022-01-15",
  },
  {
    name: "María López Hernández",
    position: "Cajero",
    email: "maria.lopez@ferreteria.com",
    phone: "555-5678",
    salary: 8000,
    status: "active",
    hireDate: "2023-03-20",
  },
  {
    name: "Carlos Ramírez Díaz",
    position: "Almacenista",
    email: "carlos.ramirez@ferreteria.com",
    phone: "555-9012",
    salary: 9000,
    status: "active",
    hireDate: "2023-06-10",
  },
  {
    name: "Ana Martínez Soto",
    position: "Vendedor",
    email: "ana.martinez@ferreteria.com",
    phone: "555-3456",
    salary: 7500,
    status: "inactive",
    hireDate: "2021-11-05",
  },
]
```

#### **KPIs del Módulo**
- Total empleados
- Empleados activos
- Nómina mensual total
- Salario promedio

### 🔔 **4. MÓDULO DE NOTIFICACIONES** (Solo Administrador)

Sistema para gestionar solicitudes de recuperación de contraseña.

#### **KPIs** (3 tarjetas)
1. **Pendientes** (naranja) - Requieren atención
2. **Aprobadas** (verde) - Solicitudes completadas
3. **Rechazadas** (rojo) - Solicitudes denegadas

#### **Tabs**
1. **Pendientes**: 
   - Tabla con solicitudes pendientes
   - Badge con contador en el tab
   - Botones de aprobar/rechazar
   - Al aprobar: diálogo para asignar nueva contraseña temporal

2. **Aprobadas**: 
   - Historial de solicitudes aprobadas
   - Solo lectura

3. **Rechazadas**: 
   - Historial de solicitudes rechazadas
   - Solo lectura

---

## SISTEMA DE RECUPERACIÓN DE CONTRASEÑA

### **Flujo de Recuperación** (2 pasos)

#### **Paso 1: Validación de PIN Administrativo**
- Al hacer clic en "Olvidé mi contraseña" en el login
- Se abre un diálogo con campo para ingresar PIN
- **PIN de seguridad**: `1234` (hardcoded para demo)
- Mensaje: "Este PIN lo proporciona el Administrador del Sistema"
- Si el PIN es correcto → pasar al Paso 2
- Si es incorrecto → mostrar error y no permitir continuar

#### **Paso 2: Cambio de Contraseña**
- Formulario con:
  - Usuario (input text)
  - Nueva contraseña (input password, mínimo 6 caracteres)
  - Confirmar contraseña (input password)
- Validaciones:
  - Todos los campos requeridos
  - Contraseñas deben coincidir
  - Mínimo 6 caracteres
- Indicador visual: "✓ PIN validado correctamente" (badge verde)
- Botón "Atrás" para regresar al paso 1
- Al completar: toast de éxito y cerrar diálogo

---

## DISEÑO Y UI/UX

### **Estructura General**
```
┌─────────────────────────────────────────┐
│  Header (POSHeader)                     │
│  "Ferretería El Tornillo"               │
│  + Ícono de tienda                      │
└─────────────────────────────────────────┘
┌─────────┬───────────────────────────────┐
│         │                               │
│ Sidebar │  Contenido del Módulo Activo │
│         │                               │
│ - User  │                               │
│   Info  │                               │
│         │                               │
│ - Menu  │                               │
│   Items │                               │
│         │                               │
│ - Edit  │                               │
│   Prof. │                               │
│         │                               │
│ - Logout│                               │
└─────────┴───────────────────────────────┘
```

### **Sidebar Colapsable**
- **Expandido (w-64)**: Muestra iconos + texto
- **Colapsado (w-16)**: Solo iconos
- Botón de menú (hamburguesa) para alternar
- **Sección superior**: 
  - Información del usuario (nombre + rol)
  - Fondo con bg-muted
- **Sección de navegación**:
  - Módulos según rol del usuario
  - Badge de notificaciones en "Notificaciones" (solo admin)
  - Indicador visual (punto rojo) cuando sidebar está colapsado
- **Sección inferior**:
  - Editar Perfil (solo supervisor y almacenista)
  - Cerrar Sesión (con diálogo de confirmación)

### **Módulos en Sidebar**
```typescript
[
  { id: "inventory", name: "Inventario", icon: Package },
  { id: "reports", name: "Reportes", icon: BarChart3 },
  { id: "employees", name: "Empleados", icon: Users }, // Solo admin
  { id: "notifications", name: "Notificaciones", icon: Bell, badge: count }, // Solo admin
]
```

### **Pantalla de Login**
- Diseño centrado con Card
- Logo de la ferretería (ícono Store en círculo)
- Título: "Ferretería El Tornillo"
- Subtítulo: "Sistema de Gestión Integral"
- Formulario con:
  - Campo Usuario (con ícono User)
  - Campo Contraseña (con ícono Lock)
  - Botón "Iniciar Sesión"
  - Link "Olvidé mi contraseña"
- Fondo: gradient from-primary/5 to-primary/10

### **Componentes y Estilos**
- **Framework CSS**: Tailwind CSS v4.0
- **Componentes UI**: shadcn/ui
- **Iconos**: lucide-react
- **Gráficas**: recharts
- **Notificaciones**: sonner (toast)
- **Paleta de colores**:
  - Primary: Para acciones principales y encabezados
  - Success/Green: Entradas, aprobaciones
  - Warning/Orange: Alertas, stock bajo
  - Destructive/Red: Salidas, rechazos, acciones críticas
  - Muted: Información secundaria

### **Componentes Reutilizables**
- `Card` para contenedores
- `Table` para listados
- `Dialog` para modales
- `Tabs` para navegación por pestañas
- `Badge` para estados y contadores
- `Select` para selectores
- `Input` para campos de texto
- `Button` con variantes (default, outline, ghost, link)

---

## FUNCIONALIDAD DE EDITAR PERFIL

Disponible para **Supervisor** y **Almacenista** (NO para Admin).

### **Campos Editables**
```typescript
{
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
}
```

### **Diálogo de Edición**
- Título: "Editar Perfil"
- Descripción: "Actualiza tu información personal"
- Campos:
  - Nombre Completo *
  - Email
  - Teléfono
  - Dirección
- Validación: Nombre completo es obligatorio
- Toast de confirmación al guardar

---

## ESTRUCTURA DE ARCHIVOS

```
/
├── App.tsx                          # Componente principal
├── components/
│   ├── Login.tsx                    # Pantalla de login
│   ├── PasswordRecovery.tsx         # Diálogo de recuperación
│   ├── POSHeader.tsx                # Header del sistema
│   ├── InventoryManagement.tsx      # Módulo de inventario
│   ├── InventoryReports.tsx         # Módulo de reportes
│   ├── EmployeeManagement.tsx       # Módulo de empleados
│   ├── NotificationsModule.tsx      # Módulo de notificaciones
│   ├── EditProfile.tsx              # Diálogo de editar perfil
│   └── ui/                          # Componentes shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── select.tsx
│       ├── badge.tsx
│       ├── sonner.tsx
│       └── ...
└── styles/
    └── globals.css                  # Estilos globales
```

---

## TIPOS TYPESCRIPT PRINCIPALES

```typescript
// Roles de usuario
type UserRole = "admin" | "cashier" | "warehouse";

// Datos de usuario
interface UserData {
  username: string;
  role: UserRole;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Producto
interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  stock: number;
  location: string;
}

// Transacción de inventario
interface Transaction {
  id: string;
  type: "entrada" | "salida";
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  date: string;
  createdBy: string;
  status: "pendiente" | "aprobada" | "rechazada";
  reason: string;
}

// Orden de picking
interface PickingOrder {
  id: string;
  productCode: string;
  productName: string;
  location: string;
  quantity: number;
  status: "pendiente" | "completada";
  createdBy: string;
  date: string;
}

// Orden de almacenamiento
interface StorageOrder {
  id: string;
  productCode: string;
  productName: string;
  targetLocation: string;
  quantity: number;
  status: "pendiente" | "completada";
  createdBy: string;
  date: string;
}

// Empleado
interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  salary: number;
  status: "active" | "inactive";
  hireDate: string;
}

// Solicitud de recuperación
interface PasswordRecoveryRequest {
  id: string;
  username: string;
  email: string;
  date: string;
  status: "pendiente" | "aprobada" | "rechazada";
}
```

---

## PERMISOS POR ROL

```typescript
const rolePermissions: Record<UserRole, Module[]> = {
  admin: ["inventory", "employees", "reports", "notifications"],
  cashier: ["inventory", "reports"],
  warehouse: ["inventory", "reports"],
};
```

---

## COMPORTAMIENTOS ESPERADOS

### **Flujo de Transacciones**
1. **Almacenista** registra una entrada/salida
2. La transacción queda en estado `"pendiente"`
3. **Supervisor** ve la transacción en el tab "Aprobar"
4. **Supervisor** aprueba → stock se actualiza automáticamente
5. **Supervisor** rechaza → transacción marcada como rechazada
6. Todas las transacciones se registran con fecha/hora y usuario que la creó

### **Flujo de Órdenes**
1. **Supervisor** crea una orden de picking/storage
2. La orden aparece en estado `"pendiente"`
3. **Almacenista** ve la orden en su vista
4. **Almacenista** ejecuta la orden y la marca como `"completada"`

### **Flujo de Transferencias**
1. **Almacenista** selecciona producto, cantidad y ubicación destino
2. Al confirmar, la ubicación del producto se actualiza inmediatamente
3. No requiere aprobación del supervisor

### **Flujo de Ajustes**
1. **Supervisor** puede hacer ajustes directos de stock
2. Especifica el producto y la nueva cantidad
3. Debe proporcionar un motivo/razón
4. Se ejecuta inmediatamente

---

## VALIDACIONES IMPORTANTES

1. **Salidas de inventario**: No permitir cantidades mayores al stock actual
2. **Contraseñas**: Mínimo 6 caracteres
3. **PIN de recuperación**: Debe coincidir exactamente con "1234"
4. **Campos obligatorios**: Validar que todos los campos requeridos estén completos
5. **Emails**: Formato válido de email
6. **Números**: Validar que cantidades y salarios sean números válidos

---

## MENSAJES Y FEEDBACK

### **Toast de Éxito**
- "Entrada registrada. Pendiente de aprobación del supervisor."
- "Salida registrada. Pendiente de aprobación del supervisor."
- "Transferencia completada: [producto] movido a [ubicación]"
- "Transacción aprobada y stock actualizado"
- "Contraseña cambiada exitosamente. Puedes iniciar sesión con tu nueva contraseña."
- "Empleado agregado correctamente"
- "Empleado actualizado correctamente"

### **Toast de Error**
- "Por favor completa todos los campos"
- "La cantidad excede el stock disponible"
- "Las contraseñas no coinciden"
- "La contraseña debe tener al menos 6 caracteres"
- "PIN de seguridad inválido. No se puede acceder al formulario de cambio de contraseña."
- "Usuario o contraseña incorrectos"

### **Toast de Información**
- "Transacción rechazada"
- "Solicitud de [usuario] rechazada"

---

## CATEGORÍAS DE PRODUCTOS

El sistema debe manejar las siguientes categorías:
- Herramientas
- Construcción / Materiales de Construcción
- Electricidad
- Plomería
- Pintura
- Seguridad
- Ferretería

---

## NOTAS ADICIONALES

1. **Estado inicial**: Siempre comenzar en la pantalla de Login
2. **Persistencia**: Los datos son en memoria (se pierden al recargar)
3. **Responsividad**: El diseño debe ser responsive, especialmente en desktop
4. **Accesibilidad**: Usar labels apropiados y aria-labels donde sea necesario
5. **UX**: Incluir estados de carga, diálogos de confirmación para acciones críticas
6. **Comentarios**: Incluir encabezados descriptivos en cada archivo TSX

---

## CONSIDERACIONES TÉCNICAS

- Usar `useState` para manejo de estado local
- Usar `toast` de sonner para notificaciones
- Importar sonner así: `import { toast } from "sonner@2.0.3"`
- Usar componentes de shadcn/ui desde `"./components/ui/[componente]"`
- Usar iconos de lucide-react
- Fechas en formato español: `toLocaleString("es-MX")`
- Todos los textos en español
- NO usar clases de Tailwind para font-size, font-weight o line-height a menos que se especifique
- Usar el componente `<Toaster position="top-right" />` en App.tsx

---

## INICIO RÁPIDO

El sistema debe permitir inicio de sesión con las siguientes credenciales:

| Rol | Usuario | Contraseña |
|-----|---------|-----------|
| Administrador | `administrador` | `admin123` |
| Supervisor | `supervisor` | `super123` |
| Almacenista | `almacenista` | `almacen123` |

---

## RESULTADO ESPERADO

Un sistema completo, funcional y profesional de gestión de inventario que:
✅ Implementa correctamente los 3 roles con sus permisos
✅ Permite gestión completa del inventario según el rol
✅ Muestra reportes y análisis visuales con gráficas
✅ Gestiona empleados (solo admin)
✅ Maneja notificaciones de recuperación (solo admin)
✅ Tiene un sistema de recuperación de contraseña con validación PIN
✅ Presenta una interfaz limpia, moderna y fácil de usar
✅ Incluye validaciones y feedback apropiado
✅ Es completamente funcional en el navegador
