import { Component } from '@angular/core';
import { StudentListComponent } from './components/student-list/student-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StudentListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  title = 'Student Management System';
}
