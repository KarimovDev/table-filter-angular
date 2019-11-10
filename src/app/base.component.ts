import { Subject, Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

export abstract class BaseComponent implements OnDestroy {
  private destroy$ = new Subject();

  constructor() {}

  protected getDestroyableObserver(obs: Observable<any>): Observable<any> {
    return obs.pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
