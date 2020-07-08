<template>
  <canvas ref="scene" class="scene" />
</template>

<script>
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default {
  mounted() {
    this.initThree()
  },
  methods: {
    initThree() {
      const canvas = this.$refs.scene
      const renderer = new THREE.WebGLRenderer({ canvas })

      const fov = 45
      const aspect = 2 // the canvas default
      const near = 0.1
      const far = 100
      const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
      camera.position.set(0, 0, 5)

      // const controls = new OrbitControls(camera, canvas)
      // controls.target.set(0, 0, 0)
      // controls.update()

      const scene = new THREE.Scene()
      scene.background = new THREE.Color('white')

      // const color = 0xb1e1ff
      // const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
      // const material = new THREE.MeshPhongMaterial({ color })
      // const cube = new THREE.Mesh(geometry, material)
      // scene.add(cube)
      // cube.position.set(0, 0, 0)

      const dotGeometry = new THREE.Geometry()
      dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0))
      const dotMaterial = new THREE.PointsMaterial({
        size: 1,
        sizeAttenuation: false,
        color: 0x000000,
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

      {
        const color = 0xffffff
        const intensity = 1
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(5, 10, 2)
        scene.add(light)
        scene.add(light.target)
      }

      function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
        const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5
        const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5)
        const distance = halfSizeToFitOnScreen / Math.tan(halfFovY)

        const direction = new THREE.Vector3()
          .subVectors(camera.position, boxCenter)
          .multiply(new THREE.Vector3(1, 0, 1))
          .normalize()

        // camera.position.copy(direction.multiplyScalar(distance).add(boxCenter))

        // pick some near and far values for the frustum that
        // will contain the box.
        // camera.near = boxSize / 100
        // camera.far = boxSize * 100

        // camera.updateProjectionMatrix()

        // point the camera to look at the center of the box
        // camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z)
      }

      let moodObj1
      let moodObj2

      {
        const gltfLoader = new GLTFLoader()
        gltfLoader.load('/mood.glb', (gltf) => {
          moodObj1 = gltf
          moodObj1.scene.position.set(-2, 0, 0)

          pivotPoint.add(moodObj1.scene)

          // const box = new THREE.Box3().setFromObject(rootObj.scene)

          // const boxSize = box.getSize(new THREE.Vector3()).length()
          // const boxCenter = box.getCenter(new THREE.Vector3())

          // frameArea(boxSize * 1, boxSize, boxCenter, camera)

          // update the Trackball controls to handle the new size
          // controls.maxDistance = boxSize * 10
          // controls.target.copy(boxCenter)
          // controls.update()
        })

        gltfLoader.load('/mood.glb', (gltf) => {
          moodObj2 = gltf

          // scene.add(moodObj2.scene)

          moodObj2.scene.position.set(2, 0, 0)

          pivotPoint.add(moodObj2.scene)
        })
      }

      // Animation Control

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

      function render(time) {
        time *= 0.001

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement
          camera.aspect = canvas.clientWidth / canvas.clientHeight
          camera.updateProjectionMatrix()
        }

        if (moodObj1 && moodObj2) {
          pivotPoint.rotation.y = time * 0.5
          moodObj1.scene.rotation.y = time * 0.5
          moodObj2.scene.rotation.y = time * 0.5
          // const delta = clock.getDelta()
          // mixer.update(delta)
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
