import { ComponentFixture, TestBed } from '@angular/core/testing'
import { INode, NodeComponent } from './node.component'

describe('NodeComponent (empty)', () => {
  let component: NodeComponent
  let fixture: ComponentFixture<NodeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render with no data', () => {
    expect(fixture.nativeElement).toMatchInlineSnapshot(`
      <div
        id="root1"
      >
        
        
      </div>
    `)
  })

  it('should render with simple file', () => {
    component.data = {
      path: '/',
      content: 'a file',
    }
    fixture.detectChanges()
    expect(fixture.nativeElement).toMatchInlineSnapshot(`
      <div
        id="root2"
      >
        
        <div
          class="node odd file"
        >
          
          <div>
            <p>
               file 
              <code>
                /
              </code>
               contains: 
              <code>
                a file
              </code>
            </p>
          </div>
          
        </div>
        
      </div>
    `)
  })

  it('should render with empty folder', () => {
    component.data = {
      path: '/',
      children: [],
    }
    fixture.detectChanges()
    expect(fixture.nativeElement).toMatchInlineSnapshot(`
      <div
        id="root3"
      >
        
        <div
          class="node odd folder"
        >
          
          
          <div>
            <p>
               folder 
              <code>
                /
              </code>
               contains: 
            </p>
            
          </div>
        </div>
        
      </div>
    `)
  })
})
