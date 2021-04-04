import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatPaginatorModule } from '@angular/material/paginator'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import { ResourceComponent } from '../resource/resource.component'
import { ResourcesComponent } from './resources.component'

describe('ResourcesComponent', () => {
  let component: ResourcesComponent
  let fixture: ComponentFixture<ResourcesComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatPaginatorModule, NoopAnimationsModule],
      declarations: [ResourcesComponent, ResourceComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
