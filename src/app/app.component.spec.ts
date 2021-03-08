jest.mock('tauri/api/tauri')

import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'
import { promisified } from 'tauri/api/tauri'
import { ResourceComponent } from './resource/resource.component'

describe('AppComponent', () => {
  beforeEach(async () => {
    const mock: jest.Mock = promisified as any
    mock.mockImplementation(({ cmd }) => {
      switch (cmd) {
        case 'getCwd':
          return '/some/dir'
        case 'getItems':
          return [1, 2, 3, 4, 5]
      }
      return null
    })

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, ResourceComponent],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have as title 'angulauri'`, () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('Angulauri')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement
    expect(compiled.querySelector('#title').textContent).toContain(
      'Angulauri app is running!',
    )
  })
})
