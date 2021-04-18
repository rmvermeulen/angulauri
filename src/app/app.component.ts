import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  styles: [],
  template: `
    <span id="title">{{ title }} app is running!</span>
    <nav>
      <ul>
        <li>
          <a routerLink="/">Overview</a>
        </li>
        <li>
          <a routerLink="/resources">Manage Resources</a>
        </li>
        <li>
          <a routerLink="/file-system">Browse the file system</a>
        </li>
      </ul>
    </nav>
    <p>router:</p>
    <router-outlet></router-outlet>
    <p>\\router</p>
  `,
})
export class AppComponent {
  title = 'Angulauri'
}
