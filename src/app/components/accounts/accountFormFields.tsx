import { Banknote, Hash, Wallet, DollarSign, Coins, Calendar } from "lucide-react";
import FormField from "@/app/types/formField";

export const accountFormFields: FormField[] = [
  { name: "bankName", label: "Nom banque", placeholder: "UBS", icon: <Banknote /> },
  { name: "accountNumber", label: "No compte", placeholder: "CH1589144187277187766", icon: <Hash /> },
  { name: "accountType", label: "Type de compte", type: "select", options: ["Courant", "Épargne"], icon: <Wallet /> },
  { name: "balance", label: "Montant", type: "number", icon: <DollarSign /> },
  { name: "currency", label: "Monnaie", placeholder: "CHF", icon: <Coins /> },
  { name: "from", label: "Date de début", type: "date", icon: <Calendar /> },
  { name: "to", label: "Date de fin", type: "date", icon: <Calendar /> },
];