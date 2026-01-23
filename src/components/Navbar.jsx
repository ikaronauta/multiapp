// src/components/Navbar.jsx

import { getBusinessesData } from "../adapters/business.adapter";
import { getMenuData } from "../adapters/menu.adapter";
import { getUserFromToken } from "../utils/auth";
import { House, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalAlert from "./modals/ModalAlert";
import SectionNavbar from "./SectionNavbar";
import SpinnerLouder from "./SpinnerLouder";

export default function Navbar({ onLinkClick }) {
  const [businesses, setBusinesses] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const navigate = useNavigate();
  const user = getUserFromToken();

  useEffect(() => {
    setSelectedBusiness(user.businessId);

    if (user?.businessId === 1 && user?.roleId === 1) {
      setIsSuperAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (selectedBusiness) {
      const loadMenu = async () => {
        const data = await getMenuData(selectedBusiness);
        setSections(data.data || data);
      };
      loadMenu();
    }
  }, [selectedBusiness]);

  useEffect(() => {
    if (isSuperAdmin) {
      getBusinessesData()
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
    } else {
      setLoadingUser(false);
    }
  }, [isSuperAdmin]);

  const dataHome = {
    id: "home",
    name: "Dashboard",
    items: [
      {
        title: "Dashboard",
        route: "/",
        icon: <House size={24} />,
        show: 1,
      }
    ],
  };

  const handleSelectBusiness = (e) => {
    setSelectedBusiness(e.target.value);
    navigate("/");
  };

  if (loadingUser) return <SpinnerLouder height="h-full" />;

  return (
    <nav className="space-y-4">

      {isSuperAdmin &&
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 h-10 w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          onChange={handleSelectBusiness}
          value={selectedBusiness}
          name="businessId"
        >

          {businesses.map((business) => (
            <option key={`bus-${business.ID}`} value={business.ID} className="text-blue-900">{business.Nombre}</option>
          ))}
        </select>}


      <SectionNavbar
        objDataSection={dataHome}
        onLinkClick={onLinkClick}
      />

      {sections.map((section, i) => (
        <SectionNavbar
          key={`section-${section.id ?? i}`}
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
