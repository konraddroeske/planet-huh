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
      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100)
      camera.position.set(4.5, 0, -2)
      camera.lookAt(0, 0, 1.5)

      // const controls = new OrbitControls(camera, canvas)
      // controls.target.set(0, 5, 0)
      // controls.update()

      const scene = new THREE.Scene()
      scene.background = new THREE.Color('white')

      const dotGeometry = new THREE.Geometry()
      dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0))
      const dotMaterial = new THREE.PointsMaterial({
        size: 1,
        sizeAttenuation: false,
        opacity: 0,
        transparent: true,
      })
      const pivotPoint = new THREE.Points(dotGeometry, dotMaterial)
      scene.add(pivotPoint)

      {
        const color = 0xffffff
        const intensity = 0.9
        const light = new THREE.AmbientLight(color, intensity)
        scene.add(light)
      }

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
        globe.position.set(2, 0, 0)
        pivotPoint.add(globe)
      }

      let moodObj1
      // let moodObj2

      {
        const gltfLoader = new GLTFLoader()
        gltfLoader.load('/mood.glb', (gltf) => {
          moodObj1 = gltf
          moodObj1.scene.position.set(-2, 0, 0)
          pivotPoint.add(moodObj1.scene)

          const box = new THREE.Box3().setFromObject(moodObj1.scene)

          const boxSize = box.getSize(new THREE.Vector3()).length()
          const boxCenter = box.getCenter(new THREE.Vector3())

          // update the Trackball controls to handle the new size
          // controls.maxDistance = boxSize * 10
          // controls.target.copy(boxCenter)
          // controls.update()
        })

        // gltfLoader.load('/globe.glb', (gltf) => {
        //   moodObj2 = gltf
        //   moodObj2.scene.position.set(2, 0, 0)
        //   pivotPoint.add(moodObj2.scene)
        // })
      }

      function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        const needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
          renderer.setSize(width, height, false)
        }
        return needResize
      }

      // Spin Planet

      {
        let isDragging = false
        const container = document.querySelector('#sceneContainer')

        container.addEventListener('mouseDown', function (e) {
          isDragging = true
        })

        container.addEventListener('mousemove', function (e) {
          if (isDragging === true) {
          }
        })
      }

      // Switch Planet

      let timer = 0
      const speed = 6
      let delta = 0
      const clock = new THREE.Clock()
      clock.autoStart = false

      {
        const toggleAnim = () => {
          if (!clock.running) {
            this.toggle = !this.toggle

            this.toggle ? (delta = 0) : (delta = Math.PI / speed)

            clock.stop()
            clock.start()
          }
        }

        document.querySelector('.toggle').addEventListener('click', toggleAnim)
      }

      const render = (time) => {
        time *= 0.0001

        if (clock.getElapsedTime() <= Math.PI / speed) {
          timer = clock.getElapsedTime() + delta
        } else {
          clock.stop()
        }

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement
          camera.aspect = canvas.clientWidth / canvas.clientHeight
          camera.updateProjectionMatrix()
        }

        if (moodObj1 && globe) {
          pivotPoint.rotation.y = timer * speed
          moodObj1.scene.rotation.y = time
          // moodObj2.scene.rotation.y = time
          globe.rotation.y = time
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
}
</style>
