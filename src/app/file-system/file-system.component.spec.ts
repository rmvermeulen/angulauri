import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FileSystemComponent } from './file-system.component'
import { NodeComponent } from './node/node.component'

describe('FileSystemComponent', () => {
  let component: FileSystemComponent
  let fixture: ComponentFixture<FileSystemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileSystemComponent, NodeComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSystemComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
