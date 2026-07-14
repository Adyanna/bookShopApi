# 📚 BookShop API

API REST desarrollada con **Node.js + TypeScript + Express** siguiendo **Arquitectura Hexagonal** como práctica de Backend Avanzado.

La aplicación permite a los usuarios publicar libros, administrarlos, comprarlos y recibir notificaciones automáticas mediante colas de procesamiento y tareas programadas.

---

# 🚀 Funcionalidades

- Registro de usuarios
- Inicio de sesión con autenticación JWT
- Publicación de libros
- Actualización de libros
- Eliminación de libros
- Compra de libros
- Catálogo público con búsqueda y paginación
- Consulta de los libros del usuario autenticado
- Notificación por email al vendedor cuando un libro es vendido
- Sugerencia semanal de revisión o reducción de precio mediante una tarea programada
- Procesamiento asíncrono de emails utilizando BullMQ y Redis

---

# 🧠 Tecnologías

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT
- BullMQ
- Redis
- Nodemailer
- MailDev
- Docker Compose
- Jest
- Supertest

---

# 🏗️ Arquitectura

El proyecto sigue una **Arquitectura Hexagonal**, separando claramente las responsabilidades en:

- Domain
- Infrastructure
- UI

Esta organización facilita el mantenimiento, las pruebas y la independencia entre la lógica de negocio y las tecnologías utilizadas.

---

# 📦 Instalación del proyecto

## 1. Clonar el repositorio

```bash
git clone https://github.com/Adyanna/bookShopApi.git
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Levantar los servicios con Docker

El proyecto utiliza **Docker Compose** para ejecutar todos los servicios necesarios.

```bash
docker compose up -d
```

Esto iniciará automáticamente:

- PostgreSQL
- PgAdmin
- Redis
- MailDev

---

## 4. Configurar las variables de entorno

Crear un archivo `.env` con las variables necesarias para la aplicación, mismas que se encuentran en el archivo .env.example.

---

## 5. Ejecutar las migraciones de Prisma

```bash
npx prisma migrate dev
```

Generar el cliente de Prisma:

```bash
npx prisma generate
```

---

## 6. Ejecutar el proyecto

```bash
npm run dev
```

---

# 🧪 Ejecutar pruebas

Ejecutar todos los tests:

```bash
npm test:Band
```

O utilizar los scripts definidos en el proyecto.

---

# 📬 Procesos en segundo plano

## 📧 Notificación de venta

Cuando un usuario compra un libro:

- La compra se registra correctamente.
- El libro cambia al estado **SOLD**.
- Se registra la fecha de venta.
- Se envía un email al vendedor mediante **BullMQ**, **Redis** y un **Worker**.

## ⏰ Sugerencia semanal de precio

Una tarea programada se ejecuta semanalmente para localizar todos los libros publicados hace más de siete días y enviar al propietario una sugerencia para revisar o reducir el precio con el objetivo de aumentar las posibilidades de venta.

---

# 📌 Endpoints principales

## Autenticación

- POST `/signup`
- POST `/signin`

## Libros

- GET `/books`
- GET `/me/books`
- POST `/books`
- PUT `/books/:id`
- DELETE `/books/:id`
- POST `/books/:id/buy`

---

# 👩‍💻 Autor

Desarrollado por **Milka Cutipa** como práctica de Backend Avanzado utilizando **Node.js**, **TypeScript**, **Prisma** y **Arquitectura Hexagonal**.
