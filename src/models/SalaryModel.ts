import { Salary } from '@/db/schema';

export class SalaryModel implements Salary {
  id?: number;
  userId: number;
  totalSalary: number;
  taxableSalary: number;
  avsAiApgContribution: number;
  vdLpcfamDeduction: number;
  acDeduction: number;
  aanpDeduction: number;
  ijmA1Deduction: number;
  lppDeduction: number;
  monthlyPayments: number;
  employmentRate: number;
  from: Date;
  to: Date;
  createdAt?: Date;
  adjustedTaxableSalary: number;

  constructor(salary: Salary) {
    this.id = salary.id;
    this.userId = salary.userId;
    this.totalSalary = salary.totalSalary;
    this.taxableSalary = salary.taxableSalary;
    this.avsAiApgContribution = salary.avsAiApgContribution;
    this.vdLpcfamDeduction = salary.vdLpcfamDeduction;
    this.acDeduction = salary.acDeduction;
    this.aanpDeduction = salary.aanpDeduction;
    this.ijmA1Deduction = salary.ijmA1Deduction;
    this.lppDeduction = salary.lppDeduction;
    this.monthlyPayments = salary.monthlyPayments;
    this.employmentRate = salary.employmentRate;
    this.from = salary.from;
    this.to = salary.to;
    this.createdAt = salary.createdAt;

    this.adjustedTaxableSalary = this.getAdjustedTaxableSalary();
  }

  getTaxableSalaryDividedBy100(): number {
    return this.taxableSalary / 100;
  }

  getAdjustedTaxableSalary(): number {
    return this.getTaxableSalaryDividedBy100() * this.employmentRate;
  }

  getNetSalary(): number {
    return this.adjustedTaxableSalary - this.getTotalDeductions();
  }

  getTotalDeductions(): number {
    const adjustedTaxableSalaryDividedBy100 = this.adjustedTaxableSalary / 100;

    const avsAiApgContributionAmount = adjustedTaxableSalaryDividedBy100 * this.avsAiApgContribution;
    const vdLpcfamDeductionAmount = adjustedTaxableSalaryDividedBy100 * this.vdLpcfamDeduction;
    const acDeductionAmount = adjustedTaxableSalaryDividedBy100 * this.acDeduction;
    const aanpDeductionAmount = adjustedTaxableSalaryDividedBy100 * this.aanpDeduction;
    const ijmA1DeductionAmount = adjustedTaxableSalaryDividedBy100 * this.ijmA1Deduction;
    
    return avsAiApgContributionAmount + 
      vdLpcfamDeductionAmount + 
      acDeductionAmount + 
      aanpDeductionAmount + 
      ijmA1DeductionAmount +
      this.lppDeduction;
  }

  toSalary(): Salary {
    return {
      id: this.id,
      userId: this.userId,
      totalSalary: this.totalSalary,
      taxableSalary: this.taxableSalary,
      avsAiApgContribution: this.avsAiApgContribution,
      vdLpcfamDeduction: this.vdLpcfamDeduction,
      acDeduction: this.acDeduction,
      aanpDeduction: this.aanpDeduction,
      ijmA1Deduction: this.ijmA1Deduction,
      lppDeduction: this.lppDeduction,
      monthlyPayments: this.monthlyPayments,
      employmentRate: this.employmentRate,
      from: this.from,
      to: this.to,
      createdAt: this.createdAt
    };
  }
}