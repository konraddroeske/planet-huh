<template>
  <div id="sceneContainer" class="container">
    <canvas ref="scene" class="scene" />
    <button class="toggle">Toggle</button>
  </div>
</template>

<script>
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import globeTexture from '@/assets/images/globe5.png'

export default {
  data() {
    return {
      toggle: false,
      pauseTime: null,
    }
  },
  mounted() {
    this.initThree()
  },
  methods: {
    initThree() {
      const canvas = this.$refs.scene
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })

      const scene = new THREE.Scene()
      scene.background = new THREE.Color('white')

      // CAMERA PIVOT

      const pivotCamera = new THREE.Object3D()
      pivotCamera.position.set(0, 0, 3)
      scene.add(pivotCamera)

      // CAMERA

      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100)
      pivotCamera.add(camera)
      camera.lookAt(0, 0, -3)
      const globeRadians = (0 * Math.PI) / 180

      // const controls = new OrbitControls(camera, canvas)
      // controls.target.set(0, 5, 0)
      // controls.update()

      // LIGHTING

      {
        const color = 0xffffff
        const intensity = 0.9
        const light = new THREE.AmbientLight(color, intensity)
        scene.add(light)
      }

      // MAIN PIVOT

      const pivotMain = new THREE.Object3D()
      pivotMain.position.set(1.2, 0, -2)
      scene.add(pivotMain)

      // GLOBE PIVOT

      const pivotGlobe = new THREE.Object3D()
      pivotGlobe.position.set(-1.2, 0, 2)
      pivotMain.add(pivotGlobe)

      // GLOBE OBJECT

      let globe
      const loader = new THREE.TextureLoader()
      const texture = loader.load(globeTexture)
      texture.anisotropy = renderer.getMaxAnisotropy()

      {
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        const material = new THREE.MeshPhongMaterial({
          map: texture,
        })
        material.map.minFilter = THREE.LinearFilter
        globe = new THREE.Mesh(geometry, material)
        pivotGlobe.add(globe)
      }

      // MOOD OBJECT

      let moodObj1

      {
        const gltfLoader = new GLTFLoader()
        gltfLoader.load('/mood.glb', (gltf) => {
          moodObj1 = gltf
          moodObj1.scene.position.set(1.2, 0, -2)
          pivotMain.add(moodObj1.scene)

          const box = new THREE.Box3().setFromObject(moodObj1.scene)

          const boxSize = box.getSize(new THREE.Vector3()).length()
          const boxCenter = box.getCenter(new THREE.Vector3())

          // update the Trackball controls to handle the new size
          // controls.maxDistance = boxSize * 10
          // controls.target.copy(boxCenter)
          // controls.update()
        })
      }

      // RESIZE

      function resizeRendererToDisplaySize(renderer) {
        windowHalfX = window.innerWidth / 2
        const canvas = renderer.domElement
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        const needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
          renderer.setSize(width, height, false)
        }
        return needResize
      }

      // EULER QUATERNIAN

      function toRadians(angle) {
        return angle * (Math.PI / 180)
      }

      // SLERP PIVOT GLOBE

      let newAngle = 0

      const pivotGlobeRadians = (90 * Math.PI) / 180
      const pivotGlobeAxis = new THREE.Vector3(
        Math.sin(pivotGlobeRadians),
        Math.cos(pivotGlobeRadians),
        0
      ).normalize()

      const startQuaternion = new THREE.Quaternion().setFromAxisAngle(
        pivotGlobeAxis,
        0
      )

      let endQuaternion = new THREE.Quaternion().setFromAxisAngle(
        pivotGlobeAxis,
        newAngle
      )

      // CLICK AND DRAG GLOBE

      let isDragging = false

      const vectorPivot = new THREE.Vector3(
        Math.sin(pivotGlobeRadians),
        Math.cos(pivotGlobeRadians),
        0
      ).normalize()

      const vectorGlobe = new THREE.Vector3(
        Math.sin(globeRadians),
        Math.cos(globeRadians),
        0
      ).normalize()

      const deltaPivotQuaternion = new THREE.Quaternion().setFromAxisAngle(
        vectorPivot,
        0
      )

      const deltaGlobeQuaternion = new THREE.Quaternion().setFromAxisAngle(
        vectorGlobe,
        0
      )

      let targetRotation = 0
      let targetRotationOnMouseDown = 0
      let mouseX = 0
      let mouseXOnMouseDown = 0
      let windowHalfX = window.innerWidth / 2
      let inertia = 0

      let deltaMove = {
        x: 0,
        y: 0,
      }

      let previousMousePosition = {
        x: 0,
        y: 0,
      }

      const container = document.querySelector('#sceneContainer')

      const resetMouse = () => {
        deltaMove.x = 0
        deltaMove.y = 0
        previousMousePosition.x = 0
        previousMousePosition.y = 0
      }

      container.addEventListener('mousedown', function (e) {
        event.preventDefault()
        resetMouse()

        isDragging = true
        container.addEventListener('mousemove', onDocumentMouseMove, false)
        container.addEventListener('mouseup', onDocumentMouseUp, false)
        container.addEventListener('mouseout', onDocumentMouseOut, false)

        mouseXOnMouseDown = event.clientX - windowHalfX
        targetRotationOnMouseDown = targetRotation
        inertia = targetRotation
      })

      function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX

        targetRotation =
          targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02

        if (Math.abs(event.clientX - previousMousePosition.x) < 30) {
          deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
          }
        }

        previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        }
      }

      function onDocumentMouseUp() {
        setDragEnd()
        container.removeEventListener('mousemove', onDocumentMouseMove, false)
        container.removeEventListener('mouseup', onDocumentMouseUp, false)
        container.removeEventListener('mouseout', onDocumentMouseOut, false)
      }

      function onDocumentMouseOut() {
        setDragEnd()
        container.removeEventListener('mousemove', onDocumentMouseMove, false)
        container.removeEventListener('mouseup', onDocumentMouseUp, false)
        container.removeEventListener('mouseout', onDocumentMouseOut, false)
      }

      function setDragEnd() {
        isDragging = false

        newAngle =
          pivotGlobe.rotation.y > 0
            ? startQuaternion.angleTo(pivotGlobe.quaternion)
            : startQuaternion.angleTo(pivotGlobe.quaternion) * -1

        endQuaternion = new THREE.Quaternion().setFromAxisAngle(
          pivotGlobeAxis,
          newAngle
        )
      }

      // SWITCH OBJECTS

      let timer = 0
      const speed = 4
      const rotateSpeed = Math.PI / speed
      let delta = 0
      const clock = new THREE.Clock()
      clock.autoStart = false

      {
        const toggleAnim = () => {
          if (!clock.running) {
            this.toggle = !this.toggle

            this.toggle ? (delta = 0) : (delta = rotateSpeed)

            clock.stop()
            clock.start()
          }
        }

        document.querySelector('.toggle').addEventListener('click', toggleAnim)
      }

      // SET GLOBE AXIS

      globe.geometry.applyMatrix(
        new THREE.Matrix4().makeRotationZ(-globeRadians)
      )

      // const globeAxis = new THREE.Vector3(
      //   Math.sin(globeRadians),
      //   Math.cos(globeRadians),
      //   0
      // ).normalize()

      // const globeQuaternion = new THREE.Quaternion().setFromAxisAngle(
      //   globeAxis,
      //   0.4
      // )

      // RENDER

      const render = (time) => {
        time *= 0.0001

        if (clock.getElapsedTime() <= rotateSpeed) {
          timer = clock.getElapsedTime() + delta
        } else {
          clock.stop()
        }

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement
          camera.aspect = canvas.clientWidth / canvas.clientHeight
          camera.updateProjectionMatrix()
        }

        if (isDragging) {
          inertia =
            Math.sqrt(Math.pow(deltaMove.x, 2) + Math.pow(deltaMove.y, 2)) / 3
        }

        if (Math.abs(inertia) >= 0.1) {
          inertia = inertia - targetRotation * 0.01

          targetRotation = inertia
        }

        if (Math.abs(inertia) < 0.1) {
          inertia = 0
        }

        // console.log(
        //   pivotGlobe.quaternion.angleTo(northPole),
        //   pivotGlobe.quaternion.angleTo(southPole)
        // )

        if (moodObj1 && globe) {
          pivotMain.rotation.y = timer * speed

          const pivotMatrix = new THREE.Vector3(
            Math.sin(pivotGlobeRadians) * deltaMove.y,
            Math.cos(pivotGlobeRadians) * deltaMove.y,
            0
          ).normalize()

          const globeMatrix = new THREE.Vector3(
            Math.sin(globeRadians) * deltaMove.x,
            Math.cos(globeRadians) * deltaMove.x,
            0
          ).normalize()

          deltaPivotQuaternion.setFromAxisAngle(
            pivotMatrix,
            Math.abs(inertia) * 0.0035
          )

          deltaGlobeQuaternion.setFromAxisAngle(
            globeMatrix,
            Math.abs(inertia) * 0.005
          )

          pivotGlobe.quaternion
            .multiplyQuaternions(deltaPivotQuaternion, pivotGlobe.quaternion)
            .normalize()

          globe.quaternion
            .multiplyQuaternions(deltaGlobeQuaternion, globe.quaternion)
            .normalize()

          if (!isDragging) {
            // globe.rotateOnAxis(globeAxis, 0.003) // axis must be normalized
            // pivotGlobe.quaternion.slerp(endQuaternion, 0.01)
          }
        }
        renderer.render(scene, camera)

        requestAnimationFrame(render)
      }

      requestAnimationFrame(render)
    },
  },
}
</script>

<style lang="scss" scoped>
.toggle {
  position: absolute;
  top: 50%;
  left: 2rem;
  transform: translateY(-50%);
  border: 1px solid var(--tertiary-background-color);
  padding: 10px 15px;
  border-radius: 25px;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
}

.scene {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
</style>
