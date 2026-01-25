// src/pages/sections/EditProducts.jsx

import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { getUserFromToken } from "../../utils/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import SpinnerLouder from "../../components/SpinnerLouder";
import { useSelectOptions } from "../../hooks/useSelectOptions";
import { getProductCategoriesByBusinessIdData, getProductCategoriesData } from "../../adapters/productCategories";
import { getBusinessesData } from "../../adapters/business.adapter";
import { getProductUnits } from "../../adapters/utils.adapter";
import Select from "../../components/form/Select";
import Input from "../../components/form/Input";
import Textarea from "../../components/form/Textarea";
import ImageWithPreview from "../../components/form/ImageWithPreview";
import { getProductByUUID, updateProduct } from "../../adapters/products.adapter";


export default function EditProducts({ businessSelected }) {

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user] = useState(() => getUserFromToken());
  const { id } = useParams();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
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
  const [imageRemoved, setImageRemoved] = useState(false);

  // Campos Formulario
  const [business, setBusiness] = useState("");
  const [categorie, setCategorie] = useState("");
  const [unit, setUnit] = useState("");
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("activo");
  const [preview, setPreview] = useState(null);

  const {
    options: optionsBusinesses,
    loadingHook: loadingBusinesses,
    showAlertHook: showAlertBussineses,
  } = useSelectOptions(getBusinessesData, "ID", "Nombre");

  const fetchCategories = useCallback(() => {
    if (!businessSelected) return Promise.resolve({ data: [] });
    return getProductCategoriesByBusinessIdData(businessSelected);
  }, [businessSelected]);

  const {
    options: optionsCategories,
    loadingHook: loadingCategories,
    showAlertHook: showAlertCategories,
  } = useSelectOptions(fetchCategories, "id", "Categoria");

  const {
    options: optionsUnits,
    loadingHook: loadingUnits,
    showAlertHook: showAlertUnits,
  } = useSelectOptions(getProductUnits, "id", "name");

  useEffect(() => {
    setBusiness(businessSelected);

    if (businessSelected == 1 && user?.roleId === 1) {
      setIsSuperAdmin(true);
    }
  }, [businessSelected]);

  useEffect(() => {
    getProductByUUID(id)
      .then((data) => {
        if (data.data) {
          setBusiness(data.data.business_id);
          setCategorie(data.data.category_id);
          setUnit(data.data.product_unit_id);
          setSku(data.data.sku);
          setName(data.data.name);
          setDescription(data.data.description);
          setPrice(data.data.price);
          setCost(data.data.cost);
          setDate(data.data.expiration_data ?? "");
          setStatus(data.data.status);
          setPreview(data.data.image);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener el producto");
          setMessageAlert1(data.message ?? 'Algo fallo');
          setMessageAlert2(data.error?.details ? data.error.details : "");
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener el producto");
        setMessageAlert1(error.message ?? 'Algo fallo');
        setMessageAlert2(error.details ? error.details : "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      const productFile = fileInputRef.current?.files[0];

      const formData = new FormData();

      formData.append("business_id", business);
      formData.append("category_id", categorie);
      formData.append("sku", sku);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("cost", cost);
      formData.append("product_unit_id", unit);
      formData.append("expiration_date", date);
      formData.append("status", status);
      formData.append("updated_by_id", user.id);
      formData.append("imageRemoved", imageRemoved);

      if (productFile) {
        formData.append("image", productFile);
      }

      const response = await updateProduct(id, formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al editar la persona");
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
      setMessageAlert1("La persona ha sido editado correctamente");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al editar la persona");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(error.details ? error.details : "");
    }
  }

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/persons"
        className="relative inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Editar Producto</h2>

        <form onSubmit={handleEdit} className="flex flex-wrap -mx-2 items-end">

          {isSuperAdmin && (
            <Select
              widthPercent="50"
              textLabel="Negocio"
              isRequired={true}
              value={business ?? ""}
              onChange={setBusiness}
              name="businesses"
              textFirstOption="Seleccione el negocio"
              options={optionsBusinesses}
              louding={loadingBusinesses}
              showAlert={showAlertBussineses}
            />
          )}

          <Select
            widthPercent={isSuperAdmin ? "50" : "33"}
            textLabel="Categoría"
            isRequired={true}
            value={categorie ?? ""}
            onChange={setCategorie}
            name="categorie"
            textFirstOption="Seleccione la categoría"
            options={optionsCategories}
            louding={loadingCategories}
            showAlert={showAlertCategories}
          />

          <Input
            widthPercent={isSuperAdmin ? "50" : "33"}
            textLabel="SKU"
            isRequired={false}
            type="text"
            placeholder="SKU"
            value={sku ?? ""}
            onChange={setSku}
            name="sku"
          />

          <Input
            widthPercent={isSuperAdmin ? "50" : "33"}
            textLabel="Nombre Producto"
            isRequired={true}
            type="text"
            placeholder="Nombre Producto"
            value={name ?? ""}
            onChange={setName}
            name="name"
          />

          <Textarea
            widthPercent="100"
            textLabel="Descripción"
            isRequired={false}
            value={description ?? ""}
            onChange={setDescription}
            name="description"
          />

          <Input
            widthPercent="50"
            textLabel="Precio"
            isRequired={true}
            type="text"
            placeholder="Precio"
            value={price ?? ""}
            onChange={setPrice}
            name="price"
            isFormatCOP={true}
          />

          <Input
            widthPercent="50"
            textLabel="Costo"
            isRequired={true}
            type="text"
            placeholder="Costo"
            value={cost ?? ""}
            onChange={setCost}
            name="cost"
            isFormatCOP={true}
          />

          <Select
            widthPercent="33"
            textLabel="Unidad de Medida"
            isRequired={true}
            value={unit ?? ""}
            onChange={setUnit}
            name="unit"
            textFirstOption="Seleccione la únida de medida"
            options={optionsUnits}
            louding={loadingUnits}
            showAlert={showAlertUnits}
          />

          <Input
            widthPercent="33"
            textLabel="Fecha de Expiración"
            isRequired={false}
            type="date"
            placeholder=""
            value={date ?? ""}
            onChange={setDate}
            name="cost"
            isFormatCOP={false}
          />

          <Select
            widthPercent="33"
            textLabel="Estado"
            isRequired={true}
            value={status ?? ""}
            onChange={setStatus}
            name="status"
            textFirstOption="Seleccione un estado"
            options={[
              { value: "activo", text: "Activo" },
              { value: "inactivo", text: "Inactivo" },
            ]}
            louding={null}
            showAlert={null}
          />

          <ImageWithPreview
            widthPercent="100"
            textLabel="Imagen del producto"
            isRequired={false}
            name="imageProduct"
            fileInputRef={fileInputRef}
            prev={preview}
            setImageRemoved={setImageRemoved}
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
              updateOk && navigate(`/admin/businesses`);
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