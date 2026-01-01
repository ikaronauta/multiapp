// src/components/FooterNavbar.jsx

export default function FooterNavbar() {

  const year = new Date().getFullYear();

  return (
    <footer className="text-xs text-gray-500 border-t border-gray-700 pt-3">
      <span className="flex items-center justify-between text-gray-500">
        © {year} MultiApp
        <span className="text-gray-600 ml-2">v1.0.0</span>
      </span>
    </footer>
  );
}