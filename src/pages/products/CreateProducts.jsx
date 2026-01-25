// src/pages/modules/CreateProducts.jsx

import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { getBusinessesData } from "../../adapters/business.adapter";
import { getProductUnits } from "../../adapters/utils.adapter";
import { getUserFromToken } from "../../utils/auth";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelectOptions } from "../../hooks/useSelectOptions";
import ImageWithPreview from "../../components/form/ImageWithPreview";
import Input from "../../components/form/Input";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import Select from "../../components/form/Select";
import Textarea from "../../components/form/Textarea";
import { getProductCategoriesByBusinessIdData, getProductCategoriesData } from "../../adapters/productCategories";
import { newProduct } from "../../adapters/products.adapter";


export default function CreateProducts({ businessSelected }) {

  const [user, setUser] = useState(() => getUserFromToken());
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const fileInputRef = useRef(null);

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

  // Variables para Modales
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const {
    // value: business,
    // setValue: setBusiness,
    options: optionsBusinesses,
    loadingHook: loadingBusinesses,
    showAlertHook: showAlertBussineses,
  } = useSelectOptions(getBusinessesData, "ID", "Nombre");

  const {
    // value: categorie,
    // setValue: setCategorie,
    options: optionsCategories,
    loadingHook: loadingCategories,
    showAlertHook: showAlertCategories,
  } = useSelectOptions(businessSelected == 1
    ? getProductCategoriesData
    : () => getProductCategoriesByBusinessIdData(businessSelected), "id", "Categoria");

  const {
    // value: unit,
    // setValue: setUnit,
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

  const handleAdd = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      const productFile = fileInputRef.current?.files[0];

      const formData = new FormData();

      formData.append("business_id", business);
      formData.append("categorie_id", categorie);
      formData.append("sku", sku);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("cost", cost);
      formData.append("product_unit_id", unit);
      formData.append("expiration_date", date);
      formData.append("status", status);
      formData.append("created_by_id", user.id);

      if (productFile) {
        formData.append("image", productFile);
      }

      const response = await newProduct(formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al agregar producto");
        setMessageAlert1(errorMsg);
        setMessageAlert2(response?.error?.details ?? "");
        console.error("Error adding producto:", errorMsg);
        return;
      }

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Producto agregado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El producto ha sido agregado correctamente");

      // Limpieza de inputs
      setBusiness("");
      setCategorie("");
      setUnit("");
      setSku("");
      setName("");
      setDescription("");
      setPrice("");
      setCost("");
      setDate("");
      setStatus("");

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al agregar producto.");
      setMessageAlert1(error.message ?? "Error inesperado");
      setMessageAlert2(response?.error?.details ?? "");
      console.error("Error adding product:", error);
    }
  }

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      {/* Formulario */}
      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Crear Producto</h2>

        <form onSubmit={handleAdd} className="flex flex-wrap -mx-2 items-end">

          {isSuperAdmin && (
            <Select
              widthPercent="50"
              textLabel="Negocio"
              isRequired={true}
              value={business}
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
            value={categorie}
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
            value={sku}
            onChange={setSku}
            name="sku"
          />

          <Input
            widthPercent={isSuperAdmin ? "50" : "33"}
            textLabel="Nombre Producto"
            isRequired={true}
            type="text"
            placeholder="Nombre Producto"
            value={name}
            onChange={setName}
            name="name"
          />

          <Textarea
            widthPercent="100"
            textLabel="Descripción"
            isRequired={false}
            value={description}
            onChange={setDescription}
            name="description"
          />

          <Input
            widthPercent="50"
            textLabel="Precio"
            isRequired={true}
            type="text"
            placeholder="Precio"
            value={price}
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
            value={cost}
            onChange={setCost}
            name="cost"
            isFormatCOP={true}
          />

          <Select
            widthPercent="33"
            textLabel="Unidad de Medida"
            isRequired={true}
            value={unit}
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
            value={date}
            onChange={setDate}
            name="cost"
            isFormatCOP={false}
          />

          <Select
            widthPercent="33"
            textLabel="Estado"
            isRequired={true}
            value={status}
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
          />


          <div className="px-2 w-full sm:w-full mb-2 mt-2">
            <button type="submit" className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700">
              Agregar
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
            onClick={() => setShowAlert(false)}
          />
        )}

        {showAlertSubmit && (
          <ModalSpinner
            titleModal="Procesando..."
            messageModal=""
            iconComponent={<Info className="text-red-600" size={24} />}
          />
        )}
      </>
    </div>
  );
}