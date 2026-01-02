import { PlusCircle, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import DataTable from "../../components/DataTable";
import { useEffect, useState } from "react";
import { getUsersData } from "../../adapters/users.adapter";
import SpinnerLouder from "../../components/SpinnerLouder";
import ModalAlert from "../../components/modals/ModalAlert";


export default function Users() {

  const [loading, setLoading] = useState(true);
  const [showDataTable, setShowDataTable] = useState(false);
  const [dataUsers, setDataUsers] = useState({ data: [], columns: [] });
  const [showAlert, setShowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);

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

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <>
      <Link
        to="/admin/users/create"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        <PlusCircle size={16} />
        <span>Nuevo usuario</span>
      </Link>

      {showDataTable && (
        <DataTable objData={dataUsers} onClickEdit={() => { }} onClickDelete={() => { }} />
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
    </>
  );
}