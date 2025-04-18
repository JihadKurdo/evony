import * as THREE from "three"
import { OrbitControls } from "jsm/controls/OrbitControls.js"
import { Sky } from "jsm/Addons.js";

let w = window.innerWidth
let h = window.innerHeight

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setSize(w, h)
document.body.appendChild(renderer.domElement)

const fov = 90
const aspect = w / h
const near = .1
const far = 10

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

camera.position.z = 3
camera.position.y = 1
const scene = new THREE.Scene()

const sky = new Sky()
sky.scale.setScalar(450000)

const phi = THREE.MathUtils.degToRad(90)
const theta = THREE.MathUtils.degToRad(180)
const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta  * 2)

sky.material.uniforms.sunPosition.value = sunPosition

scene.add(sky)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = .03

const light = new THREE.DirectionalLight(0xffffff, 5)
light.position.set(1, 1, 1)
light.castShadow = true
scene.add(light)

light.shadow.mapSize.width = 512 * 5
light.shadow.mapSize.height = 512 * 5
light.shadow.camera.near = .1
light.shadow.camera.far = 500

const light2 = new THREE.DirectionalLight(0xffffff, 3)
light2.position.set(-1, 1, 1)
scene.add(light2)

const planeGeometry = new THREE.PlaneGeometry(1, 1)
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xde9547,
    side: THREE.DoubleSide
})

const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.z = -3
plane.scale.x = 2
plane.scale.y = 15
plane.rotation.x = Math.PI / 2
plane.castShadow = false
plane.receiveShadow = true
scene.add(plane)

const boxGeometry = new THREE.BoxGeometry(.25, .25, .25)
const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
})

const box = new THREE.Mesh(boxGeometry, boxMaterial)
box.castShadow = true
box.receiveShadow = false
box.position.y = .125
box.position.z = 1
scene.add(box)

const edges = new THREE.EdgesGeometry(boxGeometry)
const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x000000
})
const edgeLines = new THREE.LineSegments(edges, edgeMaterial)
edgeLines.position.copy(box.position)
scene.add(edgeLines)

const boxGroup = new THREE.Group()
boxGroup.add(box)
boxGroup.add(edgeLines)
scene.add(boxGroup)

var holdInterval

function whileHolding(e) {

    let side = e.target.dataset.move

    if (side == "right") {

        if (boxGroup.position.x <= -.87) return
        boxGroup.position.x -= .02

    }
    else if (side == "left") {

        if (boxGroup.position.x >= .87) return
        boxGroup.position.x += .02

    }
    
}

function startHold(e) {

    e.preventDefault()

    if (holdInterval) return
    holdInterval = setInterval(() => whileHolding(e), 10)

}

function endHold() {

    clearInterval(holdInterval)
    holdInterval = null

}

document.addEventListener("mousedown", startHold)
document.addEventListener("mouseup", endHold)

document.addEventListener("touchstart", startHold, {
    passive: false
})
document.addEventListener("touchend", endHold)

function update(d = 0) {

    requestAnimationFrame(update)
    renderer.render(scene, camera)
    controls.update()

}
update()

window.addEventListener("resize", ()=> {

    const w = window.innerWidth
    const h = window.innerHeight

    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    
})