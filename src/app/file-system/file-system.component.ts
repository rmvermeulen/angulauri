import { Component, OnInit } from '@angular/core'
import { TauriService } from '../tauri/tauri.service'
import { INodeData } from './node/node.component'

@Component({
  selector: 'app-file-system',
  template: `
    <h2>file-system</h2>
    <app-node [data]="mockFsData"></app-node>
  `,
  styles: [],
})
export class FileSystemComponent implements OnInit {
  public mockFsData: INodeData = {
    path: '/',
    children: [
      { path: 'foo.txt', content: 'asdasd' },
      {
        path: 'images and such',
        children: [
          {
            path: 'images and such/file1.jpg',
            content: 'bytes',
          },
          {
            path: 'images and such/file2.jpg',
            content: 'more bytes',
          },
        ],
      },
    ],
  }

  constructor(private readonly tauri: TauriService) {}

  ngOnInit(): void {
    // this.tauri.fsCmd()
  }
}
