import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Make sure environments/environment is used and not environments/environment.prod
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {
  // employee comes from the api/[controller] name EmployeeController in the backend.
  private apiUrl = `${environment.apiUrl}/employee`

  constructor(private http: HttpClient) { }

  // Get all employees
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${employeeId}`);
  }

  // Create employee
  createEmployee(employee: Employee): Observable<Employee>{
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  // Delete employee
  deleteEmployee(employeeId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${employeeId}`);
  }

  updateEmployee(employee: Employee): Observable<Employee>{
    return this.http.put<Employee>(`${this.apiUrl}/${employee.employeeId}`, employee);
  };
}
