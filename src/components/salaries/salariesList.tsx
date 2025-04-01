import React from 'react';
import SalariesItem from '@/components/salaries/salariesItem';
import { SalaryModel } from '@/models/SalaryModel';

export default function SalariesList({ salary, onDelete }: SalariesListProps) {
  
  return (<SalariesItem salary={salary} onDelete={onDelete} />);
};

interface SalariesListProps {
  salary: SalaryModel;
  onDelete: (id: number) => void;
}