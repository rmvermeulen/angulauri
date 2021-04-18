import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FileSystemComponent } from './file-system/file-system.component'
import { OverviewComponent } from './overview/overview.component'
import { ResourcesComponent } from './resources/resources.component'

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
  },
  {
    path: 'resources',
    component: ResourcesComponent,
  },
  {
    path: 'file-system',
    component: FileSystemComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
