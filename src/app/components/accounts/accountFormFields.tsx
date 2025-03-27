import { Banknote, Hash, Wallet, DollarSign, Coins, Calendar } from "lucide-react";
import FormField from "@/app/types/formField";

export const accountFormFields: FormField[] = [
  { 
    name: "bankName", 
    label: "Nom banque", 
    placeholder: "UBS", 
    icon: <Banknote />, 
    required: true,
    validation: [
      {
        required: true,
        message: "Le nom de la banque est obligatoire"
      },
      {
        minLength: 2,
        message: "Le nom de la banque doit contenir au moins 2 caractères"
      }
    ],
    helpText: "Nom de l'établissement bancaire"
  },
  { 
    name: "accountNumber", 
    label: "No compte", 
    placeholder: "CH1589144187277187766", 
    icon: <Hash />, 
    required: true,
    validation: [
      {
        required: true,
        message: "Le numéro de compte est obligatoire"
      },
      {
        pattern: /^CH[0-9]{2}[0-9]{16}$|^[0-9]{4,20}$/,
        message: "Veuillez entrer un numéro IBAN suisse valide (ex: CH1234567890123456) ou un numéro de compte"
      }
    ],
    helpText: "Format IBAN suisse (CH...) ou numéro de compte"
  },
  { 
    name: "accountType", 
    label: "Type de compte", 
    type: "select", 
    options: [
      { label: "Courant", value: "Courant" },
      { label: "Épargne", value: "Épargne" },
      { label: "Prévoyance", value: "Prévoyance" },
      { label: "Investissement", value: "Investissement" }
    ],
    icon: <Wallet />, 
    required: true,
    validation: {
      required: true,
      message: "Le type de compte est obligatoire"
    }
  },
  { 
    name: "balance", 
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
    helpText: "Solde actuel du compte"
  },
  { 
    name: "currency", 
    label: "Monnaie", 
    placeholder: "CHF", 
    icon: <Coins />, 
    required: true,
    validation: [
      {
        required: true,
        message: "La monnaie est obligatoire"
      },
      {
        pattern: /^[A-Z]{3}$/,
        message: "Veuillez entrer un code de devise valide à 3 lettres (ex: CHF, EUR, USD)"
      }
    ],
    helpText: "Code de la devise à 3 lettres (CHF, EUR, USD, etc.)"
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
    helpText: "Date d'ouverture du compte"
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
    helpText: "Date de clôture du compte (si applicable)"
  },
];