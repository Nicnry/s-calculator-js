import { Wallet, FileText, ShieldCheck, PiggyBank, Briefcase, HeartPulse, Repeat, Percent, Calendar } from "lucide-react";
import FormField from "@/app/types/formField";

export const salaryFields: FormField[] = [
  { 
    name: "totalSalary", 
    label: "Salaire brut", 
    type: "number", 
    icon: <Wallet />, 
    required: true,
    min: 0,
    validation: [
      {
        required: true,
        message: "Le salaire brut est obligatoire"
      },
      {
        min: 0,
        message: "Le salaire brut ne peut pas être négatif"
      }
    ],
    helpText: "Montant total du salaire avant déductions"
  },
  { 
    name: "taxableSalary", 
    label: "Salaire taxable", 
    type: "number", 
    icon: <FileText />,
    required: true,
    min: 0,
    validation: [
      {
        required: true,
        message: "Le salaire taxable est obligatoire"
      },
      {
        min: 0,
        message: "Le salaire taxable ne peut pas être négatif"
      }
    ],
    helpText: "Montant du salaire soumis à l'impôt"
  },
  { 
    name: "employmentRate", 
    label: "Taux de travail", 
    type: "range", 
    icon: <Percent />,
    required: true,
    min: 0,
    max: 100,
    step: 5,
    validation: [
      {
        required: true,
        message: "Le taux de travail est obligatoire"
      },
      {
        min: 0,
        max: 100,
        message: "Le taux de travail doit être entre 0% et 100%"
      }
    ]
  },
  { 
    name: "avsAiApgContribution", 
    label: "Cotisation AVS", 
    type: "number", 
    icon: <ShieldCheck />,
    required: true,
    min: 0,
    validation: [
      {
        required: true,
        message: "La cotisation AVS est obligatoire"
      },
      {
        min: 0,
        message: "La cotisation AVS ne peut pas être négative"
      }
    ],
    helpText: "Cotisation pour l'assurance vieillesse et survivants"
  },
  { 
    name: "vdLpcfamDeduction", 
    label: "Cotisation LPC FAM", 
    type: "number", 
    icon: <PiggyBank />,
    required: true,
    min: 0,
    validation: [
      {
        required: true,
        message: "La cotisation LPC FAM est obligatoire"
      },
      {
        min: 0,
        message: "La cotisation LPC FAM ne peut pas être négative"
      }
    ]
  },
  { 
    name: "acDeduction", 
    label: "Cotisation chômage", 
    type: "number", 
    icon: <Briefcase />,
    required: true,
    min: 0,
    validation: [
      {
        required: true,
        message: "La cotisation chômage est obligatoire"
      },
      {
        min: 0,
        message: "La cotisation chômage ne peut pas être négative"
      }
    ]
  },
  { 
    name: "aanpDeduction", 
    label: "Cotisation AANP", 
    type: "number", 
    icon: <HeartPulse />,
    required: true,
    min: 0,
    validation: [
      {
        required: true,
        message: "La cotisation AANP est obligatoire"
      },
      {
        min: 0,
        message: "La cotisation AANP ne peut pas être négative"
      }
    ],
    helpText: "Assurance-accidents non professionnels"
  },
  { 
    name: "ijmA1Deduction", 
    label: "Cotisation IJMA1", 
    type: "number", 
    icon: <HeartPulse />,
    required: true,
    min: 0,
    validation: [
      {
        required: true,
        message: "La cotisation IJMA1 est obligatoire"
      },
      {
        min: 0,
        message: "La cotisation IJMA1 ne peut pas être négative"
      }
    ],
    helpText: "Indemnités journalières maladie"
  },
  { 
    name: "lppDeduction", 
    label: "Cotisation LPP", 
    type: "number", 
    icon: <PiggyBank />,
    required: true,
    min: 0,
    validation: [
      {
        required: true,
        message: "La cotisation LPP est obligatoire"
      },
      {
        min: 0,
        message: "La cotisation LPP ne peut pas être négative"
      }
    ],
    helpText: "Prévoyance professionnelle"
  },
  { 
    name: "monthlyPayments", 
    label: "Récurrence", 
    type: "number", 
    icon: <Repeat />,
    required: true,
    min: 1,
    max: 13,
    step: 1,
    validation: [
      {
        required: true,
        message: "La récurrence est obligatoire"
      },
      {
        min: 1,
        max: 13,
        message: "La récurrence doit être entre 1 et 13 mois"
      },
      {
        validate: (value) => Number.isInteger(Number(value)),
        message: "La récurrence doit être un nombre entier"
      }
    ],
    helpText: "Nombre de paiements par année (1-13)"
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
    ]
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
    ]
  },
];