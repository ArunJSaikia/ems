// src/app/components/employee-form/employee-form.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Employee } from "../../../core/models/employee.interface";
import { DashboardService } from "../../../core/services/dashboard.service";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-employee-form",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./employee-form.component.html",
  styleUrl: "./employee-form.component.scss",
})
export class EmployeeFormComponent {
  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  isSubmitting = false;
  employee: Employee | undefined;
  maxDate: string = "";
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: DashboardService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get("id");
    this.isEditMode = !!this.employeeId;

    if (this.isEditMode && this.employeeId) {
      this.loadEmployee(this.employeeId);
    }
  }

  private createForm(): void {
    this.maxDate = new Date().toISOString().split("T")[0];
    this.employeeForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      position: ["", [Validators.required]],
      department: [null, [Validators.required]],
      salary: [0, [Validators.required, Validators.min(1)]],
      hireDate: ["", [Validators.required]],
      isActive: [true],
    });
  }

  private loadEmployee(id: string): void {
    this.employee = this.employeeService.getEmployeeById(id);
    if (this.employee) {
      this.employeeForm.patchValue(this.employee);
    } else {
      this.router.navigate(["/dashboard"]);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.isSubmitting = true;

      // Simulate API delay
      setTimeout(() => {
        if (this.isEditMode && this.employeeId) {
          const success = this.employeeService.updateEmployee(
            this.employeeId,
            this.employeeForm.value,
          );
          if (success) {
            this.showSuccessMessage("Employee updated successfully!");
            this.router.navigate(["/dashboard"]);
          } else {
            this.showErrorMessage("Failed to update employee");
          }
        } else {
          this.employeeService.addEmployee(this.employeeForm.value);
          this.showSuccessMessage("Employee added successfully!");
          this.router.navigate(["/dashboard"]);
        }
        this.isSubmitting = false;
      }, 1000);
    } else {
      Object.keys(this.employeeForm.controls).forEach((key) => {
        this.employeeForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(["/dashboard"]);
  }

  private showSuccessMessage(message: string): void {
    alert(message);
    console.log(message);
  }

  private showErrorMessage(message: string): void {
    console.error(message);
  }
}
