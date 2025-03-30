import { DollarSign, ListChecks, Tag, FileText, Calendar } from "lucide-react";
import FormField from "@/app/types/formField";

export const transactionFormFields: FormField[] = [
  { 
    name: "amount", 
    label: "Montant", 
    type: "number", 
    icon: <DollarSign />, 
    required: true,
    validation: [
      {
        required: true,
        message: "Le montant est obligatoire"
      },
      {
        validate: (value) => !isNaN(Number(value)),
        message: "Veuillez entrer un montant valide"
      }
    ],
    helpText: "Montant de la transaction"
  },  
  { 
    name: "type", 
    label: "Type", 
    type: "select", 
    options: [
      { label: "Revenu", value: "Income" },
      { label: "Dépense", value: "Expense" }
    ], 
    icon: <ListChecks />, 
    required: true,
    validation: {
      required: true,
      message: "Le type de transaction est obligatoire"
    },
    helpText: "Type de transaction"
  },  
  { 
    name: "category", 
    label: "Catégorie", 
    type: "text", 
    placeholder: "Alimentaire", 
    icon: <Tag />, 
    required: true,
    validation: [
      {
        required: true,
        message: "La catégorie est obligatoire"
      },
      {
        minLength: 2,
        message: "La catégorie doit contenir au moins 2 caractères"
      }
    ],
    helpText: "Catégorie de la transaction"
  },  
  { 
    name: "date", 
    label: "Date", 
    type: "date", 
    icon: <Calendar />, 
    required: true,
    validation: [
      {
        required: true,
        message: "La date est obligatoire"
      },
      {
        validate: (value) => value instanceof Date && !isNaN(value.getTime()),
        message: "Veuillez entrer une date valide"
      }
    ],
    helpText: "Date de la transaction"
  },  
  { 
    name: "description", 
    label: "Description", 
    type: "text", 
    placeholder: "Courses de la semaine.", 
    icon: <FileText />, 
    required: true,
    validation: [
      {
        required: true,
        message: "La description est obligatoire"
      },
      {
        minLength: 3,
        message: "La description doit contenir au moins 3 caractères"
      }
    ],
    helpText: "Description détaillée de la transaction"
  },  
  { 
    name: "from", 
    label: "Date de début", 
    type: "date", 
    icon: <Calendar />,
    required: true,
    validation: [
      {
        required: true,
        message: "La date de début est obligatoire"
      },
      {
        validate: (value) => value instanceof Date && !isNaN(value.getTime()),
        message: "Veuillez entrer une date valide"
      }
    ],
    helpText: "Date de début de la période"
  },
  { 
    name: "to", 
    label: "Date de fin", 
    type: "date", 
    icon: <Calendar />,
    required: true,
    validation: [
      {
        required: true,
        message: "La date de fin est obligatoire"
      },
      {
        validate: (value) => {
          if (!value) return false;
          return value instanceof Date && !isNaN(value.getTime());
        },
        message: "Veuillez entrer une date valide"
      },
      {
        validate: (value) => {
          if (!value) return false;
          const fromElement = document.getElementById('from') as HTMLInputElement | null;
          if (!fromElement || !fromElement.value) return true;
          
          const endDate = value instanceof Date ? value : new Date(String(value));
          const startDate = new Date(fromElement.value);
          
          return endDate >= startDate;
        },
        message: "La date de fin doit être postérieure à la date de début"
      }
    ],
    helpText: "Date de fin de la période"
  },
];