import * as Three from 'three'
import TextRenderer from './text-renderer'

const app = document.getElementById('app')!

const width = window.innerWidth - 300
const height = window.innerHeight

const scene = new Three.Scene()
scene.background = new Three.Color('#ffffff')

const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const light = new Three.DirectionalLight('#ffffff', 1);

light.castShadow = true
light.position.set(0, 3, 5)

scene.add( light );

const renderer = new Three.WebGLRenderer({ antialias: true })
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio)

app.prepend(renderer.domElement)

camera.position.set(0, 0, 5)

// camera.position.set(7, 0, 0)
// camera.rotateY(Math.PI / 2)

const titleAngle = -3 * Math.PI / 12

const titleTexture = new Three.TextureLoader().load(new URL('./assets/cobble.png', import.meta.url).href)
titleTexture.wrapS = titleTexture.wrapT = Three.RepeatWrapping
titleTexture.repeat.set(2, 2)
const title = new TextRenderer(scene, {
  size: 1,
  depth: .4,
})
title.text = 'minecraft'

title.onGeometryChange = (geometry) => {
  geometry.rotateX(titleAngle)
}

document.getElementById('title')?.addEventListener('input', getTextUpdater(title))
document.getElementById('title-font-selector')?.addEventListener('change', getFontUpdater(title))

const subtitleTexture = new Three.TextureLoader().load(new URL('./assets/blueprint.jpg', import.meta.url).href)
subtitleTexture.wrapS = subtitleTexture.wrapT = Three.RepeatWrapping
subtitleTexture.repeat.set(1, 1)
const subtitle = new TextRenderer(scene, {
  size: 1,
  depth: .4,
  material: new Three.MeshPhongMaterial({
    map: subtitleTexture,
  }),
})
subtitle.text = 'subtitle'

subtitle.onGeometryChange = (geometry) => {
  geometry.rotateX(titleAngle + Math.PI / 2)
  geometry.translate(0, -.58, -.98)
}

document.getElementById('subtitle')?.addEventListener('input', getTextUpdater(subtitle))
document.getElementById('subtitle-font-selector')?.addEventListener('change', getFontUpdater(subtitle))

function animate() {
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

function getTextUpdater(text: TextRenderer) {
  return (ev: Event) => {
    ev.preventDefault()
    text.text = (ev.target as HTMLInputElement).value
  }
}

function getFontUpdater(text: TextRenderer) {
  return (ev: Event) => {
    ev.preventDefault()
    text.font = (ev.target as HTMLInputElement).value
  }
}
