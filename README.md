# Altairis Backoffice

Backoffice web fullstack para la gestión operativa de Viajes Altairis, un grupo internacional dedicado a la distribución hotelera y servicios turísticos B2B.

## Stack tecnológico

- **Frontend:** Next.js 15 + Tailwind CSS
- **Backend:** ASP.NET Core Web API (.NET 8)
- **Base de datos:** PostgreSQL 16
- **Orquestación:** Docker Compose

## Requisitos

- Docker Desktop instalado y corriendo

## Cómo correr el proyecto

1. Clonar el repositorio:
   git clone https://github.com/heryandejesus/altairis-backoffice.git
   cd altairis-backoffice

2. Levantar todos los servicios con un único comando:
   docker compose up --build

3. Abrir en el navegador:
   http://localhost:3000

La primera vez tarda unos minutos mientras descarga las imágenes y ejecuta el seed data.

## Funcionalidades

- Dashboard con métricas operativas en tiempo real
- Gestión de hoteles con búsqueda y filtros
- Gestión de tipos de habitación por hotel
- Gestión de disponibilidad e inventario
- Gestión de reservas

## Arquitectura

El proyecto corre tres servicios orquestados con Docker Compose:
- frontend (puerto 3000) — Next.js
- backend (puerto 5000) — ASP.NET Core API
- postgres (puerto 5432) — PostgreSQL

El backend aplica el schema automáticamente al arrancar y carga seed data de ejemplo.
