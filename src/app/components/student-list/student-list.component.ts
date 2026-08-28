import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student, CreateStudentDto, UpdateStudentDto } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  departments: string[] = ['Computer Science', 'Data Science', 'Electrical Engineering', 'Business Administration', 'Software Engineering'];
  
  searchTerm: string = '';
  selectedDepartment: string = 'All';
  statusFilter: string = 'All';
  viewMode: 'grid' | 'table' = 'grid';

  isLoading: boolean = false;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' = 'info';

  // Modal Flags
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  editingStudentId: number | null = null;
  
  // Delete Modal
  isDeleteModalOpen: boolean = false;
  studentToDelete: Student | null = null;

  studentForm!: FormGroup;

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadDepartments();
  }

  private initForm(): void {
    const today = new Date().toISOString().substring(0, 10);
    this.studentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      dateOfBirth: ['2002-01-01', [Validators.required]],
      department: ['Computer Science', [Validators.required]],
      enrollmentDate: [today, [Validators.required]],
      gpa: [3.5, [Validators.required, Validators.min(0), Validators.max(4.0)]],
      isActive: [true]
    });
  }

  loadStudents(): void {
    this.isLoading = true;
    const dept = this.selectedDepartment === 'All' ? undefined : this.selectedDepartment;
    const active = this.statusFilter === 'All' ? undefined : (this.statusFilter === 'Active');

    this.studentService.getStudents(this.searchTerm, dept, active).subscribe({
      next: (data) => {
        this.students = data || [];
        this.applyLocalFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadDepartments(): void {
    this.studentService.getDepartments().subscribe({
      next: (depts) => {
        if (depts && depts.length > 0) {
          const set = new Set([...this.departments, ...depts]);
          this.departments = Array.from(set);
        }
      }
    });
  }

  applyLocalFilters(): void {
    let result = [...this.students];

    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      result = result.filter(s =>
        (s.firstName && s.firstName.toLowerCase().includes(term)) ||
        (s.lastName && s.lastName.toLowerCase().includes(term)) ||
        (s.email && s.email.toLowerCase().includes(term)) ||
        (s.department && s.department.toLowerCase().includes(term))
      );
    }

    if (this.selectedDepartment && this.selectedDepartment !== 'All') {
      result = result.filter(s => s.department === this.selectedDepartment);
    }

    if (this.statusFilter !== 'All') {
      const active = this.statusFilter === 'Active';
      result = result.filter(s => s.isActive === active);
    }

    this.filteredStudents = result;
  }

  onSearchChange(): void {
    this.applyLocalFilters();
  }

  onFilterChange(): void {
    this.applyLocalFilters();
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingStudentId = null;
    const today = new Date().toISOString().substring(0, 10);
    this.studentForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '2002-01-01',
      department: 'Computer Science',
      enrollmentDate: today,
      gpa: 3.5,
      isActive: true
    });
    this.isModalOpen = true;
  }

  openEditModal(student: Student): void {
    this.isEditMode = true;
    this.editingStudentId = student.id;
    
    const dob = this.formatDateForInput(student.dateOfBirth, '2002-01-01');
    const enroll = this.formatDateForInput(student.enrollmentDate, new Date().toISOString().substring(0, 10));

    this.studentForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      dateOfBirth: dob,
      department: student.department,
      enrollmentDate: enroll,
      gpa: student.gpa,
      isActive: student.isActive
    });
    this.isModalOpen = true;
  }

  private formatDateForInput(dateStr: string | null | undefined, fallback: string): string {
    if (!dateStr) return fallback;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return fallback;
      return d.toISOString().substring(0, 10);
    } catch {
      return fallback;
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.editingStudentId = null;
  }

  saveStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.showToast('Please fill out all required fields correctly.', 'error');
      return;
    }

    const formVal = this.studentForm.value;

    if (this.isEditMode && this.editingStudentId) {
      const updateDto: UpdateStudentDto = { ...formVal };
      this.studentService.updateStudent(this.editingStudentId, updateDto).subscribe({
        next: () => {
          this.showToast('Student record updated successfully!', 'success');
          this.closeModal();
          this.loadStudents();
        }
      });
    } else {
      const createDto: CreateStudentDto = { ...formVal };
      this.studentService.createStudent(createDto).subscribe({
        next: (created) => {
          this.showToast(`Student ${created.firstName} added successfully!`, 'success');
          this.closeModal();
          this.loadStudents();
        }
      });
    }
  }

  confirmDelete(student: Student): void {
    this.studentToDelete = student;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.studentToDelete = null;
  }

  deleteStudent(): void {
    if (!this.studentToDelete) return;

    const id = this.studentToDelete.id;
    const name = `${this.studentToDelete.firstName} ${this.studentToDelete.lastName}`;

    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.showToast(`Student "${name}" has been deleted.`, 'info');
        this.closeDeleteModal();
        this.loadStudents();
      }
    });
  }

  // Dashboard Stats Helpers
  get totalStudentsCount(): number {
    return this.students.length;
  }

  get activeStudentsCount(): number {
    return this.students.filter(s => s.isActive).length;
  }

  get averageGpa(): string {
    if (!this.students.length) return '0.00';
    const sum = this.students.reduce((acc, s) => acc + (s.gpa || 0), 0);
    return (sum / this.students.length).toFixed(2);
  }

  get departmentCount(): number {
    return new Set(this.students.map(s => s.department)).size;
  }

  getGpaBadgeClass(gpa: number): string {
    if (gpa >= 3.7) return 'gpa-excellent';
    if (gpa >= 3.0) return 'gpa-good';
    if (gpa >= 2.0) return 'gpa-average';
    return 'gpa-poor';
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
