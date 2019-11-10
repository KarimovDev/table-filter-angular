import {
  Component,
  Output,
  Input,
  EventEmitter,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AppStateService } from '../app.state.service';
import { BaseComponent } from '../base.component';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent extends BaseComponent implements OnInit {
  public form: FormGroup;
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
  public params: any;

  @Output()
  closed = new EventEmitter();

  ngOnInit() {
    this.columnName = this.params.columnName;

    const formBuilderData = {};
    formBuilderData[this.columnName] = new FormArray([]);

    this.form = this.formBuilder.group(formBuilderData);
    this.searchControl = this.formBuilder.control('');
    this.getDestroyableObserver(this.searchControl.valueChanges)
      .pipe(debounceTime(300))
      .subscribe(el => {
        this.params.data.forEach(
          subEl => (subEl.hide = subEl.name.toLowerCase().includes(el.toLowerCase()) ? false : true)
        );
        this.ref.markForCheck();
      });

    this.params.data.forEach(el => {
      const control = new FormControl(el.value);
      (this.form.controls[this.params.columnName] as FormArray).push(control);
    });

    this.getDestroyableObserver(this.form.valueChanges)
      .pipe(
        map(el => {
          const result = {};
          result[this.columnName] = el[this.columnName].reduce(
            (res, currEl, i) => {
              res[this.params.data[i].name] = !currEl;
              return res;
            },
            {}
          );
          return result;
        })
      )
      .subscribe(el => {
        const count = {};
        count[this.columnName] = Object.values(el[this.columnName]).filter(
          el => !el
        ).length;
        if (!count[this.columnName]) {
          Object.keys(el).forEach(key => el[key] = !el[key]);
        }
        this.appState.filterState = { ...this.appState.filterState, ...el };
        this.appState.countState = { ...this.appState.countState, ...count };
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
