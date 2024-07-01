import * as Three from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader, Font as ThreeFont } from 'three/addons/loaders/FontLoader.js'

interface Font {
  name: string
  url: string
}

interface Properties {
  size: number
  depth: number
  material: Three.Material
}

export default class TextRenderer {
  public scene: Three.Scene

  public onGeometryChange: (geometry: TextGeometry) => void = () => {}
  public onMaterialChange: (geometry: TextGeometry) => void = () => {}

  private static fonts: Font[] = [
    {
      name: 'minecrafter',
      url: './assets/minecrafter.json',
    },
    {
      name: 'minecrafter-alt',
      url: './assets/minecrafter-alt.json',
    },
  ]

  private renderText: string = ''

  private selectedFont: Font = TextRenderer.fonts[0]
  private fontLoader: FontLoader
  private loadedFont: ThreeFont | null = null

  private _mesh: Three.Mesh | null = null
  private geometry: TextGeometry
  private material: Three.Material

  private props: Properties

  constructor(scene: Three.Scene, properties?: Partial<Properties>) {
    this.scene = scene
    this.fontLoader = new FontLoader()
    this.props = properties ?? { size: 1, depth: 0.75 }

    this.loadFont().then(() => {
      this.updateGeometry()
      this.updateMaterial()
      this.updateMesh()
    })
  }

  public set font(font: Font['name']) {
    this.selectedFont = TextRenderer.fonts.find(f => f.name === font) || TextRenderer.fonts[0]
    this.loadFont().then(() => {
      this.updateGeometry()
      this.updateMesh()
    })
  }
  public get font() {
    return this.selectedFont.name
  }

  public set text(text: string) {
    this.renderText = text
    this.updateGeometry()
    this.updateMesh()
  }
  public get text() {
    return this.renderText
  }

  public get mesh() {
    return this._mesh
  }
  private set mesh(mesh: Three.Mesh | null) {
    if (this._mesh) this.scene.remove(this._mesh)

    this._mesh = mesh
    if (mesh) this.scene.add(mesh)
  }

  private loadFont() {
    return new Promise<ThreeFont>((resolve, reject) => {
      const url = new URL(this.selectedFont.url, import.meta.url).href
      this.fontLoader.load(
        url,
        font => {
          this.loadedFont = font
          resolve(font)
        },
        undefined,
        reject,
      )
    })
  }

  private updateGeometry() {
    if (this.loadedFont) {
      this.geometry = new TextGeometry(this.renderText, {
        font: this.loadedFont,
        size: this.props.size,
        depth: this.props.depth,
      })

      this.onGeometryChange(this.geometry)
    }
  }

  private updateMaterial(color = '#dddddd') {
    if (this.props.material) {
      this.material = this.props.material
    } else {
      this.material = new Three.MeshStandardMaterial({ color })
    }
    this.onMaterialChange(this.geometry)
  }

  private updateMesh() {
    this.mesh = new Three.Mesh(this.geometry, this.material)

    if (this.geometry) {
      this.geometry.computeBoundingBox()
      this.mesh.position.x = -this.geometry.boundingBox.max.x / 2
    }
  }
}
