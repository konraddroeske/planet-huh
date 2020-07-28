<template>
  <div id="sceneContainer" class="sceneContainer">
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
      // ANIMATE OBJECT CONTROLS

      let isDragging = false
      let isThrowing = false

      const MAX_ANGLES = {
        x: {
          // Vertical from bottom to top.
          enabled: true,
          from: Math.PI / 3,
          to: Math.PI / 3,
        },
        y: {
          // Horizontal from left to right.
          enabled: false,
          from: Math.PI / 3,
          to: Math.PI / 3,
        },
      }

      const rotationSpeed = 0.0035
      const rotationInertia = 0.08

      // horizonal rotation

      let targetRotationX = 0
      let targetRotationOnMouseDownX = 0

      let mouseX = 0
      let mouseXOnMouseDown = 0

      let windowHalfX = window.innerWidth / 2

      let deltaX = 0

      // vertical rotation

      let targetRotationY = 0
      let targetRotationOnMouseDownY = 0

      let mouseY = 0
      let mouseYOnMouseDown = 0

      let windowHalfY = window.innerWidth / 2

      let deltaY = 0

      const checkMaxAngle = (obj, delta, axe) => {
        const condition =
          MAX_ANGLES[axe].from * -1 < obj.rotation[axe] + delta &&
          obj.rotation[axe] + delta < MAX_ANGLES[axe].to

        return condition
      }

      // camera zoom

      const maxZoom = -0.4
      const minZoom = 0
      const zoomInSpeed = 1.05
      let zoomPosition = 0.005
      const zoomOutSpeed = 0.0015

      // RAYCASTER

      const raycaster = new THREE.Raycaster()
      const rayMouse = new THREE.Vector2()
      let currentCity = null

      const navRouter = () => {
        if (currentCity) {
          console.log(currentCity)
        }
      }

      document.addEventListener('click', navRouter)

      // OBJECT CONTROLS

      THREE.ObjectControls = function (camera, domElement, objectToMove) {
        let mesh = objectToMove
        domElement = domElement !== undefined ? domElement : document

        this.setObjectToMove = function (newMesh) {
          mesh = newMesh
        }

        this.setDistance = function (min, max) {
          minDistance = min
          maxDistance = max
        }

        this.setZoomSpeed = function (newZoomSpeed) {
          zoomSpeed = newZoomSpeed
        }

        // this.setRotationSpeed = function (newRotationSpeed) {
        //   rotationSpeed = newRotationSpeed
        // }

        this.setRotationSpeedTouchDevices = function (newRotationSpeed) {
          rotationSpeedTouchDevices = newRotationSpeed
        }

        this.enableVerticalRotation = function () {
          verticalRotationEnabled = true
        }

        this.disableVerticalRotation = function () {
          verticalRotationEnabled = false
        }

        this.enableHorizontalRotation = function () {
          horizontalRotationEnabled = true
        }

        this.disableHorizontalRotation = function () {
          horizontalRotationEnabled = false
        }

        this.setMaxVerticalRotationAngle = function (min, max) {
          MAX_ROTATON_ANGLES.x.from = min
          MAX_ROTATON_ANGLES.x.to = max
          MAX_ROTATON_ANGLES.x.enabled = true
        }

        this.setMaxHorizontalRotationAngle = function (min, max) {
          MAX_ROTATON_ANGLES.y.from = min
          MAX_ROTATON_ANGLES.y.to = max
          MAX_ROTATON_ANGLES.y.enabled = true
        }

        this.disableMaxHorizontalAngleRotation = function () {
          MAX_ROTATON_ANGLES.y.enabled = false
        }

        this.disableMaxVerticalAngleRotation = function () {
          MAX_ROTATON_ANGLES.x.enabled = false
        }

        /** Mouse Interaction Controls (rotate & zoom, desktop **/
        // Mouse - move
        domElement.addEventListener('mousedown', mouseDown, false)
        domElement.addEventListener('mousemove', mouseMove, false)
        domElement.addEventListener('mouseup', mouseUp, false)

        /** Touch Interaction Controls (rotate & zoom, mobile) **/
        // Touch - move
        domElement.addEventListener('touchstart', onTouchStart, false)
        domElement.addEventListener('touchmove', onTouchMove, false)
        domElement.addEventListener('touchend', onTouchEnd, false)

        // Control Variables

        const MAX_ROTATON_ANGLES = {
          x: {
            // Vertical from bottom to top.
            enabled: false,
            from: Math.PI / 8,
            to: Math.PI / 8,
          },
          y: {
            // Horizontal from left to right.
            enabled: false,
            from: Math.PI / 4,
            to: Math.PI / 4,
          },
        }

        /**
         * RotationSpeed
         * 1= fast
         * 0.01 = slow
         * */
        let maxDistance = 15
        let minDistance = 6
        let zoomSpeed = 0.5

        let rotationSpeedTouchDevices = 0.05
        let verticalRotationEnabled = false
        let horizontalRotationEnabled = true

        const mouseFlags = { MOUSEDOWN: 0, MOUSEMOVE: 1 }

        let flag
        let previousMousePosition = { x: 0, y: 0 }

        /**
         * CurrentTouches
         * length 0 : no zoom
         * length 2 : is zoomming
         */
        let currentTouches = []

        const prevZoomDiff = { X: null, Y: null }

        // SHARED FUNCTIONS

        function zoomIn() {
          camera.position.z -= zoomSpeed
        }

        function zoomOut() {
          camera.position.z += zoomSpeed
        }

        function isWithinMaxAngle(delta, axe) {
          if (MAX_ROTATON_ANGLES[axe].enabled) {
            const condition =
              MAX_ROTATON_ANGLES[axe].from * -1 < mesh.rotation[axe] + delta &&
              mesh.rotation[axe] + delta < MAX_ROTATON_ANGLES[axe].to

            return condition
          }
          return true
        }

        function resetMousePosition() {
          previousMousePosition = { x: 0, y: 0 }
        }

        // MOUSE DESKTOP

        function mouseDown(e) {
          isDragging = true
          isThrowing = true
          flag = mouseFlags.MOUSEDOWN

          mouseXOnMouseDown = e.clientX - windowHalfX
          targetRotationOnMouseDownX = targetRotationX

          mouseYOnMouseDown = e.clientY - windowHalfY
          targetRotationOnMouseDownY = targetRotationY
        }

        function mouseMove(e) {
          // Raycaster

          rayMouse.x = (event.clientX / window.innerWidth) * 2 - 1
          rayMouse.y = -(event.clientY / window.innerHeight) * 2 + 1

          if (isDragging) {
            mouseX = e.clientX - windowHalfX

            targetRotationX =
              targetRotationOnMouseDownX +
              (mouseX - mouseXOnMouseDown) * rotationSpeed

            mouseY = e.clientY - windowHalfY

            const delta =
              targetRotationOnMouseDownY +
              (mouseY - mouseYOnMouseDown) * rotationSpeed

            if (delta <= MAX_ANGLES.x.from * -1) {
              targetRotationY = MAX_ANGLES.x.from * -1
            } else if (delta >= MAX_ANGLES.x.from) {
              targetRotationY = MAX_ANGLES.x.from
            } else {
              targetRotationY =
                targetRotationOnMouseDownY +
                (mouseY - mouseYOnMouseDown) * rotationSpeed
            }
          }
        }

        function mouseUp(e) {
          isDragging = false
          zoomPosition = 0.005
          resetMousePosition()
        }

        // TOUCH INTERACTION

        function onTouchStart(e) {
          e.preventDefault()
          flag = mouseFlags.MOUSEDOWN
          if (e.touches.length === 2) {
            prevZoomDiff.X = Math.abs(
              e.touches[0].clientX - e.touches[1].clientX
            )
            prevZoomDiff.Y = Math.abs(
              e.touches[0].clientY - e.touches[1].clientY
            )
            currentTouches = new Array(2)
          } else {
            previousMousePosition = {
              x: e.touches[0].pageX,
              y: e.touches[0].pageY,
            }
          }
        }

        function onTouchEnd(e) {
          prevZoomDiff.X = null
          prevZoomDiff.Y = null

          /* If you were zooming out, currentTouches is updated for each finger you
           * leave up the screen so each time a finger leaves up the screen,
           * currentTouches length is decreased of a unit. When you leave up both 2
           * fingers, currentTouches.length is 0, this means the zoomming phase is
           * ended.
           */
          if (currentTouches.length > 0) {
            currentTouches.pop()
          } else {
            currentTouches = []
          }
          e.preventDefault()
          if (flag === mouseFlags.MOUSEDOWN) {
            // TouchClick
            // You can invoke more other functions for animations and so on...
          } else if (flag === mouseFlags.MOUSEMOVE) {
            // Touch drag
            // You can invoke more other functions for animations and so on...
          }
          resetMousePosition()
        }

        function onTouchMove(e) {
          e.preventDefault()
          flag = mouseFlags.MOUSEMOVE
          // Touch zoom.
          // If two pointers are down, check for pinch gestures.
          if (e.touches.length === 2) {
            currentTouches = new Array(2)
            // Calculate the distance between the two pointers.
            const curDiffX = Math.abs(
              e.touches[0].clientX - e.touches[1].clientX
            )
            const curDiffY = Math.abs(
              e.touches[0].clientY - e.touches[1].clientY
            )

            if (prevZoomDiff && prevZoomDiff.X > 0 && prevZoomDiff.Y > 0) {
              if (
                curDiffX > prevZoomDiff.X &&
                curDiffY > prevZoomDiff.Y &&
                camera.position.z > minDistance
              ) {
                zoomIn()
              } else if (
                curDiffX < prevZoomDiff.X &&
                camera.position.z < maxDistance &&
                curDiffY < prevZoomDiff.Y
              ) {
                zoomOut()
              }
            }
            // Cache the distance for the next move event.
            prevZoomDiff.X = curDiffX
            prevZoomDiff.Y = curDiffY

            // Touch Rotate.
          } else if (currentTouches.length === 0) {
            prevZoomDiff.X = null
            prevZoomDiff.Y = null
            const deltaMove = {
              x: e.touches[0].pageX - previousMousePosition.x,
              y: e.touches[0].pageY - previousMousePosition.y,
            }
            previousMousePosition = {
              x: e.touches[0].pageX,
              y: e.touches[0].pageY,
            }

            if (horizontalRotationEnabled && deltaMove.x !== 0) {
              if (
                !isWithinMaxAngle(
                  Math.sign(deltaMove.x) * rotationSpeedTouchDevices,
                  'y'
                )
              )
                return
              mesh.rotation.y +=
                Math.sign(deltaMove.x) * rotationSpeedTouchDevices
            }

            if (verticalRotationEnabled && deltaMove.y !== 0) {
              if (
                !isWithinMaxAngle(
                  Math.sign(deltaMove.y) * rotationSpeedTouchDevices,
                  'x'
                )
              )
                return
              mesh.rotation.x +=
                Math.sign(deltaMove.y) * rotationSpeedTouchDevices
            }
          }
        }
      }

      // INITIALIZE CANVAS

      const canvas = this.$refs.scene
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })

      const scene = new THREE.Scene()
      scene.background = new THREE.Color('white')

      // CAMERA PIVOT

      const pivotCamera = new THREE.Object3D()
      pivotCamera.position.set(0, 0, 3.2)
      scene.add(pivotCamera)

      // CAMERA

      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100)
      // camera.position.set(4.5, 0, -2)
      // camera.lookAt(0, 0, 1.5)

      pivotCamera.add(camera)
      camera.lookAt(0, 0, -3.2)

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

      // GLOBE PARENT

      const parentGlobe = new THREE.Object3D()
      parentGlobe.position.set(-1.2, 0, 2)
      pivotMain.add(parentGlobe)

      // GLOBE PIVOT

      const pivotGlobe = new THREE.Object3D()
      pivotGlobe.position.set(0, 0, 0)
      parentGlobe.add(pivotGlobe)

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
        globe.name = 'globe'
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
        windowHalfY = window.innerHeight / 2

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

      const globeRadians = toRadians(0)

      const globeAxis = new THREE.Vector3(
        Math.sin(globeRadians),
        Math.cos(globeRadians),
        0
      ).normalize()

      // CLICK AND DRAG GLOBE

      const objectControls = new THREE.ObjectControls(
        camera,
        document,
        pivotGlobe
      )

      // objectControls.setDistance(8, 200) // set min - max distance for zoom
      // objectControls.setZoomSpeed(0.5) // set zoom speed
      // objectControls.enableVerticalRotation()
      // objectControls.setMaxVerticalRotationAngle(Math.PI / 4, Math.PI / 4)
      // objectControls.setRotationSpeed(0.02)

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

      // CITIES

      const spriteMap = new THREE.TextureLoader().load('/sprites/mapDot.png')
      const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap })
      const raycastArr = []

      function calcPosition(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lon + 180) * (Math.PI / 180)

        const x = -(radius * Math.sin(phi) * Math.cos(theta))
        const z = radius * Math.sin(phi) * Math.sin(theta)
        const y = radius * Math.cos(phi)

        return [x, y, z]
      }

      const cities = [
        [40.71427, -74.00597, 'New York City'],
        [52.52437, 13.41053, 'Berlin'],
        [51.5074, 0.1278, 'London'],
      ]

      function addPoints() {
        cities.forEach((city, index) => {
          raycastArr.push(new THREE.Sprite(spriteMaterial))
          const position = calcPosition(city[0], city[1], 1.015)
          raycastArr[index].name = city[2]
          raycastArr[index].scale.set(0.1, 0.1, 1)
          raycastArr[index].position.set(position[0], position[1], position[2])
          globe.add(raycastArr[index])
        })
      }

      addPoints()

      function setCity(city) {
        currentCity = city
      }

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

        // RAYCASTER

        raycaster.setFromCamera(rayMouse, camera)
        const intersects = raycaster.intersectObjects(pivotGlobe.children, true)

        if (
          intersects.length >= 2 &&
          intersects[0].object.name !== 'globe' &&
          currentCity !== intersects[0].object.name
        ) {
          setCity(intersects[0].object.name)
        }

        if (intersects.length < 2 && currentCity) {
          setCity(null)
        }

        if (moodObj1 && globe) {
          pivotMain.rotation.y = timer * speed

          // HORIZONAL ROTATION

          deltaX = (targetRotationX - pivotGlobe.rotation.y) * rotationInertia
          pivotGlobe.rotation.y += deltaX

          // VERTICAL ROTATION

          deltaY = (targetRotationY - pivotGlobe.rotation.x) * rotationInertia
          if (isThrowing && checkMaxAngle(pivotGlobe, deltaY, 'x')) {
            pivotGlobe.rotation.x += deltaY
          }

          // CAMERA ZOOM

          if (isDragging && !currentCity) {
            if (camera.position.z >= maxZoom) {
              zoomPosition *= zoomInSpeed
              camera.position.z -= zoomPosition
            }
          }

          if (!isDragging) {
            if (camera.position.z <= minZoom) {
              camera.position.z += zoomOutSpeed
            }

            if (Math.abs(deltaX) < 0.005 && Math.abs(deltaY) < 0.005) {
              isThrowing = false
            }

            // GLOBE CORRECTION LERP

            if (!isThrowing) {
              targetRotationY = pivotGlobe.rotation.x

              if (pivotGlobe.rotation.x > 0.01) {
                pivotGlobe.rotation.x += -0.0015
              } else if (pivotGlobe.rotation.x < -0.01) {
                pivotGlobe.rotation.x += 0.0015
              }
            }

            // GLOBE CONTINUOUS ROTATION
            globe.rotateOnAxis(globeAxis, 0.0015)
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

.sceneContainer {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  cursor: grab;
}

.scene {
  width: 100%;
  height: 100vh;
  display: block;
  pointer-events: none;
}
</style>
