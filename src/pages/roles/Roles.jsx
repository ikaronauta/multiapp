import { useEffect, useState } from "react";
import SpinnerLouder from "../../components/SpinnerLouder";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { getRolesData } from "../../adapters/roles.adapter";
import DataTable from "../../components/DataTable";


export default function Roles() {

  const [loading, setLoading] = useState(true);
  const [showDataTable, setShowDataTable] = useState(false);
  const [roles, setRoles] = useState([]);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [dataRoles, setDataRoles] = useState({ data: [], columns: [] });

  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleEdit = (row) => {
    console.log(row.original);
    navigate(`/admin/roles/edit/${row.original.uuid}`);
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

      {showDataTable && (
        <DataTable objData={roles} onClickEdit={handleEdit} onClickDelete={() => { }} />
      )}
    </>
  );
}