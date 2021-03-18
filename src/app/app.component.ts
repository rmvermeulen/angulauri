import { Component } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { BehaviorSubject, combineLatest, EMPTY, from, Observable } from 'rxjs'
import { debounceTime, filter, map, switchMap } from 'rxjs/operators'
import { GetItemsResponse, TauriService } from './tauri.service'

@Component({
  selector: 'app-root',
  styles: [],
  template: `
    <router-outlet></router-outlet>
    <span id="title">{{ title }} app is running!</span>
    <div *ngIf="itemPage$ | async as page">
      <p>resourceId: {{ resourceId$ | async }}</p>
      <p>items: {{ page.items }}</p>
      <p>has-prev: {{ page.hasPrev }}</p>
      <p>has-next: {{ page.hasNext }}</p>

      <p>router:</p>
      <p>\\router</p>

      <mat-paginator
        [disabled]="false"
        [pageIndex]="page$ | async"
        [pageSize]="pageSize$ | async"
        [length]="100"
        [pageSizeOptions]="[5, 10, 15, 25, 50]"
        (page)="handlePageEvent($event)"
      ></mat-paginator>
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
  itemPage$: Observable<GetItemsResponse<string> & { id: string }>

  constructor(private readonly tauri: TauriService) {
    const validId$ = this.resourceId$.pipe(filter((id) => id.length > 0))
    this.itemPage$ = combineLatest([this.page$, this.pageSize$, validId$]).pipe(
      debounceTime(250),
      switchMap(([page, pageSize, id]: [number, number, string]) =>
        from(this.tauri.getItems<string>(id, page, pageSize)).pipe(
          map((res) => ({ id, ...res })),
        ),
      ),
    )
  }
  loadResource(id: string) {
    this.resourceId$.next(id)
  }

  handlePageEvent({
    pageIndex,
    pageSize,
    previousPageIndex,
    length,
  }: PageEvent) {
    this.page$.next(pageIndex)
    this.pageSize$.next(pageSize)
  }
}
