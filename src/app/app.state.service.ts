import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AppStateService {
  private filterStateSubject = new BehaviorSubject<any>({});
  private countStateSubject = new BehaviorSubject<any>({});
  public readonly filterState$ = this.filterStateSubject.asObservable();
  public readonly countState$ = this.countStateSubject
    .asObservable()
    .pipe(tap(x => console.warn(x)));

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
