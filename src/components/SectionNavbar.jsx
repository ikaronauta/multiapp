// src/components/SectionNavbar.jsx

import { Link } from "react-router-dom";

import { getUserFromToken, canAccess, canAccessSection} from "../utils/auth";

export default function SectionNavbar({ objDataSection, onLinkClick }) {

  const user = getUserFromToken();

  if (!user) return null;

  // if (!canAccess(objDataSection, user)) return null;
  
  if (!canAccessSection(objDataSection, user)) return null;

  return (
    <section className="mt-6 border border-gray-700 rounded-md p-3 space-y-2">
      <h3 className="text-xs text-gray-400">{objDataSection.title}</h3>

      {objDataSection.items
        .filter(item => canAccess(item, user))
        .map((item, i) => (
          <Link
            key={i}
            to={item.route}
            className="block text-sm hover:text-gray-300"
            onClick={onLinkClick}
          >
            {item.title}
          </Link>
        ))}
    </section>
  );
}
