import { Component, Input, OnInit } from '@angular/core'
import { assert } from 'chai'

export type IFile = { path: string; content: string }
export type IFolder = { path: string; children: INode[] }
export type INode = IFile | IFolder

@Component({
  selector: 'app-node',
  styles: [
    `
      .node {
        border: solid black 1px;
        border-radius: 12px 0 0 0;
        margin-left: 8px;
        background-color: #fda;
      }
      .node.file {
        color: #222;
        background-color: #2da;
        border-radius: 12px 0px 0px 12px;
      }
      .node.folder {
        color: #333;
      }
      .even {
      }
      .odd {
      }
      p {
        margin-left: 10px;
        font-size: 120%;
      }
    `,
  ],
  template: `
    <div *ngIf="data; else empty" [ngClass]="classMap">
      <div *ngIf="getFile() as file">
        <p>
          file <code>{{ file.path }}</code> contains:
          <code>{{ file.content }}</code>
        </p>
      </div>
      <div *ngIf="getFolder() as folder">
        <p>
          folder <code>{{ folder.path }}</code> contains:
        </p>
        <app-node
          *ngFor="let child of folder.children"
          [data]="child"
          [depth]="depth + 1"
        >
        </app-node>
      </div>
    </div>
    <ng-template #empty><p>---</p></ng-template>
  `,
})
export class NodeComponent implements OnInit {
  @Input() depth = 0
  @Input() data?: INode

  get classMap() {
    const isEven = !!(this.depth % 2)
    return {
      node: true,
      even: isEven,
      odd: !isEven,
      file: !!this.getFile(),
      folder: !!this.getFolder(),
    }
  }

  static classifyNode(node: INode): 'none' | 'file' | 'folder' {
    if (node === undefined) {
      return 'none'
    }
    if ('content' in node) {
      return 'file'
    }
    assert('children' in node)
    return 'folder'
  }
  ngOnInit(): void {}

  getFile(): IFile | undefined {
    return this.data && 'content' in this.data ? this.data : undefined
  }
  getFolder(): IFolder | undefined {
    return this.data && 'children' in this.data ? this.data : undefined
  }
}
