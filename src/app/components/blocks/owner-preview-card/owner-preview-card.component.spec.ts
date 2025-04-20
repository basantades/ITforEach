import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnerPreviewCardComponent } from './owner-preview-card.component';
import { ProjectsService } from '../../../services/database/projects.service';
import { UserAvatarComponent } from '../../ui/user-avatar/user-avatar.component';

describe('OwnerPreviewCardComponent', () => {
  let component: OwnerPreviewCardComponent;
  let fixture: ComponentFixture<OwnerPreviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerPreviewCardComponent, UserAvatarComponent],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            transformImageUrl: () => 'transformed-url'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerPreviewCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the user fullname and githubusername', () => {
    component.user = { fullname: 'Ada Lovelace', githubusername: 'adalove' } as any;
    component.lastProject = { name: 'Proyecto Demo' } as any;
    component.projectCount = 1;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ada Lovelace');
    expect(compiled.textContent).toContain('adalove');
  });

  it('should display the last project name', () => {
    component.user = { fullname: '', githubusername: 'devuser' } as any;
    component.lastProject = { name: 'Super Proyecto' } as any;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Super Proyecto');
  });
});
