// src/pages/modules/CreateModule.jsx

import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { getPermissionsData } from "../../adapters/permissions.adapter";
import { getUserFromToken } from "../../utils/auth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Input from "../../components/form/Input";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import RadioSiNo from "../../components/form/RadioSiNo";
import Select from "../../components/form/Select";
import { newModule } from "../../adapters/modules.adapter";

export default function CreateModule() {

  const [user, setUser] = useState(() => getUserFromToken());
  const [optionsPermissions, setOptionsPermissions] = useState([]);

  // Campos Formulario
  const [component, setComponent] = useState("");
  const [name, setName] = useState("");
  const [route, setRoute] = useState("");
  const [mostrar, setMostrar] = useState("1");
  const [permiso, setPermiso] = useState("");

  // Variables para Modales
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  // Variables para los permisos
  const [permissions, setPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [showAlertPermissions, setShowAlertPermissions] = useState(false);

  useEffect(() => {
    if (permissions.length > 0) {
      const mapped = permissions.map((permission) => {
        return { value: permission.id, text: permission.name };
      });
      setOptionsPermissions(mapped);
    }
  }, [permissions]);

  // Carga permisos
  useEffect(() => {
    getPermissionsData()
      .then((data) => {
        if (data.data) setPermissions(data.data);
        else setShowAlertPermissions(true);
      })
      .catch((error) => {
        setShowAlertPermissions(true);
        console.error("Error fetching permissions:", error);
      })
      .finally(() => setLoadingPermissions(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      const formData = new FormData();

      formData.append("component", component);
      formData.append("name", name);
      formData.append("route", route);
      formData.append("mostrar", mostrar);
      formData.append("permiso", permiso);
      formData.append("created_by_id", user.id);

      const response = await newModule(formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al agregar el modulo");
        setMessageAlert1(errorMsg);
        setMessageAlert2(response.error.details && response.error.details);
        console.error("Error adding module:", errorMsg);
        return;
      }

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Modulo agregado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El modulo ha sido agregado correctamente");

      // Limpieza de inputs
      setComponent("");
      setName("");
      setRoute("");
      setMostrar("1");
      setPermiso("");     

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al agregar Usuario.");
      setMessageAlert1(error.message ?? "Error inesperado");
      console.error("Error adding user:", error);
    }
  }

  return (
    <>
      <div className="sm:max-w-3xl mx-auto">
        <Link
          to="/admin/modules"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          <CircleChevronLeft size={16} />
          <span>Regresar</span>
        </Link>
      </div>

      {/* Formulario */}
      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Crear Modulo</h2>

        <form onSubmit={handleAdd} className="flex flex-wrap -mx-2 items-end">

          <Input
            widthPercent="50"
            textLabel="Componente"
            isRequired={true}
            type="text"
            placeholder="Componente"
            value={component}
            onChange={setComponent}
            name="component"
          />

          <Input
            widthPercent="50"
            textLabel="Nombre"
            isRequired={true}
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={setName}
            name="name"
          />

          <Input
            widthPercent="50"
            textLabel="Ruta"
            isRequired={true}
            type="text"
            placeholder="Ruta"
            value={route}
            onChange={setRoute}
            name="route"
          />

          <RadioSiNo
            widthPercent="50"
            textLabel="Mostrar"
            isRequired={true}
            value={mostrar}
            onChange={setMostrar}
            name="mostrar"
          />

          <Select
            widthPercent="50"
            textLabel="Permiso"
            isRequired={true}
            value={permiso}
            onChange={setPermiso}
            name="permiso"
            textFirstOption="Seleccione un permiso"
            options={optionsPermissions}
            louding={loadingPermissions}
            showAlert={showAlertPermissions}
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
    </>
  );

}