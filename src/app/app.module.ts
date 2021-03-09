import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatPaginatorModule } from '@angular/material/paginator'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ResourceComponent } from './resource/resource.component'
import { TauriService } from './tauri.service'

@NgModule({
  declarations: [AppComponent, ResourceComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatPaginatorModule,
  ],
  providers: [TauriService],
  bootstrap: [AppComponent],
})
export class AppModule {}
