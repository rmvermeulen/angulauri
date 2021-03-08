import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TauriService } from './tauri.service'
import { ResourceComponent } from './resource/resource.component'
import { FormsModule, NgModel } from '@angular/forms'

@NgModule({
  declarations: [AppComponent, ResourceComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
  ],
  providers: [TauriService],
  bootstrap: [AppComponent],
})
export class AppModule {}
