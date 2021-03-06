import { Component } from '@angular/core';
import { TauriService } from './tauri.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
    <span>{{ title }} app is running!</span>
    <p>cwd: {{ cwd }}</p>
    <p>items: {{ items }}</p>
    <router-outlet></router-outlet>
    <button (click)="clearCwd()">Clear cwd</button>
    <button (click)="getCwd()">Fetch cwd</button>
  `,
})
export class AppComponent {
  title: string = 'Angulauri';
  cwd: string = '';
  items: number[] = [];
  constructor(private readonly tauri: TauriService) {
    this.getCwd();
    this.getItems();
  }

  async getCwd() {
    this.cwd = await this.tauri.getCwd();
  }
  async getItems() {
    this.items = await this.tauri.getItems('asd');
  }
  setCwd(cwd: string) {
    this.cwd = cwd;
  }
  clearCwd() {
    this.setCwd('');
  }
}
