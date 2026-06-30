import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '@models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {
  // employee comes from the api/[controller] name EmployeeController in the backend.
  private apiUrl = `${environment.apiUrl}/Employees`

  constructor(private http: HttpClient) { }

  // GET all employees
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  // GET employee by id
  getEmployeeById(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${employeeId}`);
  }

  // CREATE employee
  createEmployee(employee: Employee): Observable<Employee>{
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  // DELETE employee
  deleteEmployee(employeeId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${employeeId}`);
  }

  // UPDATE employe
  updateEmployee(employee: Employee): Observable<Employee>{
    return this.http.put<Employee>(`${this.apiUrl}/${employee.employeeId}`, employee);
  };
}
