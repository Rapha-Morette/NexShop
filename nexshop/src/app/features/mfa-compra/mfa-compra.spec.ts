import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaCompra } from './mfa-compra';

describe('MfaCompra', () => {
  let component: MfaCompra;
  let fixture: ComponentFixture<MfaCompra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MfaCompra]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MfaCompra);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
