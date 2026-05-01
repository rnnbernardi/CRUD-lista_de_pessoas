import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PessoaListagem } from './pessoa-listagem';

describe('PessoaListagem', () => {
  let component: PessoaListagem;
  let fixture: ComponentFixture<PessoaListagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PessoaListagem],
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaListagem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
