// src/layouts/POSSeller.jsx

import { LayoutDashboard, Receipt } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function POSSeller() {
  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="
        bg-white
        px-4 sm:px-6 py-4
        flex flex-col sm:flex-row
        sm:justify-between
        sm:items-center
        gap-3
        rounded-b-2xl
        shadow-sm
      ">
        {/* Título + fecha */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900">
            MiniMarket Don Juan
          </h1>
          <span className="text-xs sm:text-sm text-gray-400">
            {new Date().toLocaleDateString("es-CO", { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Acciones y vendedor */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <Link
            to="/admin"
            className="
                group flex items-center gap-2
                px-4 py-2
                rounded-xl
                bg-linear-to-br from-blue-500 to-blue-600
                text-white
                font-medium
                shadow-md shadow-blue-300/50
                hover:from-indigo-500 hover:to-indigo-600
                transition-all duration-300 ease-in-out
                transform hover:-translate-y-0.5 hover:scale-105
              "
            >
            <LayoutDashboard
              size={20}
              className="opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="text-sm sm:text-base">
              Dashboard
            </span>
          </Link>


          {/* Botón Ventas del día */}
          <Link
            to="/sales/salesReport"
            className="
              group flex items-center gap-2
                px-4 py-2
                rounded-xl
                bg-linear-to-br from-blue-500 to-blue-600
                text-white
                font-medium
                shadow-md shadow-blue-300/50
                hover:from-indigo-500 hover:to-indigo-600
                transition-all duration-300 ease-in-out
                transform hover:-translate-y-0.5 hover:scale-105
            "
          >
            <Receipt
              size={20}
              lassName="opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="text-sm sm:text-base">
              Ventas del día
            </span>
          </Link>

          {/* Info del vendedor */}
          <p className="text-xs sm:text-sm text-gray-400">
            Vendedor: Carlos
          </p>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
