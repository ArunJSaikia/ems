// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Employee } from "../../core/models/employee.interface";
import { DashboardService } from "../../core/services/dashboard.service";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { EmployeeFormComponent } from "./employee-form/employee-form.component";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import * as XLSX from "xlsx";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    EmployeeListComponent,
    EmployeeFormComponent,
    FormsModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm = "";
  selectedDepartment = "";
  departments: string[] = [];

  totalEmployees = 0;
  activeEmployees = 0;

  constructor(
    private employeeService: DashboardService,
    private router: Router,
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
    this.router.navigate(["/employees/add"]);
  }

  onEditEmployee(employee: Employee): void {
    this.router.navigate(["/employees/edit", employee.id]);
  }

  onDeleteEmployee(employee: Employee): void {
    if (
      confirm(
        `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`,
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
          emp.department.toLowerCase().includes(term),
      );
    }

    // Apply department filter
    if (this.selectedDepartment) {
      filtered = filtered.filter(
        (emp) => emp.department === this.selectedDepartment,
      );
    }

    this.filteredEmployees = filtered;
  }
  exportToExcel(): void {
    if (!this.filteredEmployees || this.filteredEmployees.length === 0) {
      alert("No employees to export");
      return;
    }

    // Prepare data for Excel export
    const excelData = this.filteredEmployees.map((employee) => ({
      Name: `${employee.firstName} ${employee.lastName}`,
      Email: employee.email,
      Position: employee.position,
      Department: employee.department,
      Salary: employee.salary,
      "Hire Date": new Date(employee.hireDate).toLocaleDateString("en-US"),
      Status: employee.isActive ? "Active" : "Inactive",
    }));

    // Create workbook and worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    // Generate filename with current date
    const fileName = `employees_${new Date().toISOString().split("T")[0]}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, fileName);
  }

  exportToCsv(): void {
    // Use the same filteredEmployees data that you pass to child component
    if (!this.filteredEmployees || this.filteredEmployees.length === 0) {
      alert("No employees to export");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Position",
      "Department",
      "Salary",
      "Hire Date",
      "Status",
    ];

    const rows = this.filteredEmployees.map((employee) => [
      `${employee.firstName} ${employee.lastName}`,
      employee.email,
      employee.position,
      employee.department,
      employee.salary.toString(),
      new Date(employee.hireDate).toLocaleDateString("en-US"),
      employee.isActive ? "Active" : "Inactive",
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";

    rows.forEach((row) => {
      const escapedRow = row.map((field) => `"${field}"`);
      csvContent += escapedRow.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `employees_${new Date().toISOString().split("T")[0]}.csv`,
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
