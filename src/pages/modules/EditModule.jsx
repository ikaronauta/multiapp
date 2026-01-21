import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ModalSpinner from "../../components/modals/ModelSpinner";
import ModalAlert from "../../components/modals/ModalAlert";
import { getUserFromToken } from "../../utils/auth";
import { use, useEffect, useState } from "react";
import SpinnerLouder from "../../components/SpinnerLouder";
import Input from "../../components/form/Input";
import RadioSiNo from "../../components/form/RadioSiNo";
import Select from "../../components/form/Select";
import { getPermissionsData } from "../../adapters/permissions.adapter";
import { getModuleByUUID, updatetModule } from "../../adapters/modules.adapter";


export default function EditModule() {

  const navigate = useNavigate();

  const [user] = useState(() => getUserFromToken());
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);

  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const [updateOk, setUpdateOk] = useState(false);

  // Campos Formulario
  const [component, setComponent] = useState("");
  const [name, setName] = useState("");
  const [route, setRoute] = useState("");
  const [mostrar, setMostrar] = useState("");
  const [permiso, setPermiso] = useState("");
  const [optionsPermissions, setOptionsPermissions] = useState([]);

  // Variables para los permisos
  const [permissions, setPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [showAlertPermissions, setShowAlertPermissions] = useState(false);

  useEffect(() => {
    if (permissions.length > 0) {
      const mapped = permissions.map((permission) => {
        return { value: permission.id, text: permission.Nombre };
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

  useEffect(() => {
    getModuleByUUID(id)
      .then((data) => {
        if (data.data) {
          setComponent(data.data.component);
          setName(data.data.name);
          setRoute(data.data.route);
          setMostrar(data.data.mostrar === 1 ? "1" : "0");
          setPermiso(data.data.permiso);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener el modulo");
          setMessageAlert1(data.message ?? 'Algo fallo');
          setMessageAlert2(data.error.details ? data.error.details : "");
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener el modulo");
        setMessageAlert1(error.message ?? 'Algo fallo');
        setMessageAlert2(error.details ? error.details : "");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      const formData = new FormData();

      formData.append("component", component);
      formData.append("name", name);
      formData.append("route", route);
      formData.append("mostrar", mostrar);
      formData.append("permiso", permiso);
      formData.append("updated_by_id", user.id);

      const response = await updatetModule(id, formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al editar el modulo");
        setMessageAlert1(errorMsg);
        setMessageAlert2(response?.error?.details ?? "");
        console.error("Error editing module:", errorMsg);
        return;
      }

      setUpdateOk(true);
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Modulo editado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El modulo ha sido editado correctamente");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al editar el modulo");
      setMessageAlert1(error.message ?? "Error inesperado");
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/modules"
        className="relative inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Editar Modulo</h2>

        <form onSubmit={handleEdit} className="flex flex-wrap -mx-2 items-end">

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
            widthPercent="33"
            textLabel="Ruta"
            isRequired={true}
            type="text"
            placeholder="Ruta"
            value={route}
            onChange={setRoute}
            name="route"
          />

          <RadioSiNo
            widthPercent="33"
            textLabel="Mostrar"
            isRequired={true}
            value={mostrar}
            onChange={setMostrar}
            name="mostrar"
          />

          <Select
            widthPercent="33"
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
              Editar
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
            onClick={() => {
              updateOk && navigate(`/admin/modules`);
              setShowAlert(false);
            }}
          />
        )}

        {showAlertSubmit && (
          <ModalSpinner titleModal="Procesando..." messageModal="" iconComponent={<Info className="text-red-600" size={24} />} />
        )}
      </>
    </div>
  );
}