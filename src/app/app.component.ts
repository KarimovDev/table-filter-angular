import {
  Component,
  Injector,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FilterService } from './filter/filter.service';
import { FilterComponent } from './filter/filter.component';
import { AppStateService } from './app.state.service';
import { BaseComponent } from './base.component';
import { rows, headers } from './data';
import { getOffsetRect } from './helpers';
import { PopupParams, ColumnFilterStateArray } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends BaseComponent implements OnInit {
  public currFilterState;
  public currCountState$;

  public rows: Array<any>;
  public headers: Array<any>;
  public hiddenRows: Array<boolean> = [];

  constructor(
    private injector: Injector,
    public popupFilter: FilterService,
    private appState: AppStateService
  ) {
    super();
    const PopupElement = createCustomElement(FilterComponent, { injector });
    customElements.define('popup-element', PopupElement);
  }

  ngOnInit() {
    this.rows = rows;
    this.headers = headers;
    this.currCountState$ = this.appState.countState$;

    this.getDestroyableObserver(this.appState.filterState$).subscribe(
      currState => {
        console.warn(currState);
        this.currFilterState = currState;

        this.rows.forEach((row, index) => {
          let hiddenRow = false;

          this.headers.forEach(column => {
            const forbiddenValuesForColumn = this.currFilterState.get(column);

            if (forbiddenValuesForColumn) {
              forbiddenValuesForColumn.forEach((value, key) => {
                const forbiddenRow = value && key === row[column];
                if (forbiddenRow) {
                  hiddenRow = true;
                }
              });
            }
          });

          this.hiddenRows[index] = hiddenRow;
        });
      }
    );
  }

  showPopupFilter(event: MouseEvent) {
    const coords = getOffsetRect(event.target);
    const columnName = (event.target as HTMLElement).getAttribute('column');
    const uniqueRowsWithCurrState: ColumnFilterStateArray = this.rows.reduce(
      (result: ColumnFilterStateArray, currEl) => {
        const isUniqueRow = !result.find(
          findedEl => findedEl.name === currEl[columnName]
        );

        if (isUniqueRow) {
          const rowName = currEl[columnName];
          const rowValueFromState =
            this.currFilterState.get(columnName) && this.appState.countState
              ? !this.currFilterState.get(columnName).get(rowName)
              : false;

          result.push({
            name: rowName,
            isForbidden: rowValueFromState,
          });
        }
        return result;
      },
      []
    );

    const params: PopupParams = {
      columnName,
      columnFilterData: uniqueRowsWithCurrState,
      left: coords.left.toString(),
      top: coords.top.toString(),
    };

    this.popupFilter.show(params);
  }
}
