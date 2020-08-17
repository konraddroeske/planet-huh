<template>
  <div class="navContainer">
    <h1 class="welcome">Welcome To Planet Huh</h1>
    <div id="sceneContainer" ref="sceneContainer" class="sceneContainer">
      <canvas ref="scene" class="scene" />
    </div>
    <div class="toggleContainer">
      <NavToggle />
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import gsap from 'gsap'
import globeTexture from '@/assets/images/globe.png'
import NavToggle from '@/components/NavToggle'

export default {
  components: {
    NavToggle,
  },
  data() {
    return {
      toggle: false,
      cities: [
        [40.71427, -74.00597, 'New York City'],
        [52.52437, 13.41053, 'Berlin'],
        [51.5074, -0.1278, 'London'],
        [30.0444, 31.2357, 'Cairo'],
        [-33.9249, 19.4241, 'Cape Town'],
        [-37.8136, 144.9631, 'Melbourne'],
        [-22.9068, -43.1729, 'Rio De Janeiro'],
        [43.6532, -79.3832, 'Toronto'],
        [42.3601, -71.0589, 'Boston'],
      ],
      colors: [
        {
          r: 116,
          g: 155,
          b: 255,
          latitude: 30,
          longitude: 0,
          posts: [
            { title: 'blue0' },
            { title: 'blue1' },
            { title: 'blue2' },
            { title: 'blue3' },
            { title: 'blue4' },
            { title: 'blue5' },
          ],
          name: 'blue',
        },
        {
          r: 255,
          g: 147,
          b: 30,
          latitude: 30,
          longitude: -120,
          posts: [
            { title: 'orange1' },
            { title: 'orange2' },
            { title: 'orange3' },
          ],
          name: 'orange',
        },
        {
          r: 209,
          g: 221,
          b: 188,
          latitude: 30,
          longitude: 120,
          posts: [
            { title: 'green0' },
            { title: 'green1' },
            { title: 'green2' },
            { title: 'green3' },
            { title: 'green4' },
            { title: 'green5' },
          ],
          name: 'green',
        },
        {
          r: 193,
          g: 146,
          b: 224,
          latitude: -30,
          longitude: 60,
          posts: [
            { title: 'magenta0' },
            { title: 'magenta1' },
            { title: 'magenta2' },
          ],
          name: 'magenta',
        },
        {
          r: 255,
          g: 123,
          b: 172,
          latitude: -30,
          longitude: -60,
          posts: [{ title: 'red0' }, { title: 'red1' }, { title: 'red2' }],
          name: 'red',
        },
        {
          r: 255,
          g: 229,
          b: 172,
          latitude: -30,
          longitude: 180,
          posts: [
            { title: 'yellow0' },
            { title: 'yellow1' },
            { title: 'yellow2' },
            { title: 'yellow3' },
            { title: 'yellow4' },
            { title: 'yellow5' },
            { title: 'yellow6' },
            { title: 'yellow7' },
            { title: 'yellow8' },
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
      // CHECK DEVICE

      const isMobile = this.$device.isMobile

      const sceneContainer = document.querySelector('#sceneContainer')

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

      const rotationSpeed = isMobile ? 0.0055 : 0.0035
      const rotationInertia = isMobile ? 0.09 : 0.08

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

      const maxZoom = isMobile ? -2.2 : -0.5
      const minZoom = 0
      const zoomInSpeed = 1.05
      let zoomPosition = 0.005
      const zoomOutSpeed = 0.0015

      // RAYCASTER

      const raycaster = new THREE.Raycaster()
      const rayMouse = new THREE.Vector2()
      let currentTarget = null
      let intersects = null

      const raycasterTitle = new THREE.Raycaster()

      const setTarget = (target) => {
        target ? (currentTarget = target) : (currentTarget = null)

        if (currentTarget && isMobile) {
          sceneContainer.addEventListener('touchstart', navRouterMobile, false)
        }

        if (!currentTarget && isMobile) {
          sceneContainer.removeEventListener(
            'touchstart',
            navRouterMobile,
            false
          )
        }
      }

      const navRouterMobile = (e) => {
        // Update Raycaster
        const rect = renderer.domElement.getBoundingClientRect()
        rayMouse.x =
          ((e.touches[0].clientX - rect.left) / (rect.width - rect.left)) * 2 -
          1
        rayMouse.y =
          -((e.touches[0].clientY - rect.top) / (rect.bottom - rect.top)) * 2 +
          1

        raycaster.setFromCamera(rayMouse, camera)

        intersects = raycaster.intersectObjects(
          this.currentNav === pivotGlobe ? spriteCities : spriteMoodsFlat
        )

        if (intersects[0].object === currentTarget) {
          this.$router.push({
            path: `/post/${currentTarget.name}`,
          })
        }
      }

      const navRouter = () => {
        if (currentTarget) {
          this.$router.push({
            path: `/post/${currentTarget.name}`,
          })
        }
      }

      if (!isMobile) {
        sceneContainer.addEventListener('click', navRouter, false)
      }

      // LERP TIMER

      let lerpTimerBool = true
      const lerpTimerFn = () => {
        lerpTimerBool = true
      }
      let lerpTimer

      const setLerpTimer = () => {
        clearInterval(lerpTimer)
        lerpTimer = setInterval(lerpTimerFn, 6000)
      }

      const clearLerpTimer = () => {
        clearInterval(lerpTimer)
        lerpTimerBool = true
      }

      // OBJECT CONTROLS
      // https://github.com/albertopiras/threeJS-object-controls

      // MOUSE DESKTOP

      const mouseDown = (e) => {
        if (e.button === 0) {
          isDragging = true
          isThrowing = true
          lerpTimerBool = false

          setLerpTimer()

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
      }

      const mouseMove = (e) => {
        // Raycaster
        const rect = renderer.domElement.getBoundingClientRect()
        rayMouse.x =
          ((event.clientX - rect.left) / (rect.width - rect.left)) * 2 - 1
        rayMouse.y =
          -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1

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

      // TOUCH CONTROLS

      // mouse down
      const onTouchStart = (e) => {
        e.preventDefault()
        setLerpTimer()

        // Mobile Raycaster
        const rect = renderer.domElement.getBoundingClientRect()
        rayMouse.x =
          ((e.touches[0].clientX - rect.left) / (rect.width - rect.left)) * 2 -
          1
        rayMouse.y =
          -((e.touches[0].clientY - rect.top) / (rect.bottom - rect.top)) * 2 +
          1

        raycaster.setFromCamera(rayMouse, camera)

        if (this.currentNav === pivotGlobe) {
          intersects = raycaster.intersectObjects(spriteCities)

          if (intersects.length > 0 && intersects[0].object.name === 'mood') {
            toggleHover = true
          } else {
            toggleClick = false
            toggleHover = false
          }
        }

        if (this.currentNav === pivotMood) {
          intersects = raycaster.intersectObjects(spriteMoodsFlat)

          if (intersects.length > 0 && intersects[0].object.name === 'globe') {
            toggleHover = true
          } else {
            toggleClick = false
            toggleHover = false
          }
        }

        if (
          intersects.length >= 2 &&
          intersects[0].object.name !== 'globe' &&
          intersects[0].object.name !== 'mood' &&
          currentTarget !== intersects[0].object
        ) {
          if (currentTarget) {
            setTarget(null)
            removeTitle()
          }

          setTarget(intersects[0].object)
          addTitle(intersects[0].object)
        }

        isDragging = true
        isThrowing = true
        lerpTimerBool = false

        mouseXOnMouseDown = e.touches[0].clientX - windowHalfX
        mouseYOnMouseDown = e.touches[0].clientY - windowHalfY

        if (this.currentNav === pivotGlobe) {
          targetRotationOnMouseDownX = targetRotationXGlobe
          targetRotationOnMouseDownY = targetRotationYGlobe
        }

        if (this.currentNav === pivotMood) {
          targetRotationOnMouseDownX = targetRotationXMood
          targetRotationOnMouseDownY = -targetRotationYMood
        }
      }

      // on mouse move
      const onTouchMove = (e) => {
        e.preventDefault()

        if (isDragging) {
          mouseX = e.touches[0].clientX - windowHalfX
          mouseY = e.touches[0].clientY - windowHalfY

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

      const resetRayMouse = () => {
        rayMouse.x = null
        rayMouse.y = null
        raycaster.setFromCamera(rayMouse, camera)

        intersects = raycaster.intersectObjects(
          this.currentNav === pivotGlobe ? spriteCities : spriteMoodsFlat
        )
      }

      // mouse up
      const onTouchEnd = (e) => {
        isDragging = false
        zoomPosition = 0.005
        // resetRayMouse()
      }

      // mouse event listeners
      if (!isMobile) {
        const addHandlers = () => {
          sceneContainer.addEventListener('mousedown', mouseDown, false)
          sceneContainer.addEventListener('mousemove', mouseMove, false)
          sceneContainer.addEventListener('mouseup', mouseUp, false)
        }

        const removeHandlers = () => {
          isDragging = false
          zoomPosition = 0.005

          sceneContainer.removeEventListener('mousedown', mouseDown, false)
          sceneContainer.removeEventListener('mousemove', mouseMove, false)
          sceneContainer.removeEventListener('mouseup', mouseUp, false)
        }

        addHandlers()

        sceneContainer.addEventListener('mouseover', addHandlers, false)
        sceneContainer.addEventListener('mouseout', removeHandlers, false)
      }

      // touch event listeners

      sceneContainer.addEventListener('touchstart', onTouchStart, false)
      sceneContainer.addEventListener('touchmove', onTouchMove, false)
      sceneContainer.addEventListener('touchend', onTouchEnd, false)

      // INITIALIZE CANVAS

      const canvas = this.$refs.scene
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      // renderer.setSize(window.innerWidth, window.innerHeight)

      const scene = new THREE.Scene()
      scene.background = new THREE.Color('white')

      // CAMERA PIVOT

      const pivotCamera = new THREE.Object3D()
      pivotCamera.position.set(0, 0, isMobile ? 5.5 : 4.75)
      scene.add(pivotCamera)

      // CAMERA

      const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100)
      pivotCamera.add(camera)
      camera.lookAt(0, 0, isMobile ? -5.5 : -4.75)

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

      const getDistance = (x1, y1, z1, x2, y2, z2) => {
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
          let d = getDistance(c.x, c.y, c.z, x, y, z) / colors[i].weight
          distances.push(d)

          d = 1 / d ** 3
          c.d = d
          c.d = d
          total += d
        }

        // find minumum value
        const minDistance = Math.min.apply(null, distances)
        // console.log(minDistance)

        // add position to colors

        if (y >= -0.7 && y <= 0.7 && minDistance < 0.5) {
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

      let toggleClick = false
      let toggleHover = false
      let rotatePosition = 0

      {
        const toggleAnim = () => {
          clearLerpTimer()
          resetRayMouse()

          if (!gsap.isTweening(pivotMain.rotation)) {
            if (this.currentNav === pivotGlobe) {
              gsap.to('#ball', 0.4, {
                x: '23px',
                backgroundColor: '#FB95B8',
              })
            }

            if (this.currentNav === pivotMood) {
              gsap.to('#ball', 0.4, {
                x: '0px',
                backgroundColor: '#749bff',
              })
            }

            rotatePosition += Math.PI
            gsap.to(pivotMain.rotation, 1, { y: rotatePosition })

            this.currentNav === pivotGlobe
              ? (this.currentNav = pivotMood)
              : (this.currentNav = pivotGlobe)
          }
        }

        document.querySelector('#toggle').addEventListener('click', toggleAnim)

        const checkToggleClick = () => {
          if (toggleHover) {
            toggleClick = true
          }
        }

        const checkToggleHover = () => {
          if (toggleHover && toggleClick) {
            toggleAnim()
          }
        }

        sceneContainer.addEventListener('mousedown', checkToggleClick)
        sceneContainer.addEventListener('click', checkToggleHover)
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
      const spriteMapBlack = new THREE.TextureLoader().load(
        '/sprites/mapDot3.png'
      )

      const spriteCities = []
      const spriteCitiesMats = []

      const spriteCitiesAlt = []
      const spriteCitiesMatsAlt = []

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
        })

        spriteCities.push(globe)
        spriteCities.push(mood)
      }

      addCities()

      // MOODS

      const moodsArr = {}
      const spriteMoods = {}
      const spriteMoodsMats = {}
      const spriteMoodsAlt = {}
      const spriteMoodsMatsAlt = {}
      const spriteTextArrMoods = {}

      this.colors.forEach((color) => {
        moodsArr[color.name] = []
        spriteMoods[color.name] = []
        spriteMoodsMats[color.name] = []
        spriteMoodsAlt[color.name] = []
        spriteMoodsMatsAlt[color.name] = []
        spriteTextArrMoods[color.name] = []
      })

      const getMoodPosition = (moodsArr, positions) => {
        let position
        let distance
        let distanceBool = false
        const minDistance = 0.3
        position = positions[Math.floor(Math.random() * positions.length)]

        if (moodsArr.length > 0) {
          while (!distanceBool) {
            let counter = 0

            for (let i = 0; i < moodsArr.length; i += 1) {
              distance = getDistance(
                position[0],
                position[1],
                position[2],
                moodsArr[i].position.x,
                moodsArr[i].position.y,
                moodsArr[i].position.z
              )

              if (distance < minDistance) {
                break
              }

              counter += 1
            }

            if (counter >= moodsArr.length) {
              distanceBool = true
            }

            if (!distanceBool) {
              counter = 0
              position = positions[Math.floor(Math.random() * positions.length)]
            }
          }
        }

        return position
      }

      const addMoods = () => {
        this.colors.forEach((color) => {
          color.posts.forEach((post, index) => {
            // Get Position
            const position = getMoodPosition(
              moodsArr[color.name],
              color.positions
            )

            // Main Object
            moodsArr[color.name].push(new THREE.Object3D())
            moodsArr[color.name][index].position.set(
              position[0] * 1.017,
              position[1] * 1.017,
              position[2] * 1.017
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
            spriteMoods[color.name][index].scale.set(0.09, 0.09, 1)
            moodsArr[color.name][index].add(spriteMoods[color.name][index])

            // Alt Material for each Sprite
            spriteMoodsMatsAlt[color.name].push(
              new THREE.SpriteMaterial({ map: spriteMapBlack })
            )
            spriteMoodsMatsAlt[color.name][index].name = 'Alt'
            spriteMoodsMatsAlt[color.name][index].transparent = true

            // Alt Sprite for each City
            spriteMoodsAlt[color.name].push(
              new THREE.Sprite(spriteMoodsMatsAlt[color.name][index])
            )
            spriteMoodsAlt[color.name][index].name = post.title
            spriteMoodsAlt[color.name][index].scale.set(0.09, 0.09, 1)
            spriteMoodsAlt[color.name][index].material.opacity = 0
            moodsArr[color.name][index].add(spriteMoodsAlt[color.name][index])
          })
        })

        spriteMoods.mood = mood
        spriteMoods.globe = globe
      }

      addMoods()

      // RAYCASTER ARRAYS

      const spriteMoodsFlat = Object.values(spriteMoods).flat()
      const spritesAll = spriteCities.concat(spriteMoodsFlat)
      const spritesAllAlt = spriteCitiesAlt.concat(
        Object.values(spriteMoodsAlt).flat()
      )

      // TITLE TEXT
      const activeTitles = []
      const posRaycast = new THREE.Vector2()

      const setActiveTitles = () => {
        for (let i = 0; i < activeTitles.length; i += 1) {
          let pos = new THREE.Vector3()
          pos = pos.setFromMatrixPosition(activeTitles[i][0].matrixWorld)
          pos.project(camera)

          posRaycast.x = pos.x
          posRaycast.y = pos.y

          const widthHalf = canvas.clientWidth / 2
          const heightHalf = canvas.clientHeight / 2

          pos.x = pos.x * widthHalf + widthHalf + 15
          pos.y = -(pos.y * heightHalf) + heightHalf

          gsap.set(activeTitles[i][1], {
            x: pos.x,
            y: pos.y,
          })
        }
      }

      const navRouterTitle = (e) => {
        if (e.target) {
          this.$router.push({
            path: `/post/${e.target.innerHTML}`,
          })
        }
      }

      const addTitle = (object) => {
        // add new title
        const title = document.createElement('a')
        title.classList.add('title')
        const text = document.createTextNode(`${object.name}`)
        title.append(text)
        title.style.position = 'absolute'
        title.title = object.name

        title.addEventListener('click', navRouterTitle, false)
        title.addEventListener('touchstart', navRouterTitle, false)

        this.$refs.sceneContainer.append(title)

        const tl = gsap.timeline()
        tl.set(title, {
          fontSize: '0.8rem',
          fontWeight: 500,
          opacity: 0,
          left: 0,
          top: 0,
          margin: 0,
          transform: 'translateY(-50%)',
          // pointerEvents: 'none',
        }).to(title, 0.3, { alpha: 1 })

        const newTitle = [object, title]

        activeTitles.push(newTitle)

        // fade all others
        removeTitle(newTitle)
      }

      const removeTitle = (title) => {
        if (!title) {
          title = null
        }

        // iterate through all, except object and fade/remove all
        for (let i = 0; i < activeTitles.length; i += 1) {
          if (activeTitles[i] !== title) {
            const ele = activeTitles[i]

            const tl = gsap.timeline({
              onComplete: () => {
                activeTitles[i][1].removeEventListener(
                  'click',
                  navRouterTitle,
                  false
                )
                activeTitles[i][1].removeEventListener(
                  'touchstart',
                  navRouterTitle,
                  false
                )
                activeTitles[i][1].remove()

                const index = activeTitles.indexOf(ele)
                activeTitles.slice(index, 1)
              },
            })

            tl.to(ele[1], 0.4, { autoAlpha: 0 })
          }
        }
      }

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

      // Raycaster Title

      // const raycasterTitle = new THREE.Raycaster()

      // RENDER

      const render = () => {
        // RESIZE

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement
          camera.aspect = canvas.clientWidth / canvas.clientHeight
          camera.updateProjectionMatrix()
        }

        // RAYCASTER DESKTOP

        if (!isMobile) {
          raycaster.setFromCamera(rayMouse, camera)

          if (this.currentNav === pivotGlobe) {
            intersects = raycaster.intersectObjects(spriteCities)

            if (intersects.length > 0 && intersects[0].object.name === 'mood') {
              toggleHover = true
            } else {
              toggleClick = false
              toggleHover = false
            }
          }

          if (this.currentNav === pivotMood) {
            intersects = raycaster.intersectObjects(spriteMoodsFlat)

            if (
              intersects.length > 0 &&
              intersects[0].object.name === 'globe'
            ) {
              toggleHover = true
            } else {
              toggleClick = false
              toggleHover = false
            }
          }

          if (
            intersects.length >= 2 &&
            intersects[0].object.name !== 'globe' &&
            intersects[0].object.name !== 'mood' &&
            currentTarget !== intersects[0].object
          ) {
            // if (isMobile) {
            //   setTarget(null)
            //   removeTitle()
            // }

            setTarget(intersects[0].object)
            addTitle(intersects[0].object)
          }

          if (intersects.length < 2 && currentTarget) {
            // if (!isMobile) {
            setTarget(null)
            removeTitle()
            // }
          }
        }

        // adds tracking animation to titles
        if (activeTitles.length > 0) {
          setActiveTitles()
        }

        // HOVER ANIMATIONS

        // globe main sprite

        if (currentTarget && currentTarget.material.opacity >= 0) {
          currentTarget.material.opacity -= 0.03
        }

        spritesAll.forEach((obj) => {
          if (obj !== currentTarget && obj.material.opacity <= 1) {
            obj.material.opacity += 0.03
          }
        })

        // globe alt sprite

        spritesAllAlt.forEach((obj, index) => {
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

        if (pivotMain && mood && globe) {
          // Title Raycast (disappear when not in view)
          if (currentTarget) {
            raycasterTitle.setFromCamera(posRaycast, camera)

            const intersectsTitle =
              this.currentNav === pivotGlobe
                ? raycasterTitle.intersectObjects(spriteCities)
                : raycasterTitle.intersectObjects(spriteMoodsFlat)

            if (intersectsTitle.length > 0) {
              if (
                intersectsTitle[0].object.name === 'globe' ||
                intersectsTitle[0].object.name === 'mood'
              ) {
                setTarget(null)
                removeTitle()
              }
            }
          }

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

          // CAMERA ZOOM IN

          if (!isMobile && isDragging && !currentTarget) {
            if (camera.position.z >= maxZoom) {
              zoomPosition *= zoomInSpeed
              camera.position.z -= zoomPosition
            }
          }

          if (isDragging && isMobile) {
            if (camera.position.z >= maxZoom) {
              zoomPosition *= zoomInSpeed
              camera.position.z -= zoomPosition
            }
          }

          // CAMERA ZOOM OUT

          if (!isDragging && lerpTimerBool) {
            if (camera.position.z <= minZoom) {
              camera.position.z += zoomOutSpeed
            }

            // if momentum is below certain amount, we are not throwing
            if (Math.abs(deltaX) < 0.005 && Math.abs(deltaY) < 0.005) {
              isThrowing = false
            }
          }

          if (this.currentNav === pivotGlobe) {
            if (!isDragging && lerpTimerBool) {
              // OBJECT CORRECTION LERP

              if (!isThrowing) {
                targetRotationYGlobe = pivotGlobe.rotation.x

                if (pivotGlobe.rotation.x > 0.01) {
                  pivotGlobe.rotation.x += -0.0015
                } else if (pivotGlobe.rotation.x < -0.01) {
                  pivotGlobe.rotation.x += 0.0015
                }
              }

              globe.rotateOnAxis(globeAxis, 0.0015)
            }

            targetRotationYMood = pivotMood.rotation.x
            if (pivotMood.rotation.x > 0.01) {
              pivotMood.rotation.x += -0.0015
            } else if (pivotMood.rotation.x < -0.01) {
              pivotMood.rotation.x += 0.0015
            }
            mood.rotateOnAxis(globeAxis, 0.0015)
          }

          if (this.currentNav === pivotMood) {
            if (!isDragging && lerpTimerBool) {
              if (!isThrowing) {
                targetRotationYMood = pivotMood.rotation.x
                if (pivotMood.rotation.x > 0.01) {
                  pivotMood.rotation.x += -0.0015
                } else if (pivotMood.rotation.x < -0.01) {
                  pivotMood.rotation.x += 0.0015
                }
              }
              mood.rotateOnAxis(globeAxis, 0.0015)
            }

            targetRotationYGlobe = pivotGlobe.rotation.x

            if (pivotGlobe.rotation.x > 0.01) {
              pivotGlobe.rotation.x += -0.0015
            } else if (pivotGlobe.rotation.x < -0.01) {
              pivotGlobe.rotation.x += 0.0015
            }

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
.navContainer {
  position: relative;
  height: 100vh;
}

.welcome {
  text-align: center;
  text-transform: uppercase;
  font-weight: $medium;
  font-size: 4vw;
  z-index: $z-above;
  position: absolute;
  left: 50%;
  top: 5rem;
  width: 100%;
  transform: translateX(-50%);
}

.sceneContainer {
  text-align: center;
  cursor: grab;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}

.scene {
  width: 100%;
  min-height: 100vh;
  height: 152vw;
  display: block;
  pointer-events: none;
}

.toggleContainer {
  position: absolute;
  bottom: 5rem;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: $z-above;
}

@media (pointer: none), (pointer: coarse) {
  .scene {
    height: 100vh !important;
  }

  .toggleContainer {
    bottom: 5rem !important;
  }
}

@media (min-width: $bp-mobile) {
  .welcome {
    display: none;
  }

  .toggleContainer {
    position: absolute;
    bottom: 3rem;
  }
}

@media (min-width: $bp-tablet) {
  .scene {
    width: 100%;
    height: 135vh;
    display: block;
    pointer-events: none;
  }
}

@media (min-width: $bp-desktop) {
  .scene {
    width: 100%;
    height: 160vh;
    display: block;
    pointer-events: none;
  }

  .toggleContainer {
    position: absolute;
    top: 50%;
    bottom: auto;
    left: 1rem;
    transform: translate(0, -50%);
  }

  .toggleContainer {
    left: 2rem;
  }
}
</style>
