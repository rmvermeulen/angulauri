import { Component, OnInit } from '@angular/core'
import { TauriService } from '../tauri/tauri.service'

@Component({
  selector: 'app-file-system',
  template: ` <p>file-system works!</p> `,
  styles: [],
})
export class FileSystemComponent implements OnInit {
  constructor(private readonly tauri: TauriService) {}

  ngOnInit(): void {
    this.tauri.fsCmd()
  }
}
