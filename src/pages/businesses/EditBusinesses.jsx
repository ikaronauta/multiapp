// src/pages/businesses/EditBusinesses.jsx

import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { getBusinessById, updateBusiness } from "../../adapters/business.adapter";
import SpinnerLouder from "../../components/SpinnerLouder";
import ModalAlert from "../../components/modals/ModalAlert";
import { getUserFromToken } from "../../utils/auth";
import ModalSpinner from "../../components/modals/ModelSpinner";

export const EditBusinesses = () => {

  const [user] = useState(() => getUserFromToken());
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const [nameBusiness, setNameBusiness] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");

  useEffect(() => {
    getBusinessById(id)
      .then((data) => {
        if (data.data) {
          setNameBusiness(data.data.Nombre);
          setSlug(data.data.Slug);
          setDescription(data.data.Descripcion);
          setSelectedStatus(data.data.Status);
          setPreview(data.data.Logo);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener el negocio");
          setMessageAlert1(data.message ?? 'Algo fallo');
          setShowDataTable(false);
        }
      })
      .catch((data) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener el negocio");
        setMessageAlert1(data.message ?? 'Algo fallo');
        setShowDataTable(false);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const slugify = (text) => {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setNameBusiness(value);
    setSlug(slugify(value));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeLogo = () => {
    setFileName("");
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input file
    }
  };

  const handleEditBusiness = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {
      const logoFile = fileInputRef.current?.files[0];

      const formData = new FormData();
      formData.append("nameBusiness", nameBusiness);
      formData.append("slug", slug);
      formData.append("description", e.target.description.value);
      formData.append("status", selectedStatus);
      formData.append("updatedById", user.id);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await updateBusiness(id, formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al agregar el negocio");
        setMessageAlert1(errorMsg);
        return;
      }

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Negocio agregado");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("El negocio ha sido agregado correctamente");

      // Reset form
      setNameBusiness("");
      setSlug("");
      setFileName("");
      setPreview(null);
      setSelectedStatus("activo");
      removeLogo(); // limpia el input file también

    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al agregar negocio");
      setMessageAlert1(error.message ?? "Error inesperado");
    }
  };

  if (loading) return <SpinnerLouder height="h-full" />;

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/businesses"
        className="relative inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Editar Negocio</h2>

        <form onSubmit={handleEditBusiness} className="flex flex-wrap -mx-2 items-end">

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Nombre Negocio</label>
            <input
              type="text"
              placeholder="Nombre Negocio"
              value={nameBusiness}
              onChange={handleNameChange}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="nameBusiness"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Slug</label>
            <input
              type="text"
              placeholder="Slug"
              value={slug}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="slug"
              disabled
              required
            />
          </div>

          <div className="px-2 w-full sm:w-full mb-2">
            <label className="text-gray-900 text-sm">Descripción</label>
            <textarea
              name="description"
              className="border border-gray-300 rounded-md px-3 py-2 min-h-32 w-full resize-y"
              defaultValue={description}
              required
            ></textarea>
          </div>

          <div className="px-2 w-full sm:w-full mb-2">
            <label className="text-gray-900 text-sm">Estado</label>
            <select
              className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
            >
              <option value="" disabled>Seleccione un estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>

          {/* Logo con preview */}
          <div className="px-2 w-full sm:w-full mb-2">
            <label className="text-gray-900 text-sm">Logo Negocio</label>

            <div className="mt-1">
              <input
                type="file"
                name="logo"
                // required={!preview}
                onChange={handleFileChange}
                ref={fileInputRef}
                className="
                  border border-gray-300 rounded-md px-3 py-1 h-12 w-full
                  file:bg-green-600 file:text-white file:border-0 file:px-4 file:py-2
                  file:rounded-md file:mr-3 file:hover:bg-green-700
                  cursor-pointer text-gray-700
                "
              />
            </div>

            {fileName && <p className="text-xs text-gray-700 mt-2">📎 {fileName}</p>}

            {preview && (
              <div className="mt-3 relative inline-block">
                <img src={preview} className="h-24 rounded-lg border object-contain" />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="px-2 w-full sm:w-full mb-2">
            <button type="submit" className="bg-green-600 text-white px-3 py-2 h-10 rounded-md w-full hover:bg-green-700">
              Agregar
            </button>
          </div>

        </form>
      </div>

      {/* Modales */}
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
        <ModalSpinner titleModal="Procesando..." messageModal="" iconComponent={<Info className="text-red-600" size={24} />} />
      )}
    </div>
  )
}