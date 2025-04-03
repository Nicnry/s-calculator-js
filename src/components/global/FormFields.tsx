import FormField from "@/types/formField";
import { ChangeEvent, useState } from "react";

type ValidationErrors = Record<string, string | null>;

type FormFieldsProps<T> = {
  fields: FormField[];
  formData: T;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  validationErrors?: ValidationErrors;
  setValidationErrors?: React.Dispatch<React.SetStateAction<ValidationErrors>>;
};

export function FormFields<T extends Record<string, string | number | Date | boolean>>({
  fields,
  formData,
  handleChange,
  validationErrors = {},
  setValidationErrors,
}: FormFieldsProps<T>) {
  // État local pour les erreurs si aucun état externe n'est fourni
  const [localValidationErrors, setLocalValidationErrors] = useState<ValidationErrors>({});
  
  // Utiliser soit les erreurs externes soit les erreurs locales
  const errors = setValidationErrors ? validationErrors : localValidationErrors;
  const setErrors = setValidationErrors || setLocalValidationErrors;
  
  // Fonction pour valider un champ
  const validateField = (field: FormField, value: string | number | Date | boolean): string | null => {
    if (!field.validation) return null;
    
    // Convertir une règle unique en tableau
    const validations = Array.isArray(field.validation) ? field.validation : [field.validation];
    
    for (const rule of validations) {
      // Vérifier si le champ est requis
      if (rule.required && (value === undefined || value === null || value === '')) {
        return rule.message;
      }
      
      // Pour les chaînes
      if (typeof value === 'string') {
        // Vérifier la longueur minimale
        if (rule.minLength !== undefined && value.length < rule.minLength) {
          return rule.message;
        }
        
        // Vérifier la longueur maximale
        if (rule.maxLength !== undefined && value.length > rule.maxLength) {
          return rule.message;
        }
        
        // Vérifier le pattern
        if (rule.pattern && !rule.pattern.test(value)) {
          return rule.message;
        }
      }
      
      // Pour les nombres
      if (typeof value === 'number') {
        // Vérifier la valeur minimale
        if (rule.min !== undefined && typeof rule.min === 'number' && value < rule.min) {
          return rule.message;
        }
        
        // Vérifier la valeur maximale
        if (rule.max !== undefined && typeof rule.max === 'number' && value > rule.max) {
          return rule.message;
        }
      }
      
      // Pour les dates
      if (value instanceof Date && !isNaN(value.getTime())) {
        // Vérifier la date minimale
        if (rule.min instanceof Date && value < rule.min) {
          return rule.message;
        }
        
        // Vérifier la date maximale
        if (rule.max instanceof Date && value > rule.max) {
          return rule.message;
        }
      }
      
      // Vérifier une correspondance exacte
      if (rule.matches !== undefined && value !== rule.matches) {
        return rule.message;
      }
      
      // Utiliser une fonction de validation personnalisée
      if (rule.validate && typeof rule.validate === 'function') {
        if (!rule.validate(value as string | number | Date)) {
          return rule.message;
        }
      }
    }
    
    return null;
  };
  
  // Fonction pour gérer la validation lors de la perte de focus
  const handleBlur = (field: FormField) => {
    if (!field.validation) return;
    
    const value = formData[field.name];
    const errorMessage = validateField(field, value);
    
    setErrors((prev) => ({
      ...prev,
      [field.name]: errorMessage,
    }));
    
    // Appeler le gestionnaire onBlur du champ s'il existe
    if (field.onBlur) {
      field.onBlur();
    }
  };
  
  const renderField = (field: FormField) => {
    const { 
      name, 
      label, 
      type = "text", 
      options = [], 
      icon, 
      placeholder, 
      value,
      required = false,
      disabled = false,
      readOnly = false,
      helpText,
      rows = 3,
      cols = 50,
      errorClassName = 'border-red-500 focus:ring-red-500'
    } = field;
    
    const errorMessage = errors[name];
    const hasError = !!errorMessage;
    
    const baseInputClass = `w-full px-3 py-2 border ${hasError ? errorClassName : 'border-gray-300 focus:ring-blue-500'} rounded-md focus:outline-none focus:ring-2`;
    
    const labelElement = (
      <label 
        className={`text-sm font-semibold text-gray-700 ${icon ? 'flex items-center' : ''}`}
        htmlFor={name}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
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
              onBlur={() => handleBlur(field)}
              required={required}
              disabled={disabled}
              className={baseInputClass}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
            {hasError && <p className="text-sm text-red-500">{errorMessage}</p>}
          </div>
        );
      } 
      case "textarea": {
        const textareaValue = value !== undefined 
          ? String(value) 
          : formData[name] !== undefined && formData[name] !== null 
            ? String(formData[name]) 
            : "";
            
        return (
          <div className="space-y-2" key={name}>
            {labelElement}
            <textarea
              id={name}
              name={name}
              value={textareaValue}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange(e)}
              onBlur={() => handleBlur(field)}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              rows={rows}
              cols={cols}
              className={baseInputClass}
            />
            {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
            {hasError && <p className="text-sm text-red-500">{errorMessage}</p>}
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
              onBlur={() => handleBlur(field)}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
              className={baseInputClass}
            />
            {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
            {hasError && <p className="text-sm text-red-500">{errorMessage}</p>}
          </div>
        );
      } 
      case "date": {
        let dateValue = '';

        if (formData[name] !== undefined) {
          dateValue = formData[name] instanceof Date 
          ? (formData[name] as Date).toISOString().split('T')[0] 
          : String(formData[name]);
        }

        return (
          <div className="space-y-2" key={name}>
            {labelElement}
            <input
              id={name}
              type={type}
              name={name}
              value={dateValue}
              onChange={handleChange}
              onBlur={() => handleBlur(field)}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              className={baseInputClass}
            />
            {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
            {hasError && <p className="text-sm text-red-500">{errorMessage}</p>}
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
                onBlur={() => handleBlur(field)}
                required={required}
                disabled={disabled}
                min={field.min || 0}
                max={field.max || 100}
                step={field.step || 5}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-lg font-semibold w-16 text-center">
                {rangeValue}%
              </span>
            </div>
            {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
            {hasError && <p className="text-sm text-red-500">{errorMessage}</p>}
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
              onBlur={() => handleBlur(field)}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              className={baseInputClass}
            />
            {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
            {hasError && <p className="text-sm text-red-500">{errorMessage}</p>}
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