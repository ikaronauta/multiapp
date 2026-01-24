// src/pages/businesses/Businesses.jsx

import { Link, useNavigate } from "react-router-dom";
import { Info, PlusCircle, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { deleteBusiness, getBusinessesData } from "../../adapters/business.adapter";

import DataTable from "../../components/DataTable";
import ModalAlert from "../../components/modals/ModalAlert";
import SpinnerLouder from "../../components/SpinnerLouder";
import ModalSpinner from "../../components/modals/ModelSpinner";
import ModalConfirmDelete from "../../components/modals/ModalConfirmDelete";


export default function Businesses() {

  const [loading, setLoading] = useState(true);
  const [dataBusinesses, setDataBusinesses] = useState({ data: [], columns: [] });
  const [showAlert, setShowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);
  const [showDataTable, setShowDataTable] = useState(false);
  const [showAlertSpinner, setShowAlertSpinner] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nameBusinessToDelete, setNameBusinessToDelete] = useState("");

  const navigate = useNavigate();

  const loadBusinesses = () => {
    setLoading(true);
    getBusinessesData()
      .then((data) => {
        if (data.data) {
          setDataBusinesses({
            data: data.data,
            columns: data.data.length > 0 ? Object.keys(data.data[0]) : [],
          });
          setShowDataTable(true);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener los negocios");
          setMessageAlert1(data.message ?? "Algo falló");
          setShowDataTable(false);
        }
      })
      .catch((err) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener los negocios");
        setMessageAlert1(err.message ?? "Algo falló");
        setShowDataTable(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleEdit = (row) => {
    console.log(row.original);
    navigate(`/admin/businesses/edit/${row.original.uuid}`);
  }

  const handleConfirmDeleteBusiness = (row) => {
    setBusinessToDelete(row.original.uuid);
    setShowConfirm(true);
    setNameBusinessToDelete(row.original.Nombre);
  }

  const handleDelete = async () => {
    setShowAlertSpinner(true);

    try {
      const response = await deleteBusiness(businessToDelete);

      if (!response.ok) {
        setShowAlertSpinner(false);
        setShowAlert(true);
        setTitleAlert("Error al eliminar el negocio.");
        setMessageAlert1(response.message);
        return;
      }

      setBusinessToDelete(null);
      setShowAlertSpinner(false);

      loadBusinesses();
    } catch (error) {
      setShowAlertSpinner(false);
      setTitleAlert("Error al eliminar negocio.");
      setMessageAlert1('Algo fallo');
      console.error("Error deleting business:", error);
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <>
      <Link
        to="/admin/businesses/create"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        <PlusCircle size={16} />
        <span>Nuevo Negocio</span>
      </Link>

      {showDataTable && (
        <DataTable objData={dataBusinesses} onClickEdit={handleEdit} onClickDelete={handleConfirmDeleteBusiness} />
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

      {showAlertSpinner && (
        <ModalSpinner
          titleModal="Procesando..."
          messageModal=""
          iconComponent={<Info className="text-red-600" size={24} />}
        />
      )}

      {showConfirm && (
        <ModalConfirmDelete
          titleConfirm="¿Eliminar Negocio?"
          messageConfirm1="Esta acción no se puede deshacer."
          messageConfirm2="Debe ingresar excatamente el nombre del negocio"
          name={nameBusinessToDelete}
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
