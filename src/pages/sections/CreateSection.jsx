// src/pages/sections/CreateSection.jsx

import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { getUserFromToken } from "../../utils/auth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import { getBusinessesData } from "../../adapters/business.adapter";
import { newSection } from "../../adapters/sections.adapter";


export default function CreateSection() {

  const [user, setUser] = useState(() => getUserFromToken());

  // Campos Formulario
  const [business, setBusiness] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  
  // Variables para Modales
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );
  
  // Variables para los negocios
  const [optionsBusinesses, setOptionsBusinesses] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [showAlertPermissions, setShowAlertPermissions] = useState(false);

  // Cargar negocios
  useEffect(() => {
    getBusinessesData()
      .then((data) => {
        if (data.data) setBusinesses(data.data);
        else setShowAlertPermissions(true);
      })
      .catch((error) => {
        setShowAlertPermissions(true);
        console.error("Error fetching businesses:", error);
      })
      .finally(() => setLoadingPermissions(false));
  }, []);

  // Mapear los negocios para el formato del select
  useEffect(() => {
    if (businesses.length > 0) {
      const mapped = businesses.map((item) => {
        return { value: item.ID, text: item.Nombre };
      });
      setOptionsBusinesses(mapped);
    }
  }, [businesses]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      const formData = new FormData();

      formData.append("business_id", business);
      formData.append("name", name);
      formData.append("position", position);
      formData.append("created_by_id", user.id);

      const response = await newSection(formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al agregar la sección");
        setMessageAlert1(errorMsg);
        setMessageAlert2(response?.error?.details ?? "");
        console.error("Error adding section:", errorMsg);
        return;
      }

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Sección agregada");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("La sección ha sido agregado correctamente");

      // Limpieza de inputs
      setBusiness("");
      setName("");
      setPosition("");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al agregar Usuario.");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(response?.error?.details ?? "");
      console.error("Error adding user:", error);
    }
  }

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/sections"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      {/* Formulario */}
      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Crear Sección</h2>

        <form onSubmit={handleAdd} className="flex flex-wrap -mx-2 items-end">

          <Select
            widthPercent="33"
            textLabel="Negocio"
            isRequired={true}
            value={business}
            onChange={setBusiness}
            name="businesses"
            textFirstOption="Seleccione el negocio"
            options={optionsBusinesses}
            louding={loadingPermissions}
            showAlert={showAlertPermissions}
          />

          <Input
            widthPercent="33"
            textLabel="Nombre sección"
            isRequired={true}
            type="text"
            placeholder="Nombre sección"
            value={name}
            onChange={setName}
            name="name"
          />

          <Input
            widthPercent="33"
            textLabel="Posición"
            isRequired={true}
            type="number"
            placeholder="Posición"
            value={position}
            onChange={setPosition}
            name="position"
          />

          <div className="px-2 w-full sm:w-full mb-2 mt-2">
            <button type="submit" className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700">
              Agregar
            </button>
          </div>
        </form>
      </div>

      {/* Modales */}
      <>
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

        {showAlertSubmit && (
          <ModalSpinner
            titleModal="Procesando..."
            messageModal=""
            iconComponent={<Info className="text-red-600" size={24} />}
          />
        )}
      </>
    </div>
  );
}