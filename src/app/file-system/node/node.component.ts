import { Component, Input, OnInit } from '@angular/core'

export type IFileData = { path: string; content: string }
export type IFolderData = { path: string; children: INodeData[] }
export type INodeData = IFileData | IFolderData

@Component({
  selector: 'app-node',
  styles: [
    `
      .file {
      }
      .folder {
      }
      .even {
        background-color: #fee;
      }
      .odd {
        background-color: #eee;
      }
      .node {
        margin: 8px;
        padding: 8px;
        /*
        /* border-radius: 8px; */ */
        color: darkgray;
        border: solid black 1px;
      }
    `,
  ],
  template: `
    <div *ngIf="data" [ngClass]="classes">
      <h2 [class]="'file'" *ngIf="getFile() as file">
        file
        <code>{{ file.path }}</code>
        contains:
        <pre>{{ file.content }}</pre>
      </h2>
      <div [class]="'folder'" *ngIf="getFolder() as folder">
        folder <code>{{ folder.path }}</code> contains:
        <app-node
          *ngFor="let child of folder.children"
          [data]="child"
          [depth]="depth + 1"
        >
        </app-node>
      </div>
    </div>
  `,
})
export class NodeComponent implements OnInit {
  @Input() public depth = 0
  @Input() public data?: INodeData
  public get classes() {
    const isEven = !!(this.depth % 2)
    return {
      node: true,
      even: isEven,
      odd: !isEven,
    }
  }
  constructor() {}

  ngOnInit(): void {}

  public getFile(): IFileData | undefined {
    return this.data && 'content' in this.data ? this.data : undefined
  }
  public getFolder(): IFolderData | undefined {
    return this.data && 'children' in this.data ? this.data : undefined
  }
}
