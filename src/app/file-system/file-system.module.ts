import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NodeComponent } from './node/node.component'
import { FileSystemComponent } from './file-system.component'

@NgModule({
  declarations: [NodeComponent, FileSystemComponent],
  imports: [CommonModule],
})
export class FileSystemModule {}
