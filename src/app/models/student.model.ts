export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  department: string;
  enrollmentDate: string;
  gpa: number;
  isActive: boolean;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  department: string;
  enrollmentDate: string;
  gpa: number;
  isActive: boolean;
}

export interface UpdateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  department: string;
  enrollmentDate: string;
  gpa: number;
  isActive: boolean;
}
