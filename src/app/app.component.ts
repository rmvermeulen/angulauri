import { Component } from '@angular/core'
import { BehaviorSubject, combineLatest, EMPTY, from, Observable } from 'rxjs'
import { debounceTime, filter, map, switchMap } from 'rxjs/operators'
import { TauriService } from './tauri.service'

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
    <span id="title">{{ title }} app is running!</span>
    <p>resourceId: {{ resourceId$ | async }}</p>
    <p>items: {{ items$ | async }}</p>
    <p>has-prev: {{ hasPrevPage$ | async }}</p>
    <p>has-next: {{ hasNextPage$ | async }}</p>

    <p>router:</p>
    <router-outlet></router-outlet>
    <p>\\router</p>

    <mat-paginator
      pageIndex="page$|async"
      pageSize="pageSize$|async"
      on:page=""
    ></mat-paginator>

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
    <app-resource (resource)="loadResource($event)"></app-resource>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'Angulauri'
  resourceId$ = new BehaviorSubject('')
  page$ = new BehaviorSubject(0)
  pageSize$ = new BehaviorSubject(10)
  response$: Observable<any>
  items$: Observable<string[]>
  hasNextPage$: Observable<boolean>
  hasPrevPage$: Observable<boolean>

  constructor(private readonly tauri: TauriService) {
    const validId$ = this.resourceId$.pipe(filter((id) => id.length > 0))
    this.response$ = combineLatest([this.page$, this.pageSize$, validId$]).pipe(
      debounceTime(250),
      switchMap(([page, pageSize, id]: [number, number, string]) =>
        from(this.tauri.getItems<string>(id, page, pageSize)),
      ),
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

  loadResource(id: string) {
    this.resourceId$.next(id)
  }
}
