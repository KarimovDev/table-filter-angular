import {
  Component,
  Output,
  Input,
  EventEmitter,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AppStateService } from '../app.state.service';
import { BaseComponent } from '../base.component';
import { map, debounceTime } from 'rxjs/operators';
import { PopupParams, ColumnFilterStateMap } from '../types';

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent extends BaseComponent implements OnInit {
  public checkBoxFormGroup: FormGroup;
  public searchControl: FormControl;
  public columnName: string;

  constructor(
    private formBuilder: FormBuilder,
    private appState: AppStateService,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  @Input()
  public params: PopupParams;

  @Output()
  closed = new EventEmitter();

  ngOnInit() {
    this.columnName = this.params.columnName;

    const formBuilderData = {};
    formBuilderData[this.columnName] = new FormArray([]);

    this.checkBoxFormGroup = this.formBuilder.group(formBuilderData);
    this.params.columnFilterData.forEach(el => {
      const control = new FormControl(el.isForbidden);
      (this.checkBoxFormGroup.controls[
        this.params.columnName
      ] as FormArray).push(control);
    });

    this.searchControl = this.formBuilder.control('');
    this.getDestroyableObserver(this.searchControl.valueChanges)
      .pipe(debounceTime(300))
      .subscribe(searchValue => {
        this.params.columnFilterData.forEach(
          checkbox =>
            (checkbox.hide = !checkbox.name
              .toLowerCase()
              .includes(searchValue.toLowerCase()))
        );

        this.ref.markForCheck();
      });

    this.getDestroyableObserver(this.checkBoxFormGroup.valueChanges)
      .pipe(
        map(
          (formGroup): ColumnFilterStateMap => {
            return formGroup[this.columnName].reduce(
              (result: ColumnFilterStateMap, currEl: boolean, i: number) => {
                const fieldName = this.params.columnFilterData[i].name;
                const forbiddenField = !currEl;

                result.set(fieldName, forbiddenField);

                return result;
              },
              new Map()
            );
          }
        )
      )
      .subscribe((resultMap: ColumnFilterStateMap) => {
        let count = 0;
        resultMap.forEach(el => {
          if (!el) {
            count++;
          }
        });
        if (!count) {
          resultMap.forEach((value, key) => resultMap.set(key, !value));
        }
        this.appState.filterState = this.appState.filterState.set(
          this.columnName,
          resultMap
        );
        this.appState.countState = this.appState.countState.set(
          this.columnName,
          count
        );
      });
  }

  @HostListener('click')
  onHostClick() {
    this.closed.next();
  }

  onCheckBoxClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
