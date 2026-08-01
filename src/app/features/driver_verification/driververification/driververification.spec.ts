import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Driververification } from './driververification';

describe('Driververification', () => {
  let component: Driververification;
  let fixture: ComponentFixture<Driververification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Driververification],
    }).compileComponents();

    fixture = TestBed.createComponent(Driververification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
