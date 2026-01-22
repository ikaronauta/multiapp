import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { getUserFromToken } from "../../utils/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import SpinnerLouder from "../../components/SpinnerLouder";
import Select from "../../components/form/Select";
import { getAssignedPermissionByUUID, updatetAssignedPermission } from "../../adapters/assignedPermissions.adapter";
import { getRolesData } from "../../adapters/roles.adapter";
import { getPermissionsData } from "../../adapters/permissions.adapter";


export default function EditAssignedPermissions() {

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
  const [rol, setRol] = useState("");
  const [permission, setPermission] = useState("");

  // Variables para los roles
  const [optionsRoles, setOptionsRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showAlertRoles, setShowAlertRoles] = useState(false);

  // Variables para los permisos
  const [optionsPermissions, setOptionsPermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [showAlertPermissions, setShowAlertPermissions] = useState(false);

  // Cargar roles
  useEffect(() => {
    getRolesData()
      .then((data) => {
        if (data.data) setRoles(data.data);
        else setShowAlertRoles(true);
      })
      .catch((error) => {
        setShowAlertRoles(true);
        console.error("Error fetching roles:", error);
      })
      .finally(() => setLoadingRoles(false));
  }, []);

  // Mapear los roles para el formato del select
  useEffect(() => {
    if (roles.length > 0) {
      const mapped = roles.map((item) => {
        return { value: item.ID, text: item.Rol };
      });
      setOptionsRoles(mapped);
    }
  }, [roles]);

  // Cargar permisos
  useEffect(() => {
    getPermissionsData()
      .then((data) => {
        if (data.data) setPermissions(data.data);
        else setShowAlertPermissions(true);
      })
      .catch((error) => {
        setShowAlertPermissions(true);
        console.error("Error fetching permission:", error);
      })
      .finally(() => setLoadingPermissions(false));
  }, []);

  // Mapear los permisos para el formato del select
  useEffect(() => {
    if (permissions.length > 0) {
      const mapped = permissions.map((item) => {
        return { value: item.id, text: item.Nombre };
      });
      setOptionsPermissions(mapped);
    }
  }, [permissions]);

  useEffect(() => {
    getAssignedPermissionByUUID(id)
      .then((data) => {
        if (data.data) {
          setRol(data.data.role_id);
          setPermission(data.data.permission_id);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener el permiso asignado");
          setMessageAlert1(data.message ?? 'Algo fallo');
          setMessageAlert2(data.error.details ? data.error.details : "");
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener el permiso asignado");
        setMessageAlert1(error.message ?? 'Algo fallo');
        setMessageAlert2(error.details ? error.details : "");
      })
      .finally(() => setLoading(false));
  }, [optionsRoles, optionsPermissions]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      const formData = new FormData();

      formData.append("role_id", rol);
      formData.append("permission_id", permission);
      formData.append("updated_by_id", user.id);
      
      const response = await updatetAssignedPermission(id, formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al editar la persona");
        setMessageAlert1(errorMsg);
        setMessageAlert2(response?.error?.details ?? "");
        console.error("Error adding person:", errorMsg);
        return;
      }

      setUpdateOk(true);
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Persona editado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("La persona ha sido editado correctamente");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al editar la persona");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(error.details ? error.details : "");
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/assigned_permissions"
        className="relative inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Editar Asignación de Permiso</h2>

        <form onSubmit={handleEdit} className="flex flex-wrap -mx-2 items-end">

          <Select
            widthPercent="50"
            textLabel="Rol"
            isRequired={true}
            value={rol}
            onChange={setRol}
            name="rol"
            textFirstOption="Seleccione el rol"
            options={optionsRoles}
            louding={loadingRoles}
            showAlert={showAlertRoles}
          />

          <Select
            widthPercent="50"
            textLabel="Permiso"
            isRequired={true}
            value={permission}
            onChange={setPermission}
            name="permission"
            textFirstOption="Seleccione el permiso"
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
              updateOk && navigate(`/admin/assigned_permissions`);
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