import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';
import { By } from '@angular/platform-browser';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInputComponent], // componente standalone
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the search value on input', () => {
    spyOn(component.search, 'emit');

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'Angular';
    input.dispatchEvent(new Event('input'));

    expect(component.search.emit).toHaveBeenCalledWith('Angular');
  });
});
