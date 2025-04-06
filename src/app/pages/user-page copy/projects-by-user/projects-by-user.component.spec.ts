import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsByUserComponent } from './projects-by-user.component';

describe('ProjectsByUserComponent', () => {
  let component: ProjectsByUserComponent;
  let fixture: ComponentFixture<ProjectsByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsByUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
