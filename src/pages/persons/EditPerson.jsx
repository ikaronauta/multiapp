import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { getUserFromToken } from "../../utils/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Input from "../../components/form/Input";
import Select from "../../components/form/Select";
import SpinnerLouder from "../../components/SpinnerLouder";
import { getPersonByUUID, updatePerson } from "../../adapters/persons.adapter";
import ImageWithPreview from "../../components/form/ImageWithPreview";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";


export default function EditPerson() {

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user] = useState(() => getUserFromToken());
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Campos Formulario
  const [documentType, setDocumentType] = useState("");
  const [document, setDocument] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);

  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const [updateOk, setUpdateOk] = useState(false);
  const [perfilRemoved, setPerfilRemoved] = useState(false);

  useEffect(() => {
    getPersonByUUID(id)
      .then((data) => {
        if (data.data) {
          setDocumentType(data.data.document_type);
          setDocument(data.data.document);
          setFirstName(data.data.name);
          setLastName(data.data.last_name);
          setPhone(data.data.phone);
          setEmail(data.data.email);
          setPreview(data.data.perfil_url);
        } else {
          setShowAlert(true);
          setTitleAlert("Error al obtener la persona");
          setMessageAlert1(data.message ?? 'Algo fallo');
        }
      })
      .catch((error) => {
        setShowAlert(true);
        setTitleAlert("Error al obtener la persona");
        setMessageAlert1(error.message ?? 'Algo fallo');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlertSubmit(true);

    try {

      const perfilFile = fileInputRef.current?.files[0];
      
      const formData = new FormData();

      formData.append("document_type", documentType);
      formData.append("document", document);
      formData.append("name", firstName);
      formData.append("last_name", lastName);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("updated_by_id", user.id);
      formData.append("perfilRemoved", perfilRemoved);

      if (perfilFile) {
        formData.append("perfil", perfilFile);
      }

      const response = await updatePerson(id, formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al editar la persona");
        setMessageAlert1(errorMsg);
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
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Editar Persona</h2>

        <form onSubmit={handleSubmit} className="flex flex-wrap -mx-2 items-end">

          {/* campos del formulario */}
          <Select
            widthPercent="50"
            textLabel="Tipo de Documento"
            isRequired={true}
            value={documentType}
            onChange={setDocumentType}
            name="documentType"
            textFirstOption="Seleccione el tipo de documento"
            options={[
              { value: "CC", text: "CC" },
              { value: "CE", text: "CE" },
              { value: "NIT", text: "NIT" },
              { value: "PAS", text: "PAS" },
            ]}
          />

          <Input
            widthPercent="50"
            textLabel="Documento"
            isRequired={true}
            type="text"
            placeholder="Documento"
            value={document}
            onChange={setDocument}
            name="document"
          />

          <Input
            widthPercent="50"
            textLabel="Nombres"
            isRequired={true}
            type="text"
            placeholder="Nombres"
            value={firstName}
            onChange={setFirstName}
            name="firstName"
          />

          <Input
            widthPercent="50"
            textLabel="Apellidos"
            isRequired={true}
            type="text"
            placeholder="Apellidos"
            value={lastName}
            onChange={setLastName}
            name="lastName"
          />

          <Input
            widthPercent="50"
            textLabel="Teléfono/Celular"
            isRequired={false}
            type="text"
            placeholder="Teléfono/Celular"
            value={phone}
            onChange={setPhone}
            name="phone"
          />

          <Input
            widthPercent="50"
            textLabel="Correo Electrónico"
            isRequired={true}
            type="text"
            placeholder="Correo Electrónico"
            value={email}
            onChange={setEmail}
            name="email"
          />

          <ImageWithPreview
            widthPercent="100"
            textLabel="Imagen"
            isRequired={false}
            name="imagenPerson"
            fileInputRef={fileInputRef}
            prev={preview}
            setImageRemoved={setPerfilRemoved}
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
              updateOk && navigate(`/admin/persons`);
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