import { CircleChevronLeft, Info, TriangleAlert } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { newPerson } from "../../adapters/persons.adapter";
import ImageWithPreview from "../../components/form/ImageWithPreview";
import Select from "../../components/form/Select";
import Input from "../../components/form/Input";
import ModalAlert from "../../components/modals/ModalAlert";
import ModalSpinner from "../../components/modals/ModelSpinner";
import { getUserFromToken } from "../../utils/auth";


export default function CreatePerson() {

  const [user] = useState(() => getUserFromToken());
  const fileInputRef = useRef(null);

  // Campos Formulario
  const [documentType, setDocumentType] = useState("CC");
  const [document, setDocument] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Variables para Modales
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSubmit, setShowAlertSubmit] = useState(false);
  const [titleAlert, setTitleAlert] = useState("Atención.");
  const [messageAlert1, setMessageAlert1] = useState("");
  const [messageAlert2, setMessageAlert2] = useState("");
  const [iconComponentModalAlert, setIconComponentModalAlert] = useState(
    <TriangleAlert className="text-red-600" size={24} />
  );

  const handleAddPerson = async (e) => {
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
      formData.append("created_by_id", user.id);


      if (perfilFile) {
        formData.append("perfil", perfilFile);
      }
     
      const response = await newPerson(formData);

      if (!response.ok) {
        const errorMsg = response.message ?? "Error inesperado";
        setShowAlertSubmit(false);
        setShowAlert(true);
        setTitleAlert("Error al agregar la persona");
        setMessageAlert1(errorMsg);
        console.error("Error adding person:", errorMsg);
        return;
      }

      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Persona agregada");
      setIconComponentModalAlert(<Info className="text-green-600" size={24} />);
      setMessageAlert1("La persona ha sido agregado correctamente");

      // Limpieza de inputs
      setDocumentType("");
      setDocument("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      
    } catch (error) {
      setShowAlertSubmit(false);
      setShowAlert(true);
      setTitleAlert("Error al agregar Usuario.");
      setMessageAlert1(error.message ?? "Error inesperado");
      console.error("Error adding user:", error);
    }
  }

  return (
    <div className="sm:max-w-3xl mx-auto">
      <Link
        to="/admin/persons"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        <CircleChevronLeft size={16} />
        <span>Regresar</span>
      </Link>

      {/* Formulario para agregar personas */}
      <div className="relative w-full sm:max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-4">Crear Usuario</h2>

        <form onSubmit={handleAddPerson} className="flex flex-wrap -mx-2 items-end">

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