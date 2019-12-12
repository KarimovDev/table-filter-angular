import { FilterComponent } from './filter.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { FilterService } from './filter.service';
import { AppStateService } from '../app.state.service';
import { ColumnFilterState, PopupParams } from '../types';

const columnFilterStateFactory = () => {
  let counter = 0;

  return (): ColumnFilterState => ({
    name: `Test${counter++}`,
    isForbidden: false,
  });
};

const columnFilterState = columnFilterStateFactory();

const inputParams: PopupParams = {
  columnName: 'Test',
  columnFilterData: [
    columnFilterState(),
    columnFilterState(),
    columnFilterState(),
    columnFilterState(),
    columnFilterState(),
  ],
  top: '100',
  left: '100',
};

describe('FilterComponentUnitTesting', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent],
      imports: [ReactiveFormsModule],
      providers: [FilterService, AppStateService],
    });

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    // fixture.debugElement
    // fixture.nativeElement
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should contains form array and be equal with params data', () => {
    component.params = inputParams;
    component.ngOnInit();
    // fixture.detectChanges();
    expect(
      Object.keys(
        (component.checkBoxFormGroup.controls[
          inputParams.columnName
        ] as FormArray).controls
      ).length
    ).toBe(component.params.columnFilterData.length);
  });
});
