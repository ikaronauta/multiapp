// src/components/formInputs/Select.jsx

export default function Select({ widthPercent, textLabel, isRequired, value, onChange, 
  name, textFirstOption, options }) {

  return (
    <div className={`px-2 w-full sm:w-[${widthPercent}%] mb-2`}>
      <label className="text-gray-900 text-sm">
        {textLabel}
        {isRequired && (
          <span className="text-red-700 font-extrabold"> *</span>
        )}
      </label>
      <select
        className="border text-gray-500 border-gray-300 rounded-md px-3 py-2 h-10 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={name}
        required={isRequired}
      >
        {textFirstOption && (
          <option value="">{textFirstOption}</option>
        )}
        
        {options.map((option) => {
          return <option key={option.value} value={option.value}>{option.text}</option>
        })}
      </select>
    </div>
  );
}