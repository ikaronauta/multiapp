import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getRolById, updatetRol } from "../../adapters/roles.adapter";
import SpinnerLouder from "../../components/SpinnerLouder";
import { getUserFromToken } from "../../utils/auth";
import ModalSpinner from "../../components/modals/ModelSpinner";
import ModalAlert from "../../components/modals/ModalAlert";


export const EditRol = () => {

  const navigate = useNavigate();

  const [user] = useState(() => getUserFromToken());
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [updateOk, setUpdateOk] = useState(false);

  const [codeRol, setCodeRol] = useState("");
  const [nameRol, setNameRol] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("activo");

  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  useEffect(() => {
    getRolById(id)
      .then((data) => {
        if (data.data) {
          const { code, name, status } = data.data;
          setCodeRol(code);
          setNameRol(name);
          setSelectedStatus(status);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener el rol");
          setMessageAlert1(data.message ?? 'Algo fallo');
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener el rol");
        setMessageAlert1(error.message ?? 'Algo fallo');
      })
      .finally(setLoading(false));
  }, []);

  const handleEditBusiness = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {
      const formData = new FormData();

      formData.append("code", codeRol);
      formData.append("name", nameRol);
      formData.append("status", selectedStatus);
      formData.append("updated_by_id", user.id);

      const response = await updatetRol(id, formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al editar el negocio");
        setMessageAlert1(errorMsg);
        return;
      }

      setUpdateOk(true);
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Negocio editado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El negocio ha sido editado correctamente");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al agregar negocio");
      setMessageAlert1(error.message ?? "Error inesperado");
    }
  };

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/roles"
        className="relative inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Editar Negocio</h2>

        <form onSubmit={handleEditBusiness} className="flex flex-wrap -mx-2 items-end">

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">
              Código Rol
              <span className="text-red-700 font-extrabold"> *</span>
            </label>
            <input
              type="text"
              placeholder="Código Rol"
              value={codeRol}
              onChange={(e) => setCodeRol(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="codeRol"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">
              Nombre Rol
              <span className="text-red-700 font-extrabold"> *</span>
            </label>
            <input
              type="text"
              placeholder="Nombre Rol"
              value={nameRol}
              onChange={(e) => setNameRol(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="codeRol"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-full mb-2">
            <label className="text-gray-900 text-sm">
              Estado
              <span className="text-red-700 font-extrabold"> *</span>
            </label>
            <select
              className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
            >
              <option value="" disabled>Seleccione un estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>

          <div className="px-2 w-full sm:w-full mb-2">
            <button type="submit" className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700">
              Editar
            </button>
          </div>

        </form>
      </div>

      {/* Modales */}
      {showAlert && (
        <ModalAlert
          titleAlert={titleAlert}
          messageAlert1={messageAlert1}
          messageAlert2={messageAlert2}
          textButton="Cerrar"
          iconComponent={iconComponentModalAlert}
          onClick={() => {
            updateOk && navigate(`/admin/roles`);
            setShowAlert(false);
          }}
        />
      )}

      {showAlertSubmit && (
        <ModalSpinner titleModal="Procesando..." messageModal="" iconComponent={<Info className="text-red-600" size={24} />} />
      )}
    </div>
  );
}