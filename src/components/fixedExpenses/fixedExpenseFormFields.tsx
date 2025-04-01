import { Tag, Calculator, RotateCcw, CheckSquare, CreditCard, Calendar } from "lucide-react";
import FormField from "@/types/formField";

export const fixedExpenseFormFields: FormField[] = [
  { 
    name: "title", 
    label: "Titre", 
    placeholder: "Loyer", 
    icon: <Tag />,
    required: true,
    validation: [
      {
        required: true,
        message: "Le titre est obligatoire"
      },
      {
        minLength: 2,
        message: "Le titre doit contenir au moins 2 caractères"
      }
    ],
    helpText: "Nom de la dépense"
  },
  { 
    name: "amount", 
    label: "Montant", 
    type: "number", 
    placeholder: "1000", 
    icon: <Calculator />,
    required: true,
    min: 0,
    validation: [
      {
        required: true,
        message: "Le montant est obligatoire"
      },
      {
        min: 0,
        message: "Le montant doit être supérieur ou égal à 0"
      }
    ],
    helpText: "Montant de la dépense"
  },
  { 
    name: "category", 
    label: "Catégorie", 
    type: "select",
    options: [
      { label: "Logement", value: "Logement" },
      { label: "Alimentation", value: "Alimentation" },
      { label: "Transport", value: "Transport" },
      { label: "Loisirs", value: "Loisirs" },
      { label: "Santé", value: "Santé" },
      { label: "Éducation", value: "Éducation" },
      { label: "Autre", value: "Autre" }
    ],
    icon: <Calculator />,
    required: true,
    validation: {
      required: true,
      message: "La catégorie est obligatoire"
    },
    helpText: "Type de dépense"
  },
  { 
    name: "recurrence", 
    label: "Récurrence", 
    type: "select", 
    options: [
      { label: "Quotidienne", value: "quotidienne" },
      { label: "Hebdomadaire", value: "hebdomadaire" },
      { label: "Mensuelle", value: "mensuelle" },
      { label: "Annuelle", value: "annuelle" },
      { label: "Ponctuelle", value: "ponctuelle" }
    ],
    icon: <RotateCcw />,
    required: true,
    validation: {
      required: true,
      message: "La récurrence est obligatoire"
    },
    helpText: "Fréquence de paiement"
  },
  { 
    name: "paid", 
    label: "Payé", 
    type: "select", 
    options: [
      { label: "Oui", value: "true" },
      { label: "Non", value: "false" }
    ],
    icon: <CheckSquare />,
    required: true,
    validation: {
      required: true,
      message: "Vous devez indiquer si la dépense a été payée"
    },
    helpText: "Statut de paiement"
  },
  { 
    name: "paymentMethod", 
    label: "Méthode de paiement", 
    type: "select", 
    options: [
      { label: "Carte", value: "Carte" },
      { label: "Virement", value: "Virement" },
      { label: "Prélèvement", value: "Prélèvement" },
      { label: "Espèces", value: "Espèces" },
      { label: "Autre", value: "Autre" }
    ],
    icon: <CreditCard />,
    required: true,
    validation: {
      required: true,
      message: "La méthode de paiement est obligatoire"
    },
    helpText: "Mode de règlement"
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
    helpText: "Date de début de la dépense"
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
    helpText: "Date de fin de la dépense (obligatoire)"
  },
];