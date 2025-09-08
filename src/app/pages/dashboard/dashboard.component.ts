// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../core/models/employee.interface';
import { DashboardService } from '../../core/services/dashboard.service';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeListComponent,
    EmployeeFormComponent,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = '';
  selectedDepartment = '';
  departments: string[] = [];

  totalEmployees = 0;
  activeEmployees = 0;

  constructor(
    private employeeService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((employees) => {
      this.employees = employees;
      this.updateStats();
      this.updateDepartments();
      this.applyFilters();
    });
  }

  private updateStats(): void {
    this.totalEmployees = this.employees.length;
    this.activeEmployees = this.employees.filter((emp) => emp.isActive).length;
  }

  private updateDepartments(): void {
    this.departments = [
      ...new Set(this.employees.map((emp) => emp.department)),
    ].sort();
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  onEditEmployee(employee: Employee): void {
    this.router.navigate(['/employees/edit', employee.id]);
  }

  onDeleteEmployee(employee: Employee): void {
    if (
      confirm(
        `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
      )
    ) {
      this.employeeService.deleteEmployee(employee.id);
    }
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onDepartmentFilter(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.employees;

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(term) ||
          emp.lastName.toLowerCase().includes(term) ||
          emp.email.toLowerCase().includes(term) ||
          emp.position.toLowerCase().includes(term) ||
          emp.department.toLowerCase().includes(term)
      );
    }

    // Apply department filter
    if (this.selectedDepartment) {
      filtered = filtered.filter(
        (emp) => emp.department === this.selectedDepartment
      );
    }

    this.filteredEmployees = filtered;
  }
}
