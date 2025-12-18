// src/components/Navbar.jsx

import { sections } from "../data/data";

import SectionNavbar from "./SectionNavbar";

export default function Navbar({onLinkClick}) {

  return (
    <nav className="space-y-4">
      {sections.map((section, i) => {
        return <SectionNavbar key={i} objDataSection={section} onLinkClick={onLinkClick} />
      })}
    </nav>
  );
}