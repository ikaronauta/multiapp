// src/pages/sections/Roles.jsx

import { useEffect, useState } from "react";
import SpinnerLouder from "../../components/SpinnerLouder";
import { Link, useNavigate } from "react-router-dom";
import { Info, PlusCircle, TriangleAlert } from "lucide-react";
import { deleteRol, getRolesData } from "../../adapters/roles.adapter";
import DataTable from "../../components/DataTable";
import ModalConfirmDelete from "../../components/modals/ModalConfirmDelete";
import ModalSpinner from "../../components/modals/ModelSpinner";
import ModalAlert from "../../components/modals/ModalAlert";


export default function Roles() {

  const [loading, setLoading] = useState(true);
  const [showDataTable, setShowDataTable] = useState(false);
  const [roles, setRoles] = useState({ data: [], columns: [] });
  const [showAlert, setShowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);

  const [rolToDelete, setRolToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [codeRolToDelete, setCodeRolToDelete] = useState("");
  const [showAlertSpinner, setShowAlertSpinner] = useState(false);

  const navigate = useNavigate();

  const loadRoles = () => {
    setLoading(true);

    getRolesData()
      .then((data) => {
        if (data.data) {
          setRoles({
            data: data.data,
            columns: data.data.length > 0 ? Object.keys(data.data[0]) : [],
          });
          setShowDataTable(true);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener los roles");
          setMessageAlert1(data.message ?? "Algo falló");
          setShowDataTable(false);
        }
      })
      .catch((err) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener los roles");
        setMessageAlert1(err.message ?? "Algo falló");
        setShowDataTable(false);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadRoles();
  }, []);

  const handleEdit = (row) => {
    console.log(row.original);
    navigate(`/admin/roles/edit/${row.original.uuid}`);
  }

  const handleConfirmDeleteRol = (row) => {
    setRolToDelete(row.original.uuid);
    setShowConfirm(true);
    setCodeRolToDelete(row.original.Codigo);
  }

  const handleDelete = async () => {
    setShowAlertSpinner(true);

    try {
      const response = await deleteRol(rolToDelete);

      if (!response.ok) {
        setShowAlertSpinner(false);
        setShowAlert(true);
        setTitleAlert("Error al eliminar el rol.");
        setMessageAlert1(response.message);
        return;
      }

      setCodeRolToDelete(null);
      setShowAlertSpinner(false);

      loadRoles();
    } catch (error) {
      setShowAlertSpinner(false);
      setTitleAlert("Error al eliminar rol.");
      setMessageAlert1('Algo fallo');
      console.error("Error deleting rol:", error);
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <>
      <Link
        to="/admin/roles/create"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        <PlusCircle size={16} />
        <span>Nuevo rol</span>
      </Link>

      {/* Tabla */}
      {showDataTable && (
        <DataTable objData={roles} onClickEdit={handleEdit} onClickDelete={handleConfirmDeleteRol} />
      )}

      {showConfirm && (
        <ModalConfirmDelete
          titleConfirm="¿Eliminar Rol?"
          messageConfirm1="Esta acción no se puede deshacer."
          messageConfirm2="Debe ingresar excatamente el código del rol"
          name={codeRolToDelete}
          onClickConfirm={() => {
            handleDelete();
            setShowConfirm(false);
          }}
          onClickCancel={() => setShowConfirm(false)}
        />
      )}

      {showAlertSpinner && (
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
          iconComponent={iconComponent}
          onClick={() => setShowAlert(false)}
        />
      )}
    </>
  );
}