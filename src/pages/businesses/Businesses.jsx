// src/pages/users/Users.jsx

import { Link } from "react-router-dom";
import { PlusCircle, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { getBusinessesData } from "../../adapters/business.adapter";

import DataTable from "../../components/DataTable";
import ModalAlert from "../../components/modals/ModalAlert";
import SpinnerLouder from "../../components/SpinnerLouder";


export default function Businesses() {

  const [loading, setLoading] = useState(true);
  const [dataBusinesses, setDataBusinesses] = useState({data: [], columns: []});
  const [showAlert, setShowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);
  const [showDataTable, setShowDataTable] = useState(false);

  useEffect(() => {
    getBusinessesData()
      .then((data) => {
        if (data.data) {
          setDataBusinesses({
            data: data.data,
            columns: data.data && data.data.length > 0 ? Object.keys(data.data[0]) : []
          });
          setShowDataTable(true);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener los negocios");
          setMessageAlert1(data.message ?? 'Algo fallo');
          setShowDataTable(false);
        }
      })
      .catch((data) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener los usuarios");
        setMessageAlert1(data.message ?? 'Algo fallo');
        setShowDataTable(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (row) => {
    console.log(row.original);
  }

  const handleDelete = (row) => {
    console.log(row.original);
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <>
      <Link
        to="/admin/businesses/create"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        <PlusCircle size={16} />
        <span>Nuevo negocio</span>
      </Link>

      {showDataTable && (
        <DataTable objData={dataBusinesses} onClickEdit={handleEdit} onClickDelete={handleDelete} />
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
