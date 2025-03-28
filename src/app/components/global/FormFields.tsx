import FormField from "@/app/types/formField";
import { ChangeEvent } from "react";

type FormFieldsProps<T> = {
  fields: FormField[];
  formData: T;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export function FormFields<T extends Record<string, string | number | Date | boolean>>({
  fields,
  formData,
  handleChange,
}: FormFieldsProps<T>) {
  const renderField = (field: FormField) => {
    const { name, label, type = "text", options = [], icon, placeholder, value } = field;
    
    const labelElement = (
      <label 
        className={`text-sm font-semibold text-gray-700 ${icon ? 'flex items-center' : ''}`}
        htmlFor={name}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
      </label>
    );

    switch(type) { 
      case "select": {
        return (
          <div className="space-y-2" key={name}>
            {labelElement}
            <select
              id={name}
              name={name}
              value={String(formData[name])}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      } 
      case "number": { 
        const numberValue = value !== undefined 
          ? String(value) 
          : formData[name] !== undefined && formData[name] !== null 
            ? String(formData[name]) 
            : "";
            
        return (
          <div className="space-y-2" key={name}>
            {labelElement}
            <input
              id={name}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              name={name}
              value={numberValue}
              onChange={handleChange}
              required
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      } 
      case "date": { 
        const dateValue = formData[name] instanceof Date 
          ? (formData[name] as Date).toISOString().split('T')[0] 
          : String(formData[name]);
          
        return (
          <div className="space-y-2" key={name}>
            {labelElement}
            <input
              id={name}
              type={type}
              name={name}
              value={dateValue}
              onChange={handleChange}
              required
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      }
      case "range": {
        const rangeValue = value !== undefined 
          ? Number(value) 
          : formData[name] !== undefined && formData[name] !== null 
            ? Number(formData[name]) 
            : 100;
            
        return (
          <div className="space-y-2" key={name}>
            {labelElement}
            <div className="flex items-center space-x-3">
              <input
                id={name}
                type="range"
                name={name}
                value={rangeValue}
                onChange={handleChange}
                min={field.min || 0}
                max={field.max || 100}
                step={field.step || 5}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-semibold w-16 text-center">
                {rangeValue}%
              </span>
            </div>
          </div>
        );
      }
      default: {
        const textValue = value !== undefined 
          ? String(value) 
          : formData[name] !== undefined && formData[name] !== null 
            ? String(formData[name]) 
            : "";
            
        return (
          <div className="space-y-2" key={name}>
            {labelElement}
            <input
              id={name}
              type={type}
              name={name}
              value={textValue}
              onChange={handleChange}
              required
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      } 
    } 
  };

  return (
    <div className="p-6 space-y-4">
      {fields.map(renderField)}
    </div>
  );
}
