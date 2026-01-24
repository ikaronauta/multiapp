// src/pages/modules/Persons.jsx

import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { Link, useNavigate } from "react-router-dom";
import { Info, PlusCircle, TriangleAlert } from "lucide-react";
import { deletePerson, getPersonsData } from "../../adapters/persons.adapter";
import SpinnerLouder from "../../components/SpinnerLouder";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import ModalConfirmDelete from "../../components/modals/ModalConfirmDelete";


export default function Persons() {

  const navigate = useNavigate();

  const [dataPersons, setDataPersons] = useState({ data: [], columns: [] });
  const [showDataTable, setShowDataTable] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSpinner, setShowAlertSpinner] = useState(false);

  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponent, setIconComponent] = useState(<TriangleAlert className="text-red-600" size={24} />);

  const [personToDelete, setPersonToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [namePersonToDelete, setNamePersonToDelete] = useState("");

  const loadPersons = () => {
    setLoading(true);

    getPersonsData()
      .then((data) => {
        if (data.data) {
          setDataPersons({
            data: data.data,
            columns: data.data.length > 0 ? Object.keys(data.data[0]) : [],
          });
          setShowDataTable(true);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener las personas");
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
    loadPersons();
  }, []);

  const handleEdit = (row) => {
    console.log(row.original);
    navigate(`/admin/persons/edit/${row.original.uuid}`);
  }

  const handleConfirmDeletePerson = (row) => {
    setPersonToDelete(row.original.uuid);
    setShowConfirm(true);
    setNamePersonToDelete(row.original.Nombre);
  }

  const handleDelete = async () => {
    setShowAlertSpinner(true);

    try {
      const response = await deletePerson(personToDelete);

      if (!response.ok) {
        setShowAlertSpinner(false);
        setShowAlert(true);
        setTitleAlert("Error al eliminar la persona.");
        setMessageAlert1(response.message);
        setMessageAlert2(response.error?.details || "");
        return;
      }

      setPersonToDelete(null);
      setShowAlertSpinner(false);

      loadPersons();
    } catch (error) {
      setShowAlertSpinner(false);
      setTitleAlert("Error al eliminar persona.");
      setMessageAlert1('Algo fallo');
      console.error("Error deleting person:", error);
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <>
      <Link
        to="/admin/persons/create"
        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        <PlusCircle size={16} />
        <span>Nueva Persona</span>
      </Link>

      {/* Tabla */}
      {showDataTable && (
        <DataTable objData={dataPersons} onClickEdit={handleEdit} onClickDelete={handleConfirmDeletePerson} />
      )}

      {/* Modales */}
      <>
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
            titleConfirm="¿Eliminar Persona?"
            messageConfirm1="Esta acción no se puede deshacer."
            messageConfirm2="Debe ingresar excatamente el nombre de la persona"
            name={namePersonToDelete}
            onClickConfirm={() => {
              handleDelete();
              setShowConfirm(false);
            }}
            onClickCancel={() => setShowConfirm(false)}
          />
        )}
      </>
    </>
  );
}