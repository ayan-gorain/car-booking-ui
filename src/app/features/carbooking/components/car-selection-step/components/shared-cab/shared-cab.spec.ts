import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCab } from './shared-cab';

describe('SharedCab', () => {
  let component: SharedCab;
  let fixture: ComponentFixture<SharedCab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedCab],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedCab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
