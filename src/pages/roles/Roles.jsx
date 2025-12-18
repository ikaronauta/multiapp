// src/pages/AdminRoles.jsx

import { Trash, TriangleAlert, Info, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

import { deleteRol, editRol, getRolesData, newRol } from "../../adapters/roles.adapter";


import ModalAlert from "../../components/modals/ModalAlert";
import ModalConfirm from "../../components/modals/ModalConfirm";
import ModalEditRol from "../../components/modals/ModalEditRol";
import ModalSpinner from "../../components/modals/ModelSpinner";
import SpinnerLouder from "../../components/SpinnerLouder";

export default function AdminRoles() {
  const [currentRolName, setCurrentRolName] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);
  const [loading, setLoading] = useState(true);
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [roles, setRoles] = useState([]);
  const [rolName, setRolName] = useState("");
  const [rolToDelete, setRolToDelete] = useState(null);
  const [rolToEdit, setRolToEdit] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSpinner, setShowAlertSpinner] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");

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

  const handleAddRol = async (e) => {
    e.preventDefault();
    setShowAlertSpinner(true);

    if (!rolName.trim()) {
      setShowAlertSpinner(false);
      setShowAlert(true);
      setTitleAlert("Información incompleta.");
      setMessageAlert1("Debe Ingresar toda la información.");
      return;
    }

    try {
      const response = await newRol(rolName);

      if (!response.ok) {
        setShowAlertSpinner(false);
        setShowAlert(true);
        setTitleAlert("Error al agregar rol.");
        setMessageAlert1(response.message);
        return;
      }

      setRoles((prev) => [...prev, response.data]);
      setRolName("");
      setShowAlertSpinner(false);
    } catch (error) {
      setShowAlertSpinner(false);
      setTitleAlert("Error al agregar rol.");
      setMessageAlert1(response.message);
      console.error("Error adding role:", error);
    }
  };

  const handleDeleteRol = async (id) => {
    setShowAlertSpinner(true);

    try {
      const response = await deleteRol(id);

      if (!response.ok) {
        setShowAlertSpinner(false);
        setShowAlert(true);
        setTitleAlert("Error al eliminar rol.");
        setMessageAlert(response.message);
        return;
      }

      setRoles((prev) => prev.filter((rol) => rol.id !== id));
      setRolToDelete(null);
      setShowAlertSpinner(false);
    } catch (error) {
      setShowAlertSpinner(false);
      setTitleAlert("Error al eliminar rol.");
      setMessageAlert1('Algo fallo');
      console.error("Error deleting role:", error);
    }
  };

  const handleEditRol = async (idRol, newName) => {
    try {
      setShowAlertSpinner(true);

      const response = await editRol(idRol, newName);

      if (response.ok) {
        setShowAlertSpinner(false);
        setRoles((prev) =>
          prev.map((rol) => (rol.id === idRol ? { ...rol, name: newName } : rol))
        );
      } else {
        setShowAlertSpinner(false);
        setShowAlert(true);
        setTitleAlert("Error al actualizar rol");
        setMessageAlert1(response.message);
      }
    } catch (error) {
      setShowAlertSpinner(false);
      setShowAlert(true);
      setTitleAlert("Error al actualizar rol");
      setMessageAlert1("Algo falló");
      console.error("Error updating role:", error);
    }
  };

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <>
      {/* Formulario para agregar roles */}
      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Crear Rol</h2>

        <form onSubmit={handleAddRol} className="flex flex-wrap -mx-2 items-end">
          <div className="px-2 w-full sm:w-[70%] mb-2">
            <label className="text-gray-900 text-sm">Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              value={rolName}
              onChange={(e) => setRolName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="px-2 w-full sm:w-[30%] mb-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700"
            >
              Agregar
            </button>
          </div>
        </form>

      </div>

      {/* Lista de roles */}
      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 mt-4">
        <h2 className="text-gray-900 text-2xl font-bold">Lista de Roles</h2>
        <ul className="space-y-2 mt-4">
          {roles.map((rol) => (
            <li
              key={rol.id}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
            >
              <span>{rol.name}</span>

              {/* Botones */}
              <div className="flex items-center gap-3">
                {/* Botón Editar */}
                <button
                  onClick={() => {
                    console.log(rol);
                    setRolToEdit(rol);
                    setCurrentRolName(rol.name);
                    setShowModalEdit(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => {
                    setRolToDelete(rol.id);
                    setShowConfirm(true);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={18} />
                </button>
              </div>

            </li>
          ))}
        </ul>
      </div>

      {/* Modales */}
      <>
        {showConfirm && (
          <ModalConfirm
            titleConfirm="¿Eliminar rol?"
            messageConfirm="Esta acción no se puede deshacer."
            onClickConfirm={() => {
              handleDeleteRol(rolToDelete);
              setShowConfirm(false);
            }}
            onClickCancel={() => setShowConfirm(false)}
          />
        )}

        {showAlert && (
          <ModalAlert
            titleAlert={titleAlert}
            messageAlert1={messageAlert1}
            messageAlert2={messageAlert2}
            textButton="Cerrar"
            iconComponent={iconComponent}
            onClick={() => setShowAlert(false)}
          />
        )}

        {showAlertSpinner && (
          <ModalSpinner
            titleModal="Procesando..."
            messageModal=""
            iconComponent={<Info className="text-red-600" size={24} />}
          />
        )}

        {showModalEdit && (
          <ModalEditRol
            currentName={currentRolName}
            onSave={(newName) => {
              handleEditRol(rolToEdit.id, newName); // ✅ envía id y string
              setShowModalEdit(false);
            }}
            onCancel={() => setShowModalEdit(false)}
          />
        )}
      </>
    </>
  );
}
