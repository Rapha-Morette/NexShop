import { TestBed } from '@angular/core/testing';

import { VerificacaoSeguranca } from './verificacao-seguranca';

describe('VerificacaoSeguranca', () => {
  let service: VerificacaoSeguranca;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificacaoSeguranca);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
