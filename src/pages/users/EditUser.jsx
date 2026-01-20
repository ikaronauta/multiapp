import { AlertCircle, CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBusinessesData } from "../../adapters/business.adapter";
import SpinnerLouder from "../../components/SpinnerLouder";
import { getUserFromToken } from "../../utils/auth";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import { getRolesData } from "../../adapters/roles.adapter";
import { getUserByUUID, updateUser } from "../../adapters/users.adapter";
import { getPersonsData } from "../../adapters/persons.adapter";


export default function EditUser() {

  const navigate = useNavigate();

  const { id } = useParams();
  const [user, setUser] = useState(() => getUserFromToken());

  const [businesses, setBusinesses] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);

  const [userEmail, setUserEmail] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const [businessesOk, setBusinessesOk] = useState(false);
  const [rolesOk, setRolesOk] = useState(false);
  const [personsOk, setPersonsOk] = useState(false);
  const [updateOk, setUpdateOk] = useState(false);

  const [persons, setPersons] = useState([]);
  const [loadingPersons, setLoadingPersons] = useState(true);
  const [showAlertPersons, setShowAlertPersons] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState("");

  useEffect(() => {
    getBusinessesData()
      .then((data) => {
        if (data.data) {
          setBusinesses(data.data);
          setBusinessesOk(true);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener los negocios");
          setMessageAlert1(data.message ?? 'Algo fallo');
          setBusinessesOk(false);
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener los negocios");
        setMessageAlert1(error.message ?? 'Algo fallo');
        setBusinessesOk(false);
      })
      .finally(() => setLoadingBusinesses(false));
  }, []);

  useEffect(() => {
      getPersonsData()
        .then((data) => {
          if (data.data) {
            setPersons(data.data);
            setPersonsOk(true);
          } else {
            setLoadingPersons(false);
            setPersonsOk(false);
          }
          
        })
        .catch((error) => {
          console.log(error);
          setShowAlertPersons(false);
          setPersonsOk(false);
        })
        .finally(() => setLoadingPersons(false));
    }, []);

  useEffect(() => {
    getRolesData()
      .then((data) => {
        if (data.data) {
          setRoles(data.data);
          setRolesOk(true);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener los roles");
          setMessageAlert1(data.message ?? 'Algo fallo');
          setRolesOk(false);
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener los roles");
        setMessageAlert1(error.message);
        setRolesOk(false);
      })
      .finally(() => setLoadingRoles(false));
  }, []);

  useEffect(() => {
    if (!businessesOk || !rolesOk || !personsOk) return;

    getUserByUUID(id)
      .then((data) => {
        if (data.data) {
          setSelectedStatus(data.data.status);
          setSelectedPerson(data.data.person_id);
          setUserEmail(data.data.email);
          setSelectedRole(data.data.role_id);
          setSelectedBusiness(data.data.business_id);
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoadingUser(false))
  }, [businesses, roles]);

  const handleEditUser = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {
      const formData = new FormData();

      formData.append("business_id", selectedBusiness);
      formData.append("person_id", selectedPerson);
      formData.append("email", userEmail);
      formData.append("rol_id", selectedRole);
      formData.append("status", selectedStatus);
      formData.append("updated_by_id", user.id);

      const response = await updateUser(id, formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al editar el usuario");
        setMessageAlert1(errorMsg);
        setMessageAlert2(response?.error?.details ?? "");
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

  if (loadingRoles || loadingBusinesses || loadingUser) return <SpinnerLouder height="h-full" />;

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/users"
        className="relative inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Editar Usuario</h2>

        <form onSubmit={handleEditUser} className="flex flex-wrap -mx-2 items-end">
          <div className="px-2 w-full sm:w-full mb-2">
            <label className="text-gray-900 text-sm">
              Empresa o Negocio
              <span className="text-red-700 font-extrabold"> *</span>
            </label>
            <select
              className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setSelectedBusiness(e.target.value)}
              name="businessId"
              value={selectedBusiness}
              required
            >
              <option value="">Seleccione una Empresa o Negocio</option>

              {businesses.map((business) => (
                <option key={business.ID} value={business.ID}>{business.Nombre}</option>
              ))}
            </select>
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
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
              <option value="bloqueado">Bloqueado</option>
            </select>
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">
              Persona
              {loadingPersons &&
                <div className="inline-block ml-2 w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>}

              {!showAlertPersons && (
                <span className="ml-2 top-0 right-6 inline-flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Ocurrió un problema</span>
                </span>
              )}
            </label>
            <select
              className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="businessType"
              value={selectedPerson}
              onChange={(e) => {
                setSelectedPerson(e.target.value);
                console.log(persons);
                const personSelected = persons.find((person) => {return person.id == e.target.value});
                setUserEmail(!personSelected ? "" : personSelected.Email ? personSelected.Email : "");
              }}
            >
              <option value="">Seleccione una persona</option>

              {persons.map((person) => (
                <option key={person.id} value={person.id} >{`${person.Nombre} ${person.Apellidos}`}</option>
              ))}
            </select>
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">
              Rol
              <span className="text-red-700 font-extrabold"> *</span>
            </label>
            <select
              value={selectedRole}
              className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setSelectedRole(e.target.value)}
              name="roleId"
            >
              <option value="">Seleccione un rol</option>

              {roles.map((rol) => (
                <option key={rol.ID} value={rol.ID} >{rol.Rol}</option>
              ))}

            </select>
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">
              Correo electrónico
              <span className="text-red-700 font-extrabold"> *</span>
            </label>
            <input
              type="email"
              placeholder="Correo electrónico del usuario"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              name="email"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-full mb-2 mt-2">
            <button type="submit" className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700">
              Editar
            </button>
          </div>

        </form>

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

          {showAlert && (
            <ModalAlert
              titleAlert={titleAlert}
              messageAlert1={messageAlert1}
              messageAlert2={messageAlert2}
              textButton="Cerrar"
              iconComponent={iconComponentModalAlert}
              onClick={() => {
                updateOk && navigate(`/admin/users`);
                setShowAlert(false);
              }}
            />
          )}
        </>
      </div>
    </div>
  );
}