import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';
import { PessoaService } from '../services/pessoa';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pessoa-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pessoa-cadastro.html',
  styleUrl: './pessoa-cadastro.css',
})
export class PessoaCadastro implements OnInit{
  private http = inject(HttpClient);
  private router = inject(Router);
  private pessoaService = inject(PessoaService); 
  private route = inject(ActivatedRoute);

  exibirModal = false;
  isEdicao = false;
  idSelecionado: number | null = null;

  pessoa = {
    identificacao: '',
    nome: '',
    data_nascimento: '',
    email: '',
    telefone: '',
    enderecos: [] as any[]
  };

  novoEndereco = {
    tipo: 'RESIDENCIAL',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    municipio: '',
    estado: ''
  };

  buscarCEP() {
    const cep = this.novoEndereco.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
        next: (dados: any) => {
          if (!dados.erro) {
            this.novoEndereco.logradouro = dados.logradouro;
            this.novoEndereco.bairro = dados.bairro;
            this.novoEndereco.municipio = dados.localidade;
            this.novoEndereco.estado = dados.uf;
          } else {
            alert('CEP não encontrado.');
          }
        },
        error: () => alert('Erro ao buscar o CEP.')
      });
    }
  }

  confirmarEndereco() {
    if (this.novoEndereco.cep && this.novoEndereco.logradouro) {
      this.pessoa.enderecos.push({ ...this.novoEndereco });
      this.exibirModal = false; 
      this.limparModalEndereco();
    } else {
      alert('Preencha pelo menos o CEP e o Logradouro.');
    }
  }

  removerEndereco(index: number) {
    this.pessoa.enderecos.splice(index, 1);
  }

  limparModalEndereco() {
    this.novoEndereco = {
      tipo: 'RESIDENCIAL',
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      municipio: '',
      estado: ''
    };
  }

 ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      this.idSelecionado = Number(id);
      this.carregarDadosParaEdicao(this.idSelecionado);
    }
  }

  carregarDadosParaEdicao(id: number) {
    this.http.get(`http://localhost:3000/api/pessoas/${id}`).subscribe({
      next: (res: any) => {
        this.pessoa = {
          ...res,
          enderecos: res.enderecos || [] 
        };
      },
      error: (err: any) => console.error('Erro ao carregar dados:', err)
    });
  }

  salvar() {
    const url = 'http://localhost:3000/api/pessoas';

    if (this.isEdicao) {
      this.http.put(`${url}/${this.idSelecionado}`, this.pessoa).subscribe({
        next: () => {
          alert('Registro atualizado com sucesso!');
          this.router.navigate(['/listagem']);
        },
        error: (err: any) => alert('Erro ao atualizar: ' + err.message)
      });
    } else {
      this.http.post(url, this.pessoa).subscribe({
        next: () => {
          alert('Salvo com sucesso!');
          this.router.navigate(['/listagem']);
        },
        error: (err: any) => alert('Erro ao salvar: ' + err.message)
      });
    }
  }
}