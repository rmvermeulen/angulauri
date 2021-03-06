import { Component } from '@angular/core'
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { GetItemsResponse, TauriService } from './tauri.service'

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
    <p>has-prev: {{ hasPrevPage$ | async }}</p>
    <p>has-next: {{ hasNextPage$ | async }}</p>
    <div>
      <button (click)="decPage()" [disabled]="(hasPrevPage$ | async) === false">
        &lt;
      </button>
      <p>{{ page$ | async }}</p>
      <button (click)="incPage()" [disabled]="(hasNextPage$ | async) === false">
        &gt;
      </button>
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
  title = 'Angulauri'
  page$ = new BehaviorSubject(0)
  pageSize$ = new BehaviorSubject(10)
  cwd$: Observable<string>
  response$: Observable<GetItemsResponse<string>>
  items$: Observable<string[]>
  hasNextPage$: Observable<boolean>
  hasPrevPage$: Observable<boolean>
  constructor(private readonly tauri: TauriService) {
    this.cwd$ = from(this.tauri.getCwd())
    this.response$ = combineLatest([this.page$, this.pageSize$]).pipe(
      switchMap(([page, pageSize]: [number, number]) =>
        from(this.tauri.getItems<string>('id', page, pageSize))
      )
    )
    this.items$ = this.response$.pipe(map(({ items }) => items))
    this.hasNextPage$ = this.response$.pipe(map(({ hasNext }) => hasNext))
    this.hasPrevPage$ = this.response$.pipe(map(({ hasPrev }) => hasPrev))
  }

  incPage() {
    this.page$.next(this.page$.value + 1)
  }

  decPage() {
    this.page$.next(Math.max(0, this.page$.value - 1))
  }

  incPageSize() {
    this.pageSize$.next(this.pageSize$.value + 1)
  }

  decPageSize() {
    this.pageSize$.next(Math.max(1, this.pageSize$.value - 1))
  }
}
