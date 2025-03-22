import React from 'react';
import SalariesItem from '@/app/components/salaries/salariesItem';
import { Salary } from '@/app/db/schema';

export default function SalariesList({ salary, onDelete }:   { salary: Salary, onDelete: (id: number) => void; }) {
  
  return (<SalariesItem salary={salary} onDelete={onDelete} />);
};