import { Component, OnInit } from '@angular/core'
import { from, Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ResourceService } from '../resource.service'

@Component({
  selector: 'app-resource',
  styles: [
    `
      input {
        margin: auto;
      }
    `,
  ],
  template: `
    <p>[current resource]</p>
    <button (click)="saveResource()">save</button>
    <ul>
      <li *ngFor="let item of items; trackBy: trackByIndex">
        <input value="item" type="number" />
      </li>
    </ul>
    <p>[end of resource]</p>
    <p>[existing resources]</p>
    <p></p>
    <ol>
      <li>foo</li>
      <li>bar</li>
      <li>{{ existing$ | async }}</li>
    </ol>
    <p>[end of list]</p>
  `,
})
export class ResourceComponent implements OnInit {
  items = [2, 12, 15, 123, 9]
  existing$ = this.getIdList()
  constructor(private readonly resources: ResourceService) {}

  ngOnInit(): void {}

  public saveResource(): Observable<string> {
    return from(this.resources.create(this.items))
  }
  public trackByIndex(index: number, _item: any): number {
    return index
  }
  public getIdList(): Observable<string[]> {
    return from(this.resources.list()).pipe(
      tap((ids) => console.log('get ids', ids)),
    )
  }
}
