// src/pages/Home.jsx

import { Users, Box, DollarSign, ShoppingCart } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8">

      {/* Saludo */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido de nuevo!</h1>
        <p className="text-lg opacity-90">Sistema de inventarios - Dashboard</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
          <Users className="text-indigo-600" size={32} />
          <div>
            <p className="text-sm text-gray-500">Usuarios</p>
            <p className="text-xl font-bold">120</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
          <Box className="text-green-600" size={32} />
          <div>
            <p className="text-sm text-gray-500">Productos</p>
            <p className="text-xl font-bold">540</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
          <DollarSign className="text-yellow-500" size={32} />
          <div>
            <p className="text-sm text-gray-500">Ingresos</p>
            <p className="text-xl font-bold">$12,450</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">
          <ShoppingCart className="text-red-500" size={32} />
          <div>
            <p className="text-sm text-gray-500">Pedidos</p>
            <p className="text-xl font-bold">87</p>
          </div>
        </div>

      </div>

      {/* Mensaje adicional */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Resumen del día</h2>
        <p className="text-gray-600">
          Aquí podrás ver las métricas más importantes de tu inventario, los pedidos recientes y los usuarios activos.
        </p>
      </div>

    </div>
  );
}
