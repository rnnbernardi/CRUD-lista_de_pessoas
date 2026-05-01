import { Component, signal, OnInit, inject } from '@angular/core'; // Ajustado para 'inject'
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pessoa-listagem',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './pessoa-listagem.html',
  styleUrl: './pessoa-listagem.css',
})
export class PessoaListagem implements OnInit {
  private http = inject(HttpClient);

  termoBusca = '';
  pessoas = signal<any[]>([]);

  ngOnInit() {
    this.carregarPessoas();
  }

  carregarPessoas() {
    this.http.get<any[]>('http://localhost:3000/api/pessoas').subscribe({
      next: (dados: any[]) => {
        console.log('Dados do Postgres:', dados);
        this.pessoas.set(dados);
      },
      error: (err: any) => {
        console.error('Erro na requisição:', err);
      }
    });
  }
  buscarPessoas() {
    const url = this.termoBusca 
      ? `http://localhost:3000/api/pessoas?busca=${this.termoBusca}`
      : `http://localhost:3000/api/pessoas`;

    this.http.get<any[]>(url).subscribe({
      next: (dados: any[]) => this.pessoas.set(dados),
      error: (err: any) => console.error('Erro na busca:', err)
    });
  }

  excluirPessoa(id: number) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      this.http.delete(`http://localhost:3000/api/pessoas/${id}`).subscribe({
        next: () => {
          alert('Pessoa excluída com sucesso!');
          this.carregarPessoas();
        },
        error: (err: any) => console.error('Erro ao excluir:', err)
      });
    }
  }
}