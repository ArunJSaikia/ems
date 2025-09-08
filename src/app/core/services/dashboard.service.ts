import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee, CreateEmployeeRequest } from '../models/employee.interface';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly STORAGE_KEY = 'employees';
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  constructor() {
    this.loadEmployeesFromStorage();
  }

  private loadEmployeesFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const employees = stored ? JSON.parse(stored) : this.getInitialData();
      this.employeesSubject.next(employees);
    } catch (error) {
      console.error('Error loading employees from localStorage:', error);
      this.employeesSubject.next(this.getInitialData());
    }
  }

  private saveToStorage(employees: Employee[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(employees));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getInitialData(): Employee[] {
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        position: 'Software Engineer',
        department: 'Engineering',
        salary: 75000,
        hireDate: '2023-01-15',
        isActive: true,
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        position: 'Product Manager',
        department: 'Product',
        salary: 85000,
        hireDate: '2022-08-20',
        isActive: true,
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@company.com',
        position: 'UX Designer',
        department: 'Design',
        salary: 68000,
        hireDate: '2021-11-05',
        isActive: true,
      },
      {
        id: '4',
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@company.com',
        position: 'QA Engineer',
        department: 'Quality Assurance',
        salary: 62000,
        hireDate: '2022-03-12',
        isActive: false,
      },
      {
        id: '5',
        firstName: 'Daniel',
        lastName: 'Martinez',
        email: 'daniel.martinez@company.com',
        position: 'DevOps Engineer',
        department: 'IT',
        salary: 90000,
        hireDate: '2021-07-30',
        isActive: true,
      },
      {
        id: '6',
        firstName: 'Sophia',
        lastName: 'Brown',
        email: 'sophia.brown@company.com',
        position: 'HR Specialist',
        department: 'Human Resources',
        salary: 58000,
        hireDate: '2020-10-18',
        isActive: true,
      },
      {
        id: '7',
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@company.com',
        position: 'Business Analyst',
        department: 'Business',
        salary: 72000,
        hireDate: '2023-04-02',
        isActive: true,
      },
      {
        id: '8',
        firstName: 'Olivia',
        lastName: 'Taylor',
        email: 'olivia.taylor@company.com',
        position: 'Marketing Specialist',
        department: 'Marketing',
        salary: 65000,
        hireDate: '2022-06-25',
        isActive: true,
      },
      {
        id: '9',
        firstName: 'James',
        lastName: 'Anderson',
        email: 'james.anderson@company.com',
        position: 'Finance Manager',
        department: 'Finance',
        salary: 95000,
        hireDate: '2020-01-10',
        isActive: false,
      },
      {
        id: '10',
        firstName: 'Ava',
        lastName: 'Thomas',
        email: 'ava.thomas@company.com',
        position: 'Data Scientist',
        department: 'Data',
        salary: 105000,
        hireDate: '2023-07-19',
        isActive: true,
      },
    ];
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.employees$;
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employeesSubject.value.find((emp) => emp.id === id);
  }

  addEmployee(employeeData: CreateEmployeeRequest): void {
    const newEmployee: Employee = {
      ...employeeData,
      id: this.generateId(),
      isActive: true,
    };

    const currentEmployees = this.employeesSubject.value;
    const updatedEmployees = [...currentEmployees, newEmployee];

    this.employeesSubject.next(updatedEmployees);
    this.saveToStorage(updatedEmployees);
  }

  updateEmployee(id: string, employeeData: Partial<Employee>): boolean {
    const currentEmployees = this.employeesSubject.value;
    const index = currentEmployees.findIndex((emp) => emp.id === id);

    if (index !== -1) {
      const updatedEmployees = [...currentEmployees];
      updatedEmployees[index] = { ...updatedEmployees[index], ...employeeData };

      this.employeesSubject.next(updatedEmployees);
      this.saveToStorage(updatedEmployees);
      return true;
    }
    return false;
  }

  deleteEmployee(id: string): boolean {
    const currentEmployees = this.employeesSubject.value;
    const filteredEmployees = currentEmployees.filter((emp) => emp.id !== id);

    if (filteredEmployees.length !== currentEmployees.length) {
      this.employeesSubject.next(filteredEmployees);
      this.saveToStorage(filteredEmployees);
      return true;
    }
    return false;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
