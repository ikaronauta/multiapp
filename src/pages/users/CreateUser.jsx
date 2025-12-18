// src/pages/users/CreateUser.jsx

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getBusinessData } from "../../adapters/business.adapter";
import { getRolesData } from "../../adapters/roles.adapter";
import { getUserFromToken } from "../../utils/auth";
import { Info, TriangleAlert, CircleChevronLeft } from "lucide-react";
import { newUser } from "../../adapters/users.adapter";

import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import SpinnerLouder from "../../components/SpinnerLouder";

export default function CreateUser() {
  const [businesses, setBusinesses] = useState([]);
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(<TriangleAlert className="text-red-600" size={24} />);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(user.businessId);
  const [selectedRole, setSelectedRole] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [user, setUser] = useState(() => getUserFromToken());
  const [userConfirmEmail, setUserConfirmEmail] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    if (!user) {
      setLoadingUser(false);
      return;
    }

    if (user.businessId === 1) {
      setIsSuperAdmin(true);

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
    } else {
      setIsSuperAdmin(false);
      setLoadingUser(false);
    }
  }, [user]);

  useEffect(() => {
    getRolesData()
      .then((data) => {
        if (data.data) {
          setRoles(data.data);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener los roles");
          setMessageAlert1(data.message ?? 'Algo fallo');
        }
      })
      .catch((data) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener los roles");
        setMessageAlert1(data.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectBusiness = (e) => {
    setSelectedBusiness(e.target.value);
    if (e.target.value === "1") {
      setSelectedRole("1");
      return;
    }

    setSelectedRole("");
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (userEmail !== userConfirmEmail) {
      setShowAlert(true);
      setTitleAlert("Error en los correos electrónicos.");
      setMessageAlert1("Los correos electrónicos no coinciden.");
      return;
    }

    if (userPassword !== userConfirmPassword) {
      setShowAlert(true);
      setTitleAlert("Error en las contraseñas.");
      setMessageAlert1("Las contraseñas no coinciden.");
      return;
    }

    setShowAlertSubmit(true);

    try {
      const formData = new FormData(e.target);
      const dataUser = Object.fromEntries(formData.entries());
      dataUser["createdById"] = user.id;

      if (!dataUser.businessId) {
        dataUser["businessId"] = user.businessId;
      }

      const response = await newUser(dataUser);

      if (!response.ok) {
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al agregar el Usuario.");
        setMessageAlert1(response.message);
        return;
      }

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Usuario agregado.");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El Usuario ha sido agregado correctamente.");
      setUserName("");
      setUserLastName("");
      setUserEmail("");
      setUserConfirmEmail("");
      setUserPassword("");
      setUserConfirmPassword("");
      setSelectedRole("");
      setSelectedBusiness("");
    } catch (error) {
      setShowAlertSubmit(false);
      setTitleAlert("Error al agregar Usuario.");
      setMessageAlert1(response.message);
      console.error("Error adding user:", error);
    }
  };

  if (loading || loadingUser) return <SpinnerLouder height="h-full" />;

  return (
    <>
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      {/* Formulario para agregar usuarios */}
      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Crear Usuario</h2>

        <form onSubmit={handleAddUser} className="flex flex-wrap -mx-2 items-end">
          {isSuperAdmin && (
            <div className="px-2 w-full sm:w-full mb-2">
              <label className="text-gray-900 text-sm">Empresa o Negocio</label>
              <select
                className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                onChange={handleSelectBusiness}
                name="businessId"
                value={selectedBusiness}
              >
                <option value="">Seleccione una Empresa o Negocio</option>

                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>{business.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Nombres</label>
            <input
              type="text"
              placeholder="Nombres del usuario"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              name="name"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Apellidos</label>
            <input
              type="text"
              placeholder="Apellidos del usuario"
              value={userLastName}
              onChange={(e) => setUserLastName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              name="lastName"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-full mb-2">
            <label className="text-gray-900 text-sm">Rol</label>
            <select
              value={selectedRole}
              className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setSelectedRole(e.target.value)}
              name="roleId"
            >
              <option value="">Seleccione un rol</option>

              {roles.map((rol) => (
                <option key={rol.id} value={rol.id} >{rol.name}</option>
              ))}

            </select>
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Correo electrónico</label>
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

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Confirmar correo electrónico</label>
            <input
              type="email"
              placeholder="Confirmar correo electrónico"
              value={userConfirmEmail}
              onChange={(e) => setUserConfirmEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              name="password"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Confirmar password</label>
            <input
              type="password"
              placeholder="Confirmar password"
              value={userConfirmPassword}
              onChange={(e) => setUserConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-full mb-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700"
            >
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
