jest.mock('tauri/api/tauri')

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatPaginatorModule } from '@angular/material/paginator'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'
import { ResourceComponent } from './resource/resource.component'

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>
  let app: AppComponent
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatPaginatorModule, NoopAnimationsModule],
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
