// src/components/formInputs/Input.jsx

export default function Input({widthPercent, textLabel, isRequired, type, placeholder, 
  value, onChange, name}) {

  return (
    <div className={`px-2 w-full sm:w-[${widthPercent}%] mb-2`}>
      <label className="text-gray-900 text-sm">
        {textLabel}
        {isRequired && (
          <span className="text-red-700 font-extrabold"> *</span>
        )}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 h-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        name={name}
        required={isRequired}
      />
    </div>
  );
}