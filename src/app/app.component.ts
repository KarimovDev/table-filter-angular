import {
  Component,
  Injector,
  ChangeDetectionStrategy,
  OnInit,
  Input
} from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FilterService, PopupParams } from './filter/filter.service';
import { FilterComponent } from './filter/filter.component';
import { AppStateService } from './app.state.service';
import { BaseComponent } from './base.component';
import { rows, headers } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends BaseComponent implements OnInit {
  public currState;
  public currCountState;

  public currState$;
  public currCountState$;

  public hiddenRows: Array<boolean> = [];

  constructor(
    injector: Injector,
    public popupFilter: FilterService,
    private appState: AppStateService
  ) {
    super();
    // Convert `PopupComponent` to a custom element.
    const PopupElement = createCustomElement(FilterComponent, { injector });
    // Register the custom element with the browser.
    customElements.define('popup-element', PopupElement);
  }

  ngOnInit() {
    this.currState$ = this.appState.filterState$;
    this.currCountState$ = this.appState.countState$;
    this.getDestroyableObserver(this.appState.filterState$).subscribe(el => {
      console.log(el);
      this.currState = el;

      rows.forEach((row, index) => {
        let hidden = false;
        headers.forEach(column => {
          const forbiddenValues = this.currState[column];
          if (forbiddenValues) {
            Object.keys(forbiddenValues).forEach(key => {
              if (forbiddenValues[key]
                && key === row[column]) {
                hidden = true;
              }
            });
          }
        });
        this.hiddenRows[index] = hidden;
      });
    });
    // this.getDestroyableObserver(this.appState.countState$).subscribe(el => {
    //   console.log(el);
    //   this.currCountState = el;
    // });
  }

  showPopupFilter(event: MouseEvent) {
    const coords = this.getOffsetRect(event.target);
    const columnName = (event.target as HTMLElement).getAttribute('column');
    const params: PopupParams = {
      columnName,
      data: rows.reduce((res: Array<any>, currEl) => {
        if (!res.find(findedEl => findedEl.name === currEl[columnName])) {
          res.push({
            name: currEl[columnName],
            value: this.currState[columnName]
              ? !this.currState[columnName][currEl[columnName]]
              : false
          });
        }
        return res;
      }, []),
      left: coords.left.toString(),
      top: coords.top.toString()
    };

    this.popupFilter.show(params);
  }

  getOffsetRect(elem) {
    const box = elem.getBoundingClientRect();

    const body = document.body;
    const docElem = document.documentElement;

    const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    const scrollLeft =
      window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    const clientTop = docElem.clientTop || body.clientTop || 0;
    const clientLeft = docElem.clientLeft || body.clientLeft || 0;

    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  }
}
