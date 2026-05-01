import { Routes } from '@angular/router';
import { PessoaListagem } from './pessoa-listagem/pessoa-listagem';
import { PessoaCadastro } from './pessoa-cadastro/pessoa-cadastro';

export const routes: Routes = [
  { path: '', component: PessoaListagem },
  { path: 'cadastro', component: PessoaCadastro },
  { path: 'cadastro/:id', component: PessoaCadastro },
  { path: '**', redirectTo: ''}
];
