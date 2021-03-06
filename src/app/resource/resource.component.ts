import { Component, EventEmitter, OnInit, Output } from '@angular/core'
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
    <p>[current resource ({{ items.length }})]</p>
    <button (click)="saveResource()">save</button>
    <button (click)="addItem()">+</button>
    <ol>
      <li *ngFor="let item of items; let i = index; trackBy: trackByIndex">
        <input value="{{ item.value }}" type="number" />
        <button (click)="removeItem(i)">x</button>
      </li>
    </ol>
    <p>[end of resource]</p>
    <p>[existing resources]</p>
    <ol>
      <li *ngFor="let id of existing$ | async">
        <span>{{ id }} </span><button (click)="resource.emit(id)">load</button>
      </li>
    </ol>
    <p>[end of list]</p>
  `,
})
export class ResourceComponent implements OnInit {
  @Output() resource = new EventEmitter()
  items = [12, 34, 56].map((value) => ({ value }))
  existing$ = this.getIdList()
  constructor(private readonly resources: ResourceService) {}

  ngOnInit(): void {}

  public addItem() {
    this.items.push({ value: 0 })
  }
  public removeItem(index: number) {
    this.items.splice(index, 1)
  }
  public saveResource(): Observable<string> {
    return from(this.resources.create(this.items.map(({ value }) => value)))
  }
  public trackByIndex(index: number, _item: any): number {
    return index
  }
  public getIdList(): Observable<string[]> {
    return from(this.resources.list())
  }
}
