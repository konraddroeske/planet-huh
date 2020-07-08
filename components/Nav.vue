<template>
  <canvas ref="scene" class="scene" />
</template>

<script>
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

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
      const renderer = new THREE.WebGLRenderer({ canvas })
      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100)
      camera.position.set(0, 0, 5)

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
        const skyColor = 0xb1e1ff // light blue
        const groundColor = 0xb97a20 // brownish orange
        const intensity = 1
        const light = new THREE.HemisphereLight(
          skyColor,
          groundColor,
          intensity
        )
        scene.add(light)
      }

      // {
      //   const color = 0xffffff
      //   const intensity = 1
      //   const light = new THREE.DirectionalLight(color, intensity)
      //   light.position.set(5, 10, 2)
      //   scene.add(light)
      //   scene.add(light.target)
      // }

      let moodObj1
      let moodObj2

      {
        const gltfLoader = new GLTFLoader()
        gltfLoader.load('/mood.glb', (gltf) => {
          moodObj1 = gltf
          moodObj1.scene.position.set(-2, 0, 0)
          pivotPoint.add(moodObj1.scene)
        })

        gltfLoader.load('/globe.glb', (gltf) => {
          moodObj2 = gltf
          moodObj2.scene.position.set(2, 0, 0)
          pivotPoint.add(moodObj2.scene)
        })
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

      let timer = 0
      const speed = 3.5
      let delta = 0
      const clock = new THREE.Clock()
      clock.autoStart = false

      const toggleAnim = () => {
        if (!clock.running) {
          this.toggle = !this.toggle

          this.toggle ? (delta = 0) : (delta = Math.PI / speed)

          clock.stop()
          clock.start()
        }
      }

      document.addEventListener('click', toggleAnim)

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

        if (moodObj1 && moodObj2) {
          pivotPoint.rotation.y = timer * speed
          moodObj1.scene.rotation.y = time
          moodObj2.scene.rotation.y = time
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
.scene {
  width: 100%;
  height: 100%;
}
</style>
