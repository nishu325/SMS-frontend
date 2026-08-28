import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Student, CreateStudentDto, UpdateStudentDto } from '../models/student.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  private mockStudents: Student[] = [
    { id: 1, firstName: 'Alex', lastName: 'Johnson', fullName: 'Alex Johnson', email: 'alex.johnson@university.edu', phoneNumber: '+1 (555) 234-5678', dateOfBirth: '2002-05-14', department: 'Computer Science', enrollmentDate: '2023-08-20', gpa: 3.85, isActive: true },
    { id: 2, firstName: 'Sophia', lastName: 'Martinez', fullName: 'Sophia Martinez', email: 'sophia.m@university.edu', phoneNumber: '+1 (555) 345-6789', dateOfBirth: '2001-11-28', department: 'Data Science', enrollmentDate: '2022-08-15', gpa: 3.92, isActive: true },
    { id: 3, firstName: 'Marcus', lastName: 'Chen', fullName: 'Marcus Chen', email: 'marcus.chen@university.edu', phoneNumber: '+1 (555) 456-7890', dateOfBirth: '2003-03-08', department: 'Electrical Engineering', enrollmentDate: '2024-01-10', gpa: 3.40, isActive: true },
    { id: 4, firstName: 'Emily', lastName: 'Watson', fullName: 'Emily Watson', email: 'emily.watson@university.edu', phoneNumber: '+1 (555) 567-8901', dateOfBirth: '2002-09-19', department: 'Business Administration', enrollmentDate: '2023-08-20', gpa: 3.68, isActive: true },
    { id: 5, firstName: 'David', lastName: 'Kim', fullName: 'David Kim', email: 'david.kim@university.edu', phoneNumber: '+1 (555) 678-9012', dateOfBirth: '2001-07-04', department: 'Software Engineering', enrollmentDate: '2022-08-15', gpa: 3.75, isActive: false }
  ];

  constructor(private http: HttpClient) {}

  getStudents(search?: string, department?: string, isActive?: boolean): Observable<Student[]> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    if (department && department !== 'All') {
      params = params.set('department', department);
    }
    if (isActive !== undefined && isActive !== null) {
      params = params.set('isActive', isActive.toString());
    }

    return this.http.get<Student[]>(this.apiUrl, { params }).pipe(
      catchError(err => {
        console.warn('Backend API note. Serving local client state fallback.', err);
        return of(this.mockStudents);
      })
    );
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.mockStudents.find(s => s.id === id) || this.mockStudents[0];
        return of(found);
      })
    );
  }

  createStudent(student: CreateStudentDto): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student).pipe(
      catchError(() => {
        const newId = this.mockStudents.length ? Math.max(...this.mockStudents.map(s => s.id)) + 1 : 1;
        const newStudent: Student = {
          id: newId,
          ...student,
          fullName: `${student.firstName} ${student.lastName}`
        };
        this.mockStudents.push(newStudent);
        return of(newStudent);
      })
    );
  }

  updateStudent(id: number, student: UpdateStudentDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, student).pipe(
      catchError(() => {
        const index = this.mockStudents.findIndex(s => s.id === id);
        if (index !== -1) {
          this.mockStudents[index] = {
            id,
            ...student,
            fullName: `${student.firstName} ${student.lastName}`
          };
        }
        return of(undefined);
      })
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        this.mockStudents = this.mockStudents.filter(s => s.id !== id);
        return of(undefined);
      })
    );
  }

  getDepartments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/departments`).pipe(
      catchError(() => of(['Computer Science', 'Data Science', 'Electrical Engineering', 'Business Administration', 'Software Engineering']))
    );
  }
}
