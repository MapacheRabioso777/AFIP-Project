# Finance Manager - React Frontend

Aplicación frontend en React para gestión financiera personal, integrada con backend Node.js/Express.

## 🚀 Características

- ✅ Autenticación JWT (Login/Register)
- ✅ Dashboard con resumen financiero
- ✅ Gestión de Cuentas Bancarias
- ✅ Registro de Ingresos
- ✅ Registro de Gastos
- ✅ Presupuestos
- ✅ Metas Financieras
- ✅ Control de Deudas
- ✅ Categorías personalizadas
- ✅ Interfaz responsive (Mobile-First)
- ✅ Validación de formularios con Formik + Yup
- ✅ Estado global con React Query
- ✅ Notificaciones con React Hot Toast

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Backend corriendo en `http://localhost:3001`
- Base de datos MySQL configurada

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
cd finance-frontend-react
npm install
```

2. **Configurar variables de entorno:**
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env con tu configuración
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_APP_NAME=Finance Manager
```

3. **Iniciar el servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Preview de la build de producción

## 🏗️ Estructura del Proyecto

```
src/
├── api/                    # Configuración de Axios
├── assets/                 # Recursos estáticos
├── components/             # Componentes React
│   ├── common/            # Componentes reutilizables
│   ├── layout/            # Componentes de layout
│   └── ui/                # Componentes UI puros
├── contexts/              # React Context (Auth)
├── hooks/                 # Custom hooks
├── pages/                 # Páginas de la aplicación
│   ├── auth/             # Login, Register
│   ├── accounts/         # CRUD Cuentas
│   ├── incomes/          # CRUD Ingresos
│   ├── expenses/         # CRUD Gastos
│   ├── budgets/          # CRUD Presupuestos
│   ├── goals/            # CRUD Metas
│   ├── debts/            # CRUD Deudas
│   └── categories/       # CRUD Categorías
├── router/                # Configuración de rutas
├── services/              # Servicios API
│   └── api/              # Servicios por módulo
├── styles/                # Estilos globales
└── utils/                 # Utilidades y helpers
```

## 🔐 Autenticación

1. **Registrarse:**
   - Ir a `/register`
   - Completar formulario con email y contraseña
   - Se creará un usuario con role_FK=1 y userStatus_FK=1

2. **Iniciar Sesión:**
   - Ir a `/login`
   - Ingresar credenciales
   - El token JWT se guarda en localStorage
   - Duración del token: 1 hora

3. **Cerrar Sesión:**
   - Click en el menú de usuario > "Cerrar sesión"
   - Se eliminan token y datos del usuario

## 📱 Módulos Disponibles

### Cuentas (`/cuentas`)
- Crear cuentas bancarias (Ahorros, Corriente, Efectivo)
- Ver listado de todas las cuentas
- Editar información de cuentas
- Eliminar cuentas

### Ingresos (`/ingresos`)
- Registrar ingresos
- Asociar a una cuenta específica
- Ver histórico de ingresos
- Editar y eliminar registros

### Gastos (`/gastos`)
- Registrar gastos
- Asociar a cuenta, categoría y presupuesto
- Filtrar por categoría
- Ver histórico completo

### Presupuestos (`/presupuestos`)
- Crear presupuestos mensuales
- Definir montos límite
- Monitorear gastos asociados

### Metas (`/metas`)
- Definir metas financieras
- Establecer fecha objetivo
-Seguimiento de progreso

### Deudas (`/deudas`)
- Registrar deudas
- Estados: Pendiente, En Progreso, Pagada
- Seguimiento de pagos

### Categorías (`/categorias`)
- Crear categorías personalizadas
- Organizar gastos por categoría

## 🎨 Tecnologías Utilizadas

- **React 18** - Biblioteca UI
- **Vite** - Build tool y dev server
- **React Router v6** - Enrutamiento
- **TanStack Query (React Query)** - Gestión de estado servidor
- **Axios** - Cliente HTTP
- **Formik + You** - Formularios y validación
- **Tailwind CSS** - Estilos
- **React Icons** - Iconos
- **React Hot Toast** - Notificaciones
- **date-fns** - Manejo de fechas

## 🔧 Configuración de API

El frontend se conecta al backend mediante Axios. La configuración incluye:

- **Base URL:** Definida en `.env`
- **Interceptores de Request:** Añaden el token JWT automáticamente
- **Interceptores de Response:** Manejan errores 401 (redirección a login)
- **Timeout:** 10 segundos

## 🌐 Endpoints Backend

Todos los endpoints siguen el patrón:
- `POST /api/v1/{recurso}` - Crear
- `GET /api/v1/{recurso}` - Listar todos
- `GET /api/v1/{recurso}/:id` - Obtener por ID
- `PUT /api/v1/{recurso}/:id` - Actualizar
- `DELETE /api/v1/{recurso}/:id` - Eliminar

Recursos disponibles:
- `/login` - Autenticación
- `/user` - Usuarios
- `/cuentas` - Cuentas
- `/ingresos` - Ingresos
- `/gastos` - Gastos
- `/presupuestos` - Presupuestos
- `/metas` - Metas
- `/deudas` - Deudas
- `/categorias` - Categorías

## 🐛 Solución de Problemas

**Error de conexión al backend:**
- Verificar que el backend esté corriendo en `http://localhost:3001`
- Revisar la variable `VITE_API_BASE_URL` en `.env`

**Token expirado:**
- El token JWT expira en 1 hora
- Cerrar sesión y volver a iniciar sesión

**Error al crear registros:**
- Verificar que existan las dependencias necesarias (ej: crear una cuenta antes de crear un ingreso)

## 📄 Licencia

Este proyecto es de uso educativo.

## 👥 Autor

Desarrollado como parte del proyecto de gestión financiera personal.
