import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should create the modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the modal when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('.fixed'));
    expect(modal).toBeTruthy();
  });

  it('should emit onClose when background is clicked', () => {
    component.isOpen = true;
    spyOn(component.onClose, 'emit');

    fixture.detectChanges();

    const background = fixture.debugElement.query(By.css('.fixed'));
    background.nativeElement.click();

    expect(component.onClose.emit).toHaveBeenCalled();
  });

  it('should emit onClose when close button is clicked', () => {
    component.isOpen = true;
    spyOn(component.onClose, 'emit');

    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('button'));
    closeButton.nativeElement.click();

    expect(component.onClose.emit).toHaveBeenCalled();
  });
});
