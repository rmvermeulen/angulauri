import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatPaginatorModule } from '@angular/material/paginator'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FileSystemComponent } from './file-system/file-system.component'
import { ResourceComponent } from './resource/resource.component'
import { ResourceService } from './resource/resource.service'
import { ResourcesComponent } from './resources/resources.component'
import { TauriService } from './tauri/tauri.service'
import { OverviewComponent } from './overview/overview.component'
import { FileSystemModule } from './file-system/file-system.module'

@NgModule({
  declarations: [
    AppComponent,
    ResourceComponent,
    ResourcesComponent,
    OverviewComponent,
  ],
  providers: [ResourceService, TauriService],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatPaginatorModule,
    FileSystemModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
