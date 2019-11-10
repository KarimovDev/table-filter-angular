import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterStateMap, CountState } from './types';

@Injectable()
export class AppStateService {
  private filterStateSubject = new BehaviorSubject<FilterStateMap>(new Map());
  private countStateSubject = new BehaviorSubject<CountState>(new Map());
  public readonly filterState$ = this.filterStateSubject.asObservable();
  public readonly countState$ = this.countStateSubject.asObservable();

  get filterState() {
    return this.filterStateSubject.getValue();
  }

  set filterState(newState) {
    this.filterStateSubject.next(newState);
  }

  get countState() {
    return this.countStateSubject.getValue();
  }

  set countState(newState) {
    this.countStateSubject.next(newState);
  }
}
