import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TauriService } from './tauri.service';
@Component({
  selector: 'app-root',
  styles: [
    `
      div * {
        display: inline-block;
      }
    `,
  ],
  template: `
    <span>{{ title }} app is running!</span>
    <p>cwd: {{ cwd$ | async }}</p>
    <p>items: {{ items$ | async }}</p>
    <div>
      <button (click)="decPage()">&lt;</button>
      <p>{{ page$ | async }}</p>
      <button (click)="incPage()">&gt;</button>
    </div>
    <div>
      <button (click)="decPageSize()">&lt;</button>
      <p>{{ pageSize$ | async }}</p>
      <button (click)="incPageSize()">&gt;</button>
    </div>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title: string = 'Angulauri';
  cwd$: Observable<string>;
  items$: Observable<string[]>;
  page$ = new BehaviorSubject(0);
  pageSize$ = new BehaviorSubject(10);
  constructor(private readonly tauri: TauriService) {
    this.cwd$ = from(this.tauri.getCwd());
    this.items$ = combineLatest([this.page$, this.pageSize$]).pipe(
      switchMap(([page, pageSize]: [number, number]) =>
        from(this.tauri.getItems('id', page, pageSize))
      )
    );
  }

  incPage() {
    this.page$.next(this.page$.value + 1);
  }

  decPage() {
    this.page$.next(Math.max(0, this.page$.value - 1));
  }

  incPageSize() {
    this.pageSize$.next(this.pageSize$.value + 1);
  }

  decPageSize() {
    this.pageSize$.next(Math.max(1, this.pageSize$.value - 1));
  }
}
