import { TestBed } from '@angular/core/testing';

import { VerificacaoIpService } from './verificacao-ip';

describe('VerificacaoIp', () => {
  let service: VerificacaoIpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificacaoIpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
