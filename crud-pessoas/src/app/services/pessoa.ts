import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private apiUrl = 'http://localhost:3000/api/pessoas';

  constructor(private http: HttpClient) { }

  salvar(pessoa: any): Observable<any> {
    return this.http.post(this.apiUrl, pessoa);
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}