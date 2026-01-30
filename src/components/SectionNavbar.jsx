// src/components/SectionNavbar.jsx

import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { getUserFromToken, canAccess } from "../utils/auth";

export default function SectionNavbar({ objDataSection, onLinkClick }) {
  const user = getUserFromToken();
  const [open, setOpen] = useState(true);

  if (!user) return null;
  if (objDataSection.items.length === 0) return null;

  const visibleItems = objDataSection.items.filter(
    item => item.show && canAccess(item, user)
  );

  if (visibleItems.length === 0) return null;

  return (
    <section className="border border-gray-700 rounded-md p-2">
      
      {/* Header colapsable */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center justify-between w-full text-xs text-gray-400 mb-1"
      >
        <span>{objDataSection.title}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Contenido */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2">
          {visibleItems.map((item, i) => (
            <Link
              key={i}
              to={item.route}
              className="flex items-center gap-2 text-sm hover:text-gray-300"
              onClick={onLinkClick}
            >
              {item.icon && item.icon}
              <span className="text-xs">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
}
