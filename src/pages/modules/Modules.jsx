// src/pages/modules/Modules.jsx

import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import SpinnerLouder from "../../components/SpinnerLouder";
import { getModulesData } from "../../adapters/modules.adapter";

export default function Modules() {

  const navigate = useNavigate();

  const [data, setData] = useState({ data: [], columns: [] });
  const [showDataTable, setShowDataTable] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSpinner, setShowAlertSpinner] = useState(false);

  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);

  const loadData = () => {
      setLoading(true);
  
      getModulesData()
        .then((data) => {
          if (data.data) {
            setData({
              data: data.data,
              columns: data.data.length > 0 ? Object.keys(data.data[0]) : [],
            });
            setShowDataTable(true);
          } else {
            setShowAlert(true);
            setTitleAlert("Error al obtener....");
            setMessageAlert1(data.message ?? "Algo falló");
            setShowDataTable(false);
          }
        })
        .catch((err) => {
          setShowAlert(true);
          setTitleAlert("Error al obtener.....");
          setMessageAlert1(err.message ?? "Algo falló");
        })
        .finally(() => setLoading(false));
    }
  
    useEffect(() => {
      loadData();
    }, []);

  const handleEdit = (row) => {
    console.log(row.original);
    navigate(`/admin/modules/edit/${row.original.uuid}`);
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <>
      <Link
        to="/admin/modules/create"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        <PlusCircle size={16} />
        <span>Nuevo módulo</span>
      </Link>

      {/* Tabla */}
      {showDataTable && (
        <DataTable objData={data} onClickEdit={handleEdit} onClickDelete={() => { }} />
      )}
    </>
  );
}