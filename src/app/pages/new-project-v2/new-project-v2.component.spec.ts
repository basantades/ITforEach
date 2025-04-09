import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectV2Component } from './new-project-v2.component';

describe('NewProjectV2Component', () => {
  let component: NewProjectV2Component;
  let fixture: ComponentFixture<NewProjectV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProjectV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProjectV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
