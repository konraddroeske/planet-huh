<template>
  <div id="sceneContainer" class="sceneContainer">
    <canvas ref="scene" class="scene" />
    <button class="toggle">Toggle</button>
  </div>
</template>

<script>
import * as THREE from 'three'
import SpriteText from 'three-spritetext'
import globeTexture from '@/assets/images/globe.png'

export default {
  data() {
    return {
      toggle: false,
      pauseTime: null,
      cities: [
        [40.71427, -74.00597, 'New York City'],
        [52.52437, 13.41053, 'Berlin'],
        [51.5074, -0.1278, 'London'],
        [30.0444, 31.2357, 'Cairo'],
        [-33.9249, 19.4241, 'Cape Town'], // Slightly off
        [-37.8136, 144.9631, 'Melbourne'],
        [-22.9068, -43.1729, 'Rio De Janeiro'], // Make distance from globe a fn of length of letters?
        [43.6532, -79.3832, 'Toronto'],
        [42.3601, -71.0589, 'Boston'],
      ],
      colors: [
        {
          r: 116,
          g: 155,
          b: 255,
          latitude: 45,
          longitude: 0,
          posts: [
            { title: 'a' },
            { title: 'b' },
            { title: 'c' },
            { title: 'd' },
            { title: 'e' },
            { title: 'f' },
          ],
          name: 'blue',
        },
        {
          r: 255,
          g: 147,
          b: 30,
          latitude: 45,
          longitude: -120,
          posts: [{ title: 'a' }, { title: 'b' }, { title: 'c' }],
          name: 'orange',
        },
        {
          r: 209,
          g: 221,
          b: 188,
          latitude: 45,
          longitude: 120,
          posts: [
            { title: 'a' },
            { title: 'b' },
            { title: 'c' },
            { title: 'd' },
            { title: 'e' },
            { title: 'f' },
          ],
          name: 'green',
        },
        {
          r: 193,
          g: 146,
          b: 224,
          latitude: -45,
          longitude: 60,
          posts: [{ title: 'a' }, { title: 'b' }, { title: 'c' }],
          name: 'magenta',
        },
        {
          r: 255,
          g: 123,
          b: 172,
          latitude: -45,
          longitude: -60,
          posts: [{ title: 'a' }, { title: 'b' }, { title: 'c' }],
          name: 'red',
        },
        {
          r: 255,
          g: 229,
          b: 172,
          latitude: -45,
          longitude: 180,
          posts: [
            { title: 'a' },
            { title: 'b' },
            { title: 'c' },
            { title: 'd' },
            { title: 'e' },
            { title: 'f' },
            { title: 'g' },
            { title: 'h' },
            { title: 'i' },
          ],
          name: 'yellow',
        },
      ],
      currentNav: null,
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
          from: Math.PI / 4,
          to: Math.PI / 4,
        },
        y: {
          // Horizontal from left to right.
          enabled: false,
          from: Math.PI / 4,
          to: Math.PI / 4,
        },
      }

      const rotationSpeed = 0.0035
      const rotationInertia = 0.08

      // horizonal rotation

      let targetRotationXGlobe = 0
      let targetRotationXMood = 0
      let targetRotationOnMouseDownX = 0

      let mouseX = 0
      let mouseXOnMouseDown = 0

      let windowHalfX = window.innerWidth / 2

      let deltaX = 0

      // vertical rotation

      let targetRotationYGlobe = 0
      let targetRotationYMood = 0
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

      const maxZoom = -0.55
      const minZoom = 0
      const zoomInSpeed = 1.05
      let zoomPosition = 0.005
      const zoomOutSpeed = 0.0015

      // RAYCASTER

      const raycaster = new THREE.Raycaster()
      const rayMouse = new THREE.Vector2()
      let currentTarget = null

      const setTarget = (target) => {
        target ? (currentTarget = target) : (currentTarget = null)
      }

      const navRouter = () => {
        if (currentTarget) {
          console.log(currentTarget.name)
        }
      }

      document.addEventListener('click', navRouter)

      // OBJECT CONTROLS
      // https://github.com/albertopiras/threeJS-object-controls

      // MOUSE DESKTOP

      const mouseDown = (e) => {
        isDragging = true
        isThrowing = true

        mouseXOnMouseDown = e.clientX - windowHalfX
        mouseYOnMouseDown = e.clientY - windowHalfY

        if (this.currentNav === pivotGlobe) {
          targetRotationOnMouseDownX = targetRotationXGlobe
          targetRotationOnMouseDownY = targetRotationYGlobe
        }

        if (this.currentNav === pivotMood) {
          targetRotationOnMouseDownX = targetRotationXMood
          targetRotationOnMouseDownY = -targetRotationYMood
        }
      }

      const mouseMove = (e) => {
        // Raycaster
        rayMouse.x = (event.clientX / window.innerWidth) * 2 - 1
        rayMouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        if (isDragging) {
          mouseX = e.clientX - windowHalfX
          mouseY = e.clientY - windowHalfY

          const delta =
            targetRotationOnMouseDownY +
            (mouseY - mouseYOnMouseDown) * rotationSpeed

          if (this.currentNav === pivotGlobe) {
            targetRotationXGlobe =
              targetRotationOnMouseDownX +
              (mouseX - mouseXOnMouseDown) * rotationSpeed

            if (delta <= MAX_ANGLES.x.from * -1) {
              targetRotationYGlobe = MAX_ANGLES.x.from * -1
            } else if (delta >= MAX_ANGLES.x.from) {
              targetRotationYGlobe = MAX_ANGLES.x.from
            } else {
              targetRotationYGlobe =
                targetRotationOnMouseDownY +
                (mouseY - mouseYOnMouseDown) * rotationSpeed
            }
          }

          if (this.currentNav === pivotMood) {
            targetRotationXMood =
              targetRotationOnMouseDownX +
              (mouseX - mouseXOnMouseDown) * rotationSpeed

            if (delta <= MAX_ANGLES.x.from * -1) {
              targetRotationYMood = MAX_ANGLES.x.from
            } else if (delta >= MAX_ANGLES.x.from) {
              targetRotationYMood = MAX_ANGLES.x.from * -1
            } else {
              targetRotationYMood =
                (targetRotationOnMouseDownY +
                  (mouseY - mouseYOnMouseDown) * rotationSpeed) *
                -1
            }
          }
        }
      }

      const mouseUp = (e) => {
        isDragging = false
        zoomPosition = 0.005
      }

      document.addEventListener('mousedown', mouseDown, false)
      document.addEventListener('mousemove', mouseMove, false)
      document.addEventListener('mouseup', mouseUp, false)

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
      pivotCamera.add(camera)
      camera.lookAt(0, 0, -3.2)

      // LIGHTING

      {
        const color = 0xffffff
        const intensity = 0.95
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
      this.currentNav = pivotGlobe

      // GLOBE OBJECT

      let globe
      const loader = new THREE.TextureLoader()

      {
        const texture = loader.load(globeTexture)
        texture.anisotropy = renderer.getMaxAnisotropy()
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        const material = new THREE.MeshPhongMaterial({
          map: texture,
        })
        material.map.minFilter = THREE.LinearFilter
        globe = new THREE.Mesh(geometry, material)
        globe.name = 'globe'
        pivotGlobe.add(globe)
      }

      // MOOD PIVOT

      const pivotMood = new THREE.Object3D()
      pivotMood.position.set(1.2, 0, -2)
      pivotMain.add(pivotMood)

      // MOOD OBJECT

      // functions

      const calcWeight = (moodsArr, index) => {
        function getSum(total, num) {
          return total + Math.round(num)
        }

        const multiplier = 0.4

        const moodsAvg =
          moodsArr.map((mood) => mood.posts.length).reduce(getSum, 0) /
          moodsArr.length

        return moodsArr[index].posts.length - moodsAvg === 0
          ? 1
          : 1 +
              ((moodsArr[index].posts.length - moodsAvg) / moodsAvg) *
                multiplier
      }

      this.colors.forEach((color, index) => {
        // calculate weight
        const weight = calcWeight(this.colors, index)

        // calculate position
        const [x, y, z] = calcPosition(color.latitude, color.longitude, 1)

        this.colors[index] = { ...this.colors[index], weight, x, y, z }

        // add positions
        this.colors[index].positions = []
      })

      const distance = (x1, y1, z1, x2, y2, z2) => {
        const dx = x1 - x2
        const dy = y1 - y2
        const dz = z1 - z2
        return Math.sqrt(dx * dx + dy * dy + dz * dz)
      }

      const calculateColor = (colors, x, y, z) => {
        let total = 0
        const distances = []

        // for all colors
        for (let i = 0; i < colors.length; i += 1) {
          const c = colors[i]
          let d = distance(c.x, c.y, c.z, x, y, z) / colors[i].weight
          distances.push(d)

          d = 1 / d ** 3
          c.d = d
          c.d = d
          total += d
        }

        // find minumum value
        const minDistance = Math.min.apply(null, distances)

        // add position to colors

        if (y >= -0.7 && y <= 0.7) {
          colors[distances.indexOf(minDistance)].positions.push([x, y, z])
        }

        // push coordinates into mood locations object
        let r = 0
        let g = 0
        let b = 0

        for (let i = 0; i < colors.length; i += 1) {
          const c = colors[i]
          const ratio = c.d / total

          r += ratio * c.r
          g += ratio * c.g
          b += ratio * c.b
        }

        r = Math.floor(r)
        g = Math.floor(g)
        b = Math.floor(b)
        return { r, g, b }
      }

      let mood

      {
        const radius = 1
        const geometry = new THREE.SphereBufferGeometry(radius, 64, 64)

        const { count } = geometry.attributes.position
        geometry.setAttribute(
          'color',
          new THREE.BufferAttribute(new Float32Array(count * 3), 3)
        )

        const positions = geometry.attributes.position
        const positionColor = geometry.attributes.color

        for (let i = 0; i < count; i += 1) {
          const calculatedColor = calculateColor(
            this.colors,
            positions.getX(i),
            positions.getY(i),
            positions.getZ(i)
          )

          positionColor.setXYZ(
            i,
            calculatedColor.r / 255,
            calculatedColor.g / 255,
            calculatedColor.b / 255
          )
        }

        const material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          flatShading: true,
          vertexColors: true,
          shininess: 0,
        })

        material.transparent = true
        material.opacity = 0.8

        mood = new THREE.Mesh(geometry, material)
        mood.name = 'mood'
        pivotMood.add(mood)
      }

      // RESIZE

      const resizeRendererToDisplaySize = (renderer) => {
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

      // SLERP PIVOT GLOBE

      const toRadians = (angle) => {
        return angle * (Math.PI / 180)
      }

      const globeRadians = toRadians(0)

      const globeAxis = new THREE.Vector3(
        Math.sin(globeRadians),
        Math.cos(globeRadians),
        0
      ).normalize()

      // TOGGLE OBJECTS

      let timer = 0
      const speed = 4
      const rotateSpeed = Math.PI / speed
      let delta = 0
      const clock = new THREE.Clock()
      clock.autoStart = false

      {
        const toggleAnim = () => {
          if (!clock.running) {
            this.currentNav === pivotGlobe
              ? (this.currentNav = pivotMood)
              : (this.currentNav = pivotGlobe)

            this.toggle = !this.toggle

            this.toggle ? (delta = 0) : (delta = rotateSpeed)

            clock.stop()
            clock.start()
          }
        }

        document.querySelector('.toggle').addEventListener('click', toggleAnim)
      }

      // SET ROTATION AXIS

      globe.geometry.applyMatrix(
        new THREE.Matrix4().makeRotationZ(-globeRadians)
      )

      // CITIES

      const citiesArr = []

      const spriteMapBlue = new THREE.TextureLoader().load(
        '/sprites/mapDot.png'
      )
      const spriteMapWhite = new THREE.TextureLoader().load(
        '/sprites/mapDot2.png'
      )

      const spriteCities = []
      const spriteCitiesMats = []

      const spriteCitiesAlt = []
      const spriteCitiesMatsAlt = []

      const spriteTextArr = []

      function calcPosition(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180)
        const theta = (lon + 180) * (Math.PI / 180)

        const x = -(radius * Math.sin(phi) * Math.cos(theta))
        const z = radius * Math.sin(phi) * Math.sin(theta)
        const y = radius * Math.cos(phi)

        return [x, y, z]
      }

      const addCities = () => {
        this.cities.forEach((city, index) => {
          // City Location
          const position = calcPosition(city[0], city[1], 1.015)

          // Main Object
          citiesArr.push(new THREE.Object3D())
          citiesArr[index].position.set(position[0], position[1], position[2])
          globe.add(citiesArr[index])

          // Main Material for each Sprite
          spriteCitiesMats.push(
            new THREE.SpriteMaterial({ map: spriteMapBlue })
          )
          spriteCitiesMats[index].name = 'Main'
          spriteCitiesMats[index].transparent = true

          // Main Sprite for each City
          spriteCities.push(new THREE.Sprite(spriteCitiesMats[index]))
          spriteCities[index].name = city[2]
          spriteCities[index].scale.set(0.07, 0.07, 1)
          citiesArr[index].add(spriteCities[index])

          // Alt Material for each Sprite
          spriteCitiesMatsAlt.push(
            new THREE.SpriteMaterial({ map: spriteMapWhite })
          )
          spriteCitiesMatsAlt[index].name = 'Alt'
          spriteCitiesMatsAlt[index].transparent = true

          // Alt Sprite for each City
          spriteCitiesAlt.push(new THREE.Sprite(spriteCitiesMatsAlt[index]))
          spriteCitiesAlt[index].name = city[2]
          spriteCitiesAlt[index].scale.set(0.07, 0.07, 1)
          spriteCitiesAlt[index].material.opacity = 0
          citiesArr[index].add(spriteCitiesAlt[index])

          // Sprite Text
          const textPosition = calcPosition(city[0], city[1], 1.06)
          const cityName = new SpriteText(city[2], 0.024, 'black')
          cityName.center = new THREE.Vector2(0.5, 0.5)
          cityName.fontFace = 'Work Sans'
          spriteTextArr.push(cityName)
          spriteTextArr[index].name = city[2]
          globe.add(spriteTextArr[index])
          spriteTextArr[index].material.opacity = 0
          spriteTextArr[index].position.set(
            textPosition[0],
            textPosition[1],
            textPosition[2]
          )
        })

        spriteCities.push(globe)
      }

      addCities()

      // MOODS

      const moodsArr = {}
      const spriteMoods = {}
      const spriteMoodsMats = {}

      this.colors.forEach((color) => {
        moodsArr[color.name] = []
        spriteMoods[color.name] = []
        spriteMoodsMats[color.name] = []
      })

      // const spriteMoodsAlt = []
      // const spriteMoodsMatsAlt = []

      // const spriteTextArrMoods = []

      const spriteMapBlack = new THREE.TextureLoader().load(
        '/sprites/mapDot3.png'
      )

      const getPosition = (positions) => {
        const position = positions[Math.floor(Math.random() * positions.length)]
        // check distance to other moods positions

        return position
      }

      const addMoods = () => {
        this.colors.forEach((color) => {
          color.posts.forEach((post, index) => {
            // Get Position
            const position = getPosition(color.positions)

            // Main Object
            moodsArr[color.name].push(new THREE.Object3D())
            moodsArr[color.name][index].position.set(
              position[0] * 1.015,
              position[1] * 1.015,
              position[2] * 1.015
            )
            mood.add(moodsArr[color.name][index])

            // Main Material for each Sprite
            spriteMoodsMats[color.name].push(
              new THREE.SpriteMaterial({ map: spriteMapWhite })
            )
            spriteMoodsMats[color.name][index].name = 'Main'
            spriteMoodsMats[color.name][index].transparent = true

            // Main Sprite for each City
            spriteMoods[color.name].push(
              new THREE.Sprite(spriteMoodsMats[color.name][index])
            )
            spriteMoods[color.name][index].name = post.title
            spriteMoods[color.name][index].scale.set(0.07, 0.07, 1)
            moodsArr[color.name][index].add(spriteMoods[color.name][index])

            // Alt Material for each Sprite
            // spriteCitiesMatsAlt.push(
            //   new THREE.SpriteMaterial({ map: spriteMapWhite })
            // )
            // spriteMoodsMatsAlt[index].name = 'Alt'
            // spriteMoodsMatsAlt[index].transparent = true

            // Alt Sprite for each City
            // spriteMoodsAlt.push(new THREE.Sprite(spriteMoodsMatsAlt[index]))
            // spriteMoodsAlt[index].name = city[2]
            // spriteMoodsAlt[index].scale.set(0.07, 0.07, 1)
            // spriteMoodsAlt[index].material.opacity = 0
            // moodsArr[index].add(spriteMoodsAlt[index])

            // Sprite Text
            // const textPosition = calcPosition(city[0], city[1], 1.06)
            // const moodsName = new SpriteText(city[2], 0.024, 'black')
            // cityName.center = new THREE.Vector2(0.5, 0.5)
            // cityName.fontFace = 'Work Sans'
            // spriteTextArr.push(cityName)
            // spriteTextArr[index].name = city[2]
            // globe.add(spriteTextArr[index])
            // spriteTextArr[index].material.opacity = 0
            // spriteTextArr[index].position.set(
            //   textPosition[0],
            //   textPosition[1],
            //   textPosition[2]
            // )
          })
        })
      }

      console.log(moodsArr)

      addMoods()

      // GLOW

      // Globe
      const earthGlowMat = new THREE.SpriteMaterial({ map: spriteMapBlue })
      earthGlowMat.transparent = true

      const glowX = 4.5
      const glowY = 4.5

      const earthGlow = new THREE.Sprite(earthGlowMat)
      earthGlow.scale.set(glowX, glowY, 1)
      earthGlow.position.set(0, 0, 0)
      pivotGlobe.add(earthGlow)

      // Mood

      const moodGlow = new THREE.Sprite(earthGlowMat)
      moodGlow.scale.set(glowX, glowY, 1)
      moodGlow.position.set(0, 0, 0)
      pivotMood.add(moodGlow)

      // RENDER

      const render = () => {
        // RESIZE

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement
          camera.aspect = canvas.clientWidth / canvas.clientHeight
          camera.updateProjectionMatrix()
        }

        // TOGGLE OBJECTS

        if (clock.getElapsedTime() <= rotateSpeed) {
          timer = clock.getElapsedTime() + delta
        } else {
          clock.stop()
        }

        // SPRITE RESIZE ON TOGGLE

        // if (clock.running) {
        //   const rate = 0.05

        //   if (this.currentNav === pivotMood && glowX >= 2.8) {
        //     glowX += -rate
        //     glowY += -rate
        //     earthGlow.scale.set(glowX, glowY, 1)
        //   }

        //   if (this.currentNav === pivotGlobe && glowX <= 5) {
        //     glowX += rate
        //     glowY += rate
        //     earthGlow.scale.set(glowX, glowY, 1)
        //   }
        // }

        // RAYCASTER

        raycaster.setFromCamera(rayMouse, camera)
        const intersects = raycaster.intersectObjects(spriteCities)

        if (
          intersects.length >= 2 &&
          intersects[0].object.name !== 'globe' &&
          currentTarget !== intersects[0].object
        ) {
          setTarget(intersects[0].object)
        }

        if (intersects.length < 2 && currentTarget) {
          setTarget(null)
        }

        // HOVER ANIMATIONS

        // globe main sprite

        if (currentTarget && currentTarget.material.opacity >= 0) {
          currentTarget.material.opacity -= 0.03
        }

        spriteCities.forEach((obj) => {
          if (obj !== currentTarget && obj.material.opacity <= 1) {
            obj.material.opacity += 0.03
          }
        })

        // globe alt sprite

        spriteCitiesAlt.forEach((obj, index) => {
          if (currentTarget) {
            if (obj.name === currentTarget.name && obj.material.opacity <= 1) {
              obj.material.opacity += 0.03
            } else if (
              obj.name !== currentTarget.name &&
              obj.material.opacity >= 0
            ) {
              obj.material.opacity -= 0.03
            }
          } else if (obj.material.opacity >= 0) {
            obj.material.opacity -= 0.03
          }
        })

        // text sprite

        spriteTextArr.forEach((obj, index) => {
          if (currentTarget) {
            if (obj.name === currentTarget.name && obj.material.opacity <= 1) {
              obj.material.opacity += 0.02
            } else if (
              obj.name !== currentTarget.name &&
              obj.material.opacity >= 0
            ) {
              obj.material.opacity -= 0.02
            }
          } else if (obj.material.opacity >= 0) {
            obj.material.opacity -= 0.02
          }
        })

        if (pivotMain && mood && globe) {
          pivotMain.rotation.y = timer * speed

          if (this.currentNav === pivotGlobe) {
            // HORIZONAL ROTATION
            deltaX =
              (targetRotationXGlobe - pivotGlobe.rotation.y) * rotationInertia
            pivotGlobe.rotation.y += deltaX

            // VERTICAL ROTATION
            deltaY =
              (targetRotationYGlobe - pivotGlobe.rotation.x) * rotationInertia
            if (isThrowing && checkMaxAngle(pivotGlobe, deltaY, 'x')) {
              pivotGlobe.rotation.x += deltaY
            }
          }

          if (this.currentNav === pivotMood) {
            // HORIZONAL ROTATION
            deltaX =
              (targetRotationXMood - pivotMood.rotation.y) * rotationInertia
            pivotMood.rotation.y += deltaX

            // VERTICAL ROTATION
            deltaY =
              (targetRotationYMood - pivotMood.rotation.x) * rotationInertia
            if (isThrowing && checkMaxAngle(pivotMood, deltaY, 'x')) {
              pivotMood.rotation.x += deltaY
            }
          }

          // CAMERA ZOOM (Both)

          if (isDragging && !currentTarget) {
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

            // OBJECT CORRECTION LERP

            if (!isThrowing) {
              targetRotationYGlobe = pivotGlobe.rotation.x
              targetRotationYMood = pivotMood.rotation.x

              if (pivotGlobe.rotation.x > 0.01) {
                pivotGlobe.rotation.x += -0.0015
              } else if (pivotGlobe.rotation.x < -0.01) {
                pivotGlobe.rotation.x += 0.0015
              }

              if (pivotMood.rotation.x > 0.01) {
                pivotMood.rotation.x += -0.0015
              } else if (pivotMood.rotation.x < -0.01) {
                pivotMood.rotation.x += 0.0015
              }
            }

            // CONTINUOUS ROTATION (Both)
            globe.rotateOnAxis(globeAxis, 0.0015)
            mood.rotateOnAxis(globeAxis, 0.0015)
            // mood.scene.rotation.y += 0.0015
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
