import { PlusCircle, TriangleAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import { useEffect, useState } from "react";
import { deleteUser, getUsersData } from "../../adapters/users.adapter";
import SpinnerLouder from "../../components/SpinnerLouder";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalConfirmDelete from "../../components/modals/ModalConfirmDelete";


export default function Users() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showDataTable, setShowDataTable] = useState(false);
  const [showAlertSpinner, setShowAlertSpinner] = useState(false);

  const [dataUsers, setDataUsers] = useState({ data: [], columns: [] });
  const [showAlert, setShowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);

  const [userToDelete, setUserToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailToDelete, setEmailPersonToDelete] = useState("");

  const loadUsers = () => {
    setLoading(true);

    getUsersData()
      .then((data) => {
        if (data.data) {
          setDataUsers({
            data: data.data,
            columns: data.data.length > 0 ? Object.keys(data.data[0]) : [],
          });
          setShowDataTable(true);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener los usuarios");
          setMessageAlert1(data.message ?? "Algo falló");
          setShowDataTable(false);
        }
      })
      .catch((err) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener los usuarios");
        setMessageAlert1(err.message ?? "Algo falló");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (row) => {
    console.log(row.original);
    navigate(`/admin/users/edit/${row.original.uuid}`);
  }

  const handleConfirmDelete = (row) => {
    setUserToDelete(row.original.uuid);
    setShowConfirm(true);
    setEmailPersonToDelete(row.original.Email);
  }

  const handleDelete = async () => {
        setShowAlertSpinner(true);
    
        try {
          const response = await deleteUser(userToDelete);
    
          if (!response.ok) {
            setShowAlertSpinner(false);
            setShowAlert(true);
            setTitleAlert("Error al eliminar el usuario.");
            setMessageAlert1(response.message);
            setMessageAlert2(response.error?.details || "");
            return;
          }
    
          setUserToDelete(null);
          setShowAlertSpinner(false);
    
          loadUsers();
        } catch (error) {
          setShowAlertSpinner(false);
          setTitleAlert("Error al eliminar usuario.");
          setMessageAlert1('Algo fallo');
          console.error("Error deleting user:", error);
        }
      }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <>
      <Link
        to="/admin/users/create"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        <PlusCircle size={16} />
        <span>Nuevo Usuario</span>
      </Link>

      {showDataTable && (
        <DataTable objData={dataUsers} onClickEdit={handleEdit} onClickDelete={handleConfirmDelete} />
      )}

      {/* Modales */}
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

      {showConfirm && (
        <ModalConfirmDelete
          titleConfirm="¿Eliminar usuario?"
          messageConfirm1="Esta acción no se puede deshacer."
          messageConfirm2="Debe ingresar excatamente el correo de la persona"
          name={emailToDelete}
          onClickConfirm={() => {
            handleDelete();
            setShowConfirm(false);
          }}
          onClickCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}