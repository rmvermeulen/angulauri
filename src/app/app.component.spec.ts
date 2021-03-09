jest.mock('tauri/api/tauri')

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatPaginatorModule } from '@angular/material/paginator'
import { RouterTestingModule } from '@angular/router/testing'
import { promisified } from 'tauri/api/tauri'
import { AppComponent } from './app.component'
import { ResourceComponent } from './resource/resource.component'

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>
  let app: AppComponent
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
      imports: [RouterTestingModule, MatPaginatorModule],
      declarations: [AppComponent, ResourceComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    app = fixture.componentInstance
  })

  it('should create the app', () => {
    expect(app).toBeTruthy()
  })

  it(`should have as title 'angulauri'`, () => {
    expect(app.title).toEqual('Angulauri')
  })

  it('should render title', () => {
    fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement
    expect(compiled.querySelector('#title').textContent).toContain(
      'Angulauri app is running!',
    )
  })
})
