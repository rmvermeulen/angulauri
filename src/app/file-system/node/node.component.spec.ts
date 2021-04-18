import { ComponentFixture, TestBed } from '@angular/core/testing'
import { INodeData, NodeComponent } from './node.component'

describe.each([
  undefined,
  {
    path: '/',
    content: 'a file',
  },
  {
    path: '/',
    children: [
      {
        path: 'icon.png',
        content: 'a file',
      },
      {
        path: 'icon.jpg',
        content: 'a file',
      },
    ],
  },
])('NodeComponent data=%p', (data: INodeData | undefined) => {
  let component: NodeComponent
  let fixture: ComponentFixture<NodeComponent>

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeComponent],
    }).compileComponents()
  })

  beforeAll(() => {
    fixture = TestBed.createComponent(NodeComponent)
    component = fixture.componentInstance
    component.data = data
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(fixture.nativeElement).toMatchSnapshot()
    expect(fixture.nativeElement.querySelector('div')).toMatchSnapshot()
  })

  it('matches expected output', () => {
    expect(fixture).toMatchSnapshot()
  })

  it.skip('should render a .node', () => {
    const node = fixture.nativeElement.querySelector('.node')
    expect(node).toBeTruthy()
  })

  it.skip('should render a .file', () => {
    const file = fixture.nativeElement.querySelector('.file')
    expect(file).toBeTruthy()
  })

  it.skip('should render a .folder', () => {
    const folder = fixture.nativeElement.querySelector('.folder')
    expect(folder).toBeTruthy()
  })
})
