import { Injectable } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { FilterComponent } from './filter.component';

@Injectable()
export class FilterService {
  show(params: PopupParams) {
    const popupFilterEl: NgElement & WithProperties<FilterComponent> = document.createElement('popup-element') as any;

    popupFilterEl.addEventListener('closed', () => document.body.removeChild(popupFilterEl));
    popupFilterEl.params = params;
    document.body.appendChild(popupFilterEl);
  }
}

export interface PopupParams {
  columnName: string;
  data: Array<string>;
  top: string;
  left: string;
}
