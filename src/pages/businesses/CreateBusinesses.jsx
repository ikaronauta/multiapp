import { AlertCircle, CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserFromToken } from "../../utils/auth";
import ModalSpinner from "../../components/modals/ModelSpinner";
import { getBusinessesTypes, newBusiness } from "../../adapters/business.adapter";
import ModalAlert from "../../components/modals/ModalAlert";
import SpinnerLouder from "../../components/SpinnerLouder";
import { getCitiesByIdDepto, getDeptos } from "../../adapters/utils.adapter";
import { toTitleCaseSafeES } from "../../utils/common";

export const CreateBusinesses = () => {
  const [user] = useState(() => getUserFromToken());
  const [nameBusiness, setNameBusiness] = useState("");
  const [slug, setSlug] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("activo");
  const [businessesTypes, setBusinessesTypes] = useState([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [deptos, setDeptos] = useState([]);
  const [selectedDeptos, setSelectedDeptos] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [webSite, setWebSite] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");


  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [loadingDeptos, setLoadingDeptos] = useState(true);
  const [showAlertDeptos, setShowAlertDeptos] = useState(true);
  const [loadingBusinessesTypes, setLoadingBusinessesTypes] = useState(true);
  const [showAlertBusinessesTypes, setShowAlertBusinessesTypes] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showAlertCities, setShowAlertCities] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

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

  useEffect(() => {
    getBusinessesTypes()
      .then((data) => {
        if (data.data) setBusinessesTypes(data.data);
        else setLoadingBusinessesTypes(false);
      })
      .catch((error) => {
        console.log(error);
        setShowAlertBusinessesTypes(false);
      })
      .finally(() => setLoadingBusinessesTypes(false));
  }, []);

  useEffect(() => {
    getDeptos()
      .then((data) => {
        if (data.data) setDeptos(data.data);
        else setShowAlertDeptos(false);
      })
      .catch((error) => {
        console.log(error);
        setShowAlertDeptos(false);
      })
      .finally(() => setLoadingDeptos(false));
  }, []);

  const handleChangeDepto = (idDepto) => {
    setSelectedDeptos(idDepto);
    setShowAlertDeptos(true);

    getCitiesByIdDepto(idDepto)
      .then((data) => {
        if (data.data) setCities(data.data);
        else setShowAlertCities(false);
      })
      .catch(() => setShowAlertCities(false))
      .finally(() => setLoadingCities(false));
  }

  const handleAddBusiness = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {
      const logoFile = fileInputRef.current?.files[0];

      const formData = new FormData();
      formData.append("nameBusiness", nameBusiness);
      formData.append("slug", slug);
      formData.append("description", e.target.description.value);
      formData.append("businessType", selectedBusinessType);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("webSite", webSite);
      formData.append("selectedCity", selectedCity);
      formData.append("address", address);
      formData.append("status", selectedStatus);
      formData.append("createdById", user.id);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await newBusiness(formData);

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
      setSelectedBusinessType("");
      setSelectedDeptos("");
      setSelectedCity("");
      setAddress("");
      setEmail("");
      setPhone("");
      setWebSite("");
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
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Crear Negocio</h2>

        <form onSubmit={handleAddBusiness} className="flex flex-wrap -mx-2 items-end">

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">
              Nombre Negocio
              <span className="text-red-700 font-extrabold"> *</span>
            </label>
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
              required
            ></textarea>
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">
              Tipo de Negocio
              <span className="text-red-700 font-extrabold"> *</span>
              {loadingBusinessesTypes &&
                <div className="inline-block ml-2 w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>}

              {!showAlertBusinessesTypes && (
                <span className="ml-2 top-0 right-6 inline-flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Ocurrió un problema</span>
                </span>
              )}
            </label>
            <select
              className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="businessType"
              value={selectedBusinessType}
              onChange={(e) => setSelectedBusinessType(e.target.value)}
              required
            >
              <option value="" disabled>Seleccione un tipo de negocio</option>

              {businessesTypes.map((type) => (
                <option key={type.id} value={type.id} >{type.name}</option>
              ))}
            </select>
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Correo Electrónico</label>
            <input
              type="text"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="email"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Teléfono</label>
            <input
              type="text"
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="phone"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Sitio Web</label>
            <input
              type="text"
              placeholder="https://tusitio.com"
              value={webSite}
              onChange={(e) => setWebSite(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="webSite"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">
              Departamento
              <span className="text-red-700 font-extrabold"> *</span>
              {loadingDeptos &&
                <div className="inline-block ml-2 w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>}

              {!showAlertDeptos && (
                <span className="ml-2 top-0 right-6 inline-flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Ocurrió un problema</span>
                </span>
              )}
            </label>
            <select
              className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="depto"
              value={selectedDeptos}
              onChange={(e) => handleChangeDepto(e.target.value)}
              required
            >
              <option value="" disabled>Seleccione un departamento</option>

              {deptos.map((depto) => (
                <option key={depto.id} value={depto.id} >{toTitleCaseSafeES(depto.name)}</option>
              ))}
            </select>
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">
              Ciudad
              <span className="text-red-700 font-extrabold"> *</span>
              {loadingCities &&
                <div className="inline-block ml-2 w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>}

              {!showAlertCities && (
                <span className="ml-2 top-0 right-6 inline-flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Ocurrió un problema</span>
                </span>
              )}
            </label>
            <select
              className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              required
            >
              <option value="" disabled>Seleccione una ciudad</option>

              {cities.map((city) => (
                <option key={city.id} value={city.id} >{toTitleCaseSafeES(city.name)}</option>
              ))}
            </select>
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">Dirección</label>
            <input
              type="text"
              placeholder="Dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full"
              name="address"
              required
            />
          </div>

          <div className="px-2 w-full sm:w-[50%] mb-2">
            <label className="text-gray-900 text-sm">
              Estado
              <span className="text-red-700 font-extrabold"> *</span>
            </label>
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
                required={!preview}
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

          <div className="px-2 w-full sm:w-full mb-2 mt-2">
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
  );
};
