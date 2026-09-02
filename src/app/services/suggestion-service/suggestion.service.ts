import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suggestion } from '../../models/suggestion-models/suggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  //  private apiUrl = `${environment.apiUrl}/Employees`
  private apiUrl = `${environment.apiUrl}/Suggestions`

  constructor(private http: HttpClient) { }

  // GET ALL suggestions
  getSuggestions(): Observable<Suggestion[]>{
    return this.http.get<Suggestion[]>(this.apiUrl);
  }

  // GET suggestion by id
  getSuggestionById(suggestionId: number): Observable<Suggestion>{
    return this.http.get<Suggestion>(`${this.apiUrl}/${suggestionId}`);
  }

  // GET suggestion by randomId (generated in the backend)
  getSuggestionByRandomId(): Observable<Suggestion>{
    return this.http.get<Suggestion>(`${this.apiUrl}/randomId`);
  }

  // CREATE suggestion
  createSuggestion(suggestion: Suggestion): Observable<Suggestion>{
    return this.http.post<Suggestion>(this.apiUrl, suggestion);
  }

  // DELETE suggestion
  deleteSuggestion(suggestionId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${suggestionId}`);
  }

  // UPDATE suggestion
  updateSuggestion(suggestion: Suggestion): Observable<Suggestion>{
    return this.http.put<Suggestion>(`${this.apiUrl}/${suggestion.suggestionId}`, suggestion);
  }
}
