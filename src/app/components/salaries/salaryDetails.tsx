'use client';

import { Salary } from "@/app/db/schema";
import { SalaryService } from "@/app/services/salaryService";
import { useState, useEffect } from "react";
import { 
  Mail, 
  User as UserIcon, 
  Calendar, 
  Edit 
} from "lucide-react";
import Link from "next/link";
import DetailItem from "@/app/components/global/DetailItem";

export default function SalaryDetails({ userId, salaryId }: { userId: number; salaryId: number; }) {
  const [salary, setSalary] = useState<Salary>({ userId: userId, totalSalary : 0, taxableSalary: 0, avsAiApgContribution: 0, vdLpcfamDeduction: 0, acDeduction: 0, aanpDeduction: 0, ijmA1Deduction: 0, lppDeduction: 0 });
  useEffect(() => {
    (async () => setSalary(await SalaryService.getSalaryById(salaryId)))();
  }, [salaryId]);

  const [formattedCreatedAt, setFormattedCreatedAt] = useState('');

  useEffect(() => {
    if (salary?.createdAt) {
      setFormattedCreatedAt(
        new Date(salary?.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      );
    }
  }, [salary?.createdAt]);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-blue-50 px-6 py-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-4xl font-bold mb-4">
          {salary?.totalSalary}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{salary?.totalSalary}</h1>
        <p className="text-gray-500 mb-4">{salary?.taxableSalary}</p>
        
        <Link 
          href={`${salary?.id}/edit`} 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Edit size={20} />
          <span>Modifier le profil</span>
        </Link>
      </div>

      <div className="p-6 space-y-4">

        <DetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={String(salary.userId)} 
        />

        <DetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={String(salary.totalSalary)} 
        />

        <DetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={String(salary.taxableSalary)} 
        />

        <DetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={String(salary.avsAiApgContribution)} 
        />

        <DetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={String(salary.vdLpcfamDeduction)} 
        />
        
        <DetailItem 
          icon={<Mail size={20} />} 
          label="Adresse email" 
          value={String(salary.acDeduction)} 
        />
        
        <DetailItem 
          icon={<Mail size={20} />} 
          label="Adresse email" 
          value={String(salary.aanpDeduction)} 
        />
        
        <DetailItem 
          icon={<Mail size={20} />} 
          label="Adresse email" 
          value={String(salary.ijmA1Deduction)} 
        />
        
        <DetailItem 
          icon={<Mail size={20} />} 
          label="Adresse email" 
          value={String(salary.lppDeduction)} 
        />
        
        {formattedCreatedAt && (
          <DetailItem 
            icon={<Calendar size={20} />} 
            label="Date de création" 
            value={formattedCreatedAt} 
          />
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <Link 
          href=".." 
          className="text-blue-600 hover:underline"
        >
          Retour à la liste
        </Link>
        
        <div className="flex space-x-3">
          <Link 
            href={`${salary?.id}/edit`} 
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Modifier
          </Link>
          
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={() => {
              if(confirm("Voulez-vous vraiment supprimer ce compte ?")) {
                // TODO
              }
            }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}