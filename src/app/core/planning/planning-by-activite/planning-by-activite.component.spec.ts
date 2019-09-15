import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningByActiviteComponent } from './planning-by-activite.component';

describe('PlanningByActiviteComponent', () => {
  let component: PlanningByActiviteComponent;
  let fixture: ComponentFixture<PlanningByActiviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningByActiviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningByActiviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
