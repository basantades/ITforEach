import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestProjectsComponent } from './latest-projects.component';

describe('LatestProjectsComponent', () => {
  let component: LatestProjectsComponent;
  let fixture: ComponentFixture<LatestProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
