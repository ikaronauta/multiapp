// src/data/data.js

import { all } from "axios";

export const ROLES = {
  ADMIN: 1,
  USER: 2,
};

export const BUSINESSES = {
  SYSTEM: 1,
};

export const sections = [
  {
    title: 'Home',
    items: [
      {
        allowedRoleIds: null,
        onlySystem: false,
        title: 'Dashboard',
        route: '/',
      }
    ],
  },
  {
    title: 'Administración',
    items: [
      {
        allowedRoleIds: [ROLES.ADMIN],
        onlySystem: true,
        title: 'Gestión de Roles',
        route: '/admin/roles',
      },
      {
        allowedRoleIds: [ROLES.ADMIN],
        onlySystem: false,
        title: 'Gestión de Usuarios',
        route: '/admin/users',
      },
    ]
  }
];

export const formularios = [
  {
    id: 1, name: "Gestion de Roles", fields: [
      { id: 1, label: "Nombre del Rol", type: "text", name: "roleName" },
      { id: 2, label: "Agregar", type: "button", name: "agregar" }
    ]
  },
];

export const objDataUsers = {
    data: [
      {
        id: 1,
        name: "Juan",
        lastName: "Pérez",
        email: "juan@test.com",
        phone: "3001234567",
        role: "Admin",
        status: "Activo",
        city: "Bogotá",
        createdAt: "2024-01-10",
        updatedAt: "2024-06-01",
      },
      {
        id: 2,
        name: "Ana",
        lastName: "Gómez",
        email: "ana@test.com",
        phone: "3019876543",
        role: "Usuario",
        status: "Inactivo",
        city: "Medellín",
        createdAt: "2024-02-05",
        updatedAt: "2024-06-03",
      },
      {
        id: 3,
        name: "Pedro",
        lastName: "Ramírez",
        email: "pedro@test.com",
        phone: "3024567890",
        role: "Usuario",
        status: "Activo",
        city: "Cali",
        createdAt: "2024-03-15",
        updatedAt: "2024-06-10",
      },
    ],
    columns: [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Nombre",
      },
      {
        accessorKey: "lastName",
        header: "Apellido",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Telefono",
      },
      {
        accessorKey: "role",
        header: "Rol",
      },
      {
        accessorKey: "status",
        header: "Status",
      }
      ,
      {
        accessorKey: "city",
        header: "Ciudad",
      },
      {
        accessorKey: "createdAt",
        header: "Creado En",
      },
      {
        accessorKey: "updatedAt",
        header: "Editado En",
      },
    ],
  }
