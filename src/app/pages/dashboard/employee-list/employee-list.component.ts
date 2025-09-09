import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Employee } from "../../../core/models/employee.interface";

type SortDirection = "asc" | "desc" | "";
type SortColumn = "name" | "hireDate" | "";

@Component({
  selector: "app-employee-list",
  imports: [CommonModule],
  templateUrl: "./employee-list.component.html",
  styleUrl: "./employee-list.component.scss",
})
export class EmployeeListComponent {
  @Input() employees: Employee[] = [];
  @Output() editEmployee = new EventEmitter<Employee>();
  @Output() deleteEmployee = new EventEmitter<Employee>();

  sortDirection: SortDirection = "";
  sortColumn: SortColumn = "";
  sortedEmployees: Employee[] = [];

  ngOnInit() {
    this.sortedEmployees = [...this.employees];
  }

  ngOnChanges() {
    this.sortedEmployees = [...this.employees];
    if (this.sortColumn && this.sortDirection) {
      this.applySorting();
    }
  }

  sortBy(column: SortColumn): void {
    if (this.sortColumn === column) {
      // Toggle direction if same column is clicked
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      // New column, start with ascending
      this.sortColumn = column;
      this.sortDirection = "asc";
    }

    this.applySorting();
  }

  private applySorting(): void {
    this.sortedEmployees = [...this.employees].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      if (this.sortColumn === "name") {
        valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (this.sortColumn === "hireDate") {
        valueA = new Date(a.hireDate);
        valueB = new Date(b.hireDate);
      }

      if (valueA < valueB) {
        return this.sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn !== column) {
      return "fa-solid fa-sort";
    }
    return this.sortDirection === "asc"
      ? "fa-solid fa-sort-up"
      : "fa-solid fa-sort-down";
  }

  trackByEmployeeId(index: number, employee: Employee): string {
    return employee.id;
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  onEdit(employee: Employee): void {
    this.editEmployee.emit(employee);
  }

  onDelete(employee: Employee): void {
    this.deleteEmployee.emit(employee);
  }
}
