import React from "react";
import { User, DollarSign, Briefcase, CreditCard, Users } from "lucide-react";

export const getMenuItems = (id: number): MenuItem[] => [
  { 
    href: `/users/${id}`, 
    label: "Mon compte",
    icon: <User className="mr-2 h-5 w-5" />,
    hasDropdown: true,
    dropdownItems: [
      { href: `/users/${id}/dashboard`, label: "Dashboard" },
      { href: `/users/${id}`, label: "Profile" }
    ]
  },
  { 
    href: `/users/${id}/fixed-expenses`, 
    label: "Dépenses fixes",
    icon: <DollarSign className="mr-2 h-5 w-5" />,
    hasDropdown: true,
    dropdownItems: [
      { href: `/users/${id}/fixed-expenses/new`, label: "Ajouter" },
      { href: `/users/${id}/fixed-expenses`, label: "Voir tout" },
      { href: `/users/${id}/fixed-expenses/statistics`, label: "Statistiques" }
    ]
  },
  { 
    href: `/users/${id}/salaries`, 
    label: "Salaires",
    icon: <Briefcase className="mr-2 h-5 w-5" />,
    hasDropdown: true,
    dropdownItems: [
      { href: `/users/${id}/salaries/new`, label: "Ajouter" },
      { href: `/users/${id}/salaries`, label: "Voir tout" },
      { href: `/users/${id}/salaries/statistics`, label: "Statistiques" }
    ]
  },
  { 
    href: `/users/${id}/accounts`, 
    label: "Comptes",
    icon: <CreditCard className="mr-2 h-5 w-5" />,
    hasDropdown: true,
    dropdownItems: [
      { href: `/users/${id}/accounts/new`, label: "Nouveau compte" },
      { href: `/users/${id}/accounts`, label: "Voir tout" },
      { href: `/users/${id}/accounts/statistics`, label: "Statistiques" }
    ]
  },
  { 
    href: `/users`, 
    label: "Utilisateurs",
    icon: <Users className="mr-2 h-5 w-5" />,
    hasDropdown: false
  },
];

export type SubMenuItem = {
  href: string;
  label: string;
}

export type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  hasDropdown: boolean;
  dropdownItems?: SubMenuItem[];
}