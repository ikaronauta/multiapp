// src/components/Navbar.jsx

import { useEffect, useState } from "react";
import SectionNavbar from "./SectionNavbar";
import { getMenuData } from "../adapters/menu.adapter";
import { House, TriangleAlert } from "lucide-react";
import { getBusinessData } from "../adapters/business.adapter";
import SpinnerLouder from "./SpinnerLouder";
import ModalAlert from "./modals/ModalAlert";
import { getUserFromToken } from "../utils/auth";

export default function Navbar({ onLinkClick }) {
  const [sections, setSections] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState("1");
  const [businessMenu, setBusinessMenu] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  useEffect(() => {
    const user = getUserFromToken();
    if (user.businessId === 1 && user.roleId === 1) setIsSuperAdmin(true);
  });

  useEffect(() => {
    const loadMenu = async () => {
      const data = await getMenuData(selectedBusiness);
      setSections(data.data || data);
    };
    loadMenu();
  }, [selectedBusiness]);

  useEffect(() => {
    getBusinessData()
      .then((data) => {
        if (data.data) {
          setBusinesses(data.data);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener los negocios");
          setMessageAlert1(data.message ?? 'Algo fallo');
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener los negocios");
        setMessageAlert1(error.message ?? 'Algo fallo');
      })
      .finally(() => setLoadingUser(false));
  }, []);

  const dataHome = {
    id: "home",
    name: "Dashboard",
    items: [
      {
        title: "Dashboard",
        route: "/",
        icon: <House size={24} /> // pasamos el icono aquí
      }
    ]
  };

  const handleSelectBusiness = (e) => {
    setSelectedBusiness(e.target.value);
  };

  if (loadingUser) return <SpinnerLouder height="h-full" />;

  return (
    <nav className="space-y-4">

      {isSuperAdmin && <select
        className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 mt-4 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        onChange={handleSelectBusiness}
        name="businessId"
        value={selectedBusiness}
      >
        {businesses.map((business) => (
          <option key={business.id} value={business.id}>{business.name}</option>
        ))}
      </select>}


      <SectionNavbar
        objDataSection={dataHome}
        onLinkClick={onLinkClick}
      />

      {sections.map((section, i) => (
        <SectionNavbar
          key={section.id || i}
          objDataSection={section}
          onLinkClick={onLinkClick}
        />
      ))}

      {showAlert && (
        <ModalAlert
          titleAlert={titleAlert}
          messageAlert1={messageAlert1}
          messageAlert2={messageAlert2}
          textButton="Cerrar"
          iconComponent={iconComponentModalAlert}
          onClick={() => setShowAlert(false)}
        />
      )}
    </nav>
  );
}
