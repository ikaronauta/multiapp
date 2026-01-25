// src/pages/permissions/CreateSectionModules.jsx

import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { getModulesData } from "../../adapters/modules.adapter";
import { getSectionsData } from "../../adapters/sections.adapter";
import { getUserFromToken } from "../../utils/auth";
import { Link } from "react-router-dom";
import { newSectionModules } from "../../adapters/sectionModules.adapter";
import { useEffect, useState } from "react";
import Input from "../../components/form/Input";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import Select from "../../components/form/Select";


export default function CreateSectionModules() {

  const [user, setUser] = useState(() => getUserFromToken());

  // Campos Formulario
  const [section, setSection] = useState("");
  const [module, setModule] = useState("");
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

  // Variables para las secciones
  const [optionsSections, setOptionsSection] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [showAlertSections, setShowAlertSections] = useState(false);

  // Variables para los modulos
  const [optionsModulos, setOptionsModulos] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [loadingModulos, setLoadingModulos] = useState(true);
  const [showAlertModulos, setShowAlertModulos] = useState(false);

  // Cargar secciones
  useEffect(() => {
    getSectionsData()
      .then((data) => {
        if (data.data) setSections(data.data);
        else setShowAlertSections(true);
      })
      .catch((error) => {
        setShowAlertSections(true);
        console.error("Error fetching sections:", error);
      })
      .finally(() => setLoadingSections(false));
  }, []);

  // Mapear las secciones se para el formato del select
  useEffect(() => {
    if (sections.length > 0) {
      const mapped = sections.map((item) => {
        return { value: item.id, text: `${item.Nombre} - ${item.Negocio}` };
      });
      setOptionsSection(mapped);
    }
  }, [sections]);

  // Cargar módulos
  useEffect(() => {
    getModulesData()
      .then((data) => {
        if (data.data) setModulos(data.data.filter((item) => item.Mostrar === 1));
        else setShowAlertModulos(true);
      })
      .catch((error) => {
        setShowAlertModulos(true);
        console.error("Error fetching modules:", error);
      })
      .finally(() => setLoadingModulos(false));
  }, []);

  // Mapear los modulos se para el formato del select
  useEffect(() => {
    if (modulos.length > 0) {
      const mapped = modulos.map((item) => {
        return { value: item.id, text: item.Nombre };
      });
      setOptionsModulos(mapped);
    }
  }, [modulos]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      const formData = new FormData();

      formData.append("section_id", section);
      formData.append("module_id", module);
      formData.append("position", position);
      formData.append("created_by_id", user.id);

      const response = await newSectionModules(formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al asignar el módulo");
        setMessageAlert1(errorMsg);
        setMessageAlert2(response?.error?.details ?? "");
        console.error("Error adding sectionModule:", errorMsg);
        return;
      }

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Modulo asignado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El modulo ha sido asignado correctamente");

      // Limpieza de inputs
      setSection("");
      setModule("");
      setPosition("");


    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al asignar módulo.");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(response?.error?.details ?? "");
      console.error("Error adding sectionModule:", error);
    }
  }

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/section_modules"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      {/* Formulario */}
      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Asignar Modulo</h2>

        <form onSubmit={handleAdd} className="flex flex-wrap -mx-2 items-end">

          <Select
            widthPercent="33"
            textLabel="Secciones"
            isRequired={true}
            value={section}
            onChange={setSection}
            name="rol"
            textFirstOption="Seleccione la sección"
            options={optionsSections}
            louding={loadingSections}
            showAlert={showAlertSections}
          />

          <Select
            widthPercent="33"
            textLabel="Módulos"
            isRequired={true}
            value={module}
            onChange={setModule}
            name="permission"
            textFirstOption="Seleccione el módulo"
            options={optionsModulos}
            louding={loadingModulos}
            showAlert={showAlertModulos}
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