// src/pages/sections/EditProductCategories.jsx

import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { getUserFromToken } from "../../utils/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import SpinnerLouder from "../../components/SpinnerLouder";
import { getBusinessesData } from "../../adapters/business.adapter";
import Select from "../../components/form/Select";
import Input from "../../components/form/Input";
import { getProductCategoriesByUUID, updateProductCategories } from "../../adapters/productCategories";


export default function EditProductCategories() {

  const navigate = useNavigate();

  const [user] = useState(() => getUserFromToken());
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);

  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const [updateOk, setUpdateOk] = useState(false);

  // Campos Formulario
  const [business, setBusiness] = useState("");
  const [nameCategorie, setNameCategorie] = useState("");
  const [position, setPosition] = useState("");

  // Variables para los negocios
  const [optionsBusinesses, setOptionsBusinesses] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [showAlertPermissions, setShowAlertPermissions] = useState(false);

  useEffect(() => {
    if (user?.businessId === 1 && user?.roleId === 1) {
      setIsSuperAdmin(true);
    }
  }, []);

  // Cargar negocios
  useEffect(() => {
    if (isSuperAdmin) {
      getBusinessesData()
        .then((data) => {
          if (data.data) setBusinesses(data.data);
          else setShowAlertPermissions(true);
        })
        .catch((error) => {
          setShowAlertPermissions(true);
          console.error("Error fetching businesses:", error);
        })
        .finally(() => setLoadingPermissions(false));
    }
  }, [isSuperAdmin]);

  // Mapear los negocios para el formato del select
  useEffect(() => {
    if (businesses.length > 0) {
      const mapped = businesses.map((item) => {
        return { value: item.ID, text: item.Nombre };
      });
      setOptionsBusinesses(mapped);
    }
  }, [businesses]);

  useEffect(() => {
    getProductCategoriesByUUID(id)
      .then((data) => {
        if (data.data) {
          setBusiness(data.data.business_id);
          setNameCategorie(data.data.name);
          setPosition(data.data.position);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener la categoría");
          setMessageAlert1(data.message ?? 'Algo fallo');
          setMessageAlert2(data.error?.details ? data.error?.details : "");
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener la categoría");
        setMessageAlert1(error.message ?? 'Algo fallo');
        setMessageAlert2(error.details ? error.details : "");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      const formData = new FormData();

      formData.append("business_id", business);
      formData.append("name", nameCategorie);
      formData.append("position", position);
      formData.append("updated_by_id", user.id);

      const response = await updateProductCategories(id, formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al editar categoría de productos");
        setMessageAlert1(errorMsg);
        setMessageAlert2(response?.error?.details ?? "");
        console.error("Error adding person:", errorMsg);
        return;
      }

      setUpdateOk(true);
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Persona editado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("Categoría de productos ha sido editado correctamente");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al editar la categoría de productos");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(error.details ? error.details : "");
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/product_categories"
        className="relative inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Editar Categoría de Producto</h2>

        <form onSubmit={handleEdit} className="flex flex-wrap -mx-2 items-end">

          {isSuperAdmin && (
            <Select
              widthPercent="33"
              textLabel="Negocio"
              isRequired={true}
              value={business}
              onChange={setBusiness}
              name="businesses"
              textFirstOption="Seleccione la categoría"
              options={optionsBusinesses}
              louding={loadingPermissions}
              showAlert={showAlertPermissions}
            />
          )}

          <Input
            widthPercent={isSuperAdmin ? 33 : 50}
            textLabel="Nombre categoría"
            isRequired={true}
            type="text"
            placeholder="Nombre categoría"
            value={nameCategorie}
            onChange={setNameCategorie}
            name="categorie"
          />

          <Input
            widthPercent={isSuperAdmin ? 33 : 50}
            textLabel="Posición"
            isRequired={true}
            type="number"
            placeholder="Posición"
            value={position}
            onChange={setPosition}
            name="position"
          />

          <div className="px-2 w-full sm:w-full mb-2 mt-2">
            <button type="submit" className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700">
              Editar
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
            onClick={() => {
              updateOk && navigate(`/admin/product_categories`);
              setShowAlert(false);
            }}
          />
        )}

        {showAlertSubmit && (
          <ModalSpinner titleModal="Procesando..." messageModal="" iconComponent={<Info className="text-red-600" size={24} />} />
        )}
      </>
    </div>
  );
}