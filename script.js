import * as THREE from "three"

import { OrbitControls } from "jsm/controls/OrbitControls.js"

import { Sky } from "jsm/Addons.js";

let w = window.innerWidth
let h = window.innerHeight

const renderer = new THREE.WebGLRenderer({ antialias: true})

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
sky.scale.setScalar( 450000 )

const phi = THREE.MathUtils.degToRad(90)
const theta = THREE.MathUtils.degToRad(180)
const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta  * 2)

sky.material.uniforms.sunPosition.value = sunPosition

scene.add(sky)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = .03

renderer.render(scene, camera)

const planeGeometry = new THREE.PlaneGeometry(1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide
})

const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.z = -3
plane.scale.x = 2
plane.scale.y = 15
plane.rotation.x = Math.PI / 2
scene.add(plane)

const boxGeometry = new THREE.BoxGeometry(.25, .25, .25)
const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
})

const box = new THREE.Mesh(boxGeometry, boxMaterial)
box.position.y = .125
box.position.z = 1
scene.add(box)

const light = new THREE.AmbientLight(0x404040)
scene.add(light)

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
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    
})