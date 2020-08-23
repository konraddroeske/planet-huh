import gsap from 'gsap'

export const state = () => ({
  isMobile: null,
  isNavLarge: true,
  isOpen: false,
})

export const actions = {
  setNavSmall({ state, commit }) {
    commit('setNavSize', false)
    commit('setNavOpen', false)

    const navContainerTl = gsap.timeline()
    const navTime = 1

    navContainerTl
      .set('#sceneContainer', {
        width: '250%',
      })
      .to('#navContainer', navTime, {
        y: state.isMobile ? '3rem' : '-2rem',
        scale: state.isMobile ? 0.2 : 0.15,
        ease: 'power4.out',
        zIndex: 20,
      })
      .set('#layout', {
        height: 'auto',
        overflow: 'visible',
      })

    gsap.to('#toggleContainer', navTime, { autoAlpha: 0 })
    gsap.to('#navFeedContainer', navTime, { autoAlpha: 0 })
  },
  setNavIndex({ state }, startRouting) {
    const navContainerTl = gsap.timeline()
    const scrollTime = 0.3
    const navTime = 1

    navContainerTl
      .to(window, scrollTime, {
        scrollTo: 0,
        onComplete: () => {
          startRouting()
        },
      })
      .set('#layout', {
        height: 'calc(100vh + 1px)',
        overflow: 'hidden',
      })
      .set('#navContainer', {
        position: 'fixed',
      })
      .set('#sceneContainer', {
        width: '250%',
      })
      .to('#navContainer', navTime, {
        y: '-2rem',
        scale: state.isMobile ? 0.2 : 0.15,
        ease: 'power4.out',
      })
      .set('#layout', {
        height: 'auto',
        overflow: 'visible',
      })

    gsap.to('#toggleContainer', navTime, { autoAlpha: 0 })
    // gsap.to('#welcome', navTime, { autoAlpha: 0 })
    gsap.to('#navFeedContainer', navTime, { autoAlpha: 0 })
  },
  setNavIndexSmall({ state }, payload) {
    const navContainerTl = gsap.timeline({
      onComplete: () => {
        payload[0]()
      },
    })
    const scrollTime = 0.3

    navContainerTl
      .set('#footer', {
        display: 'none',
      })
      .to(payload[1], scrollTime, {
        opacity: 0,
      })
      .set('#nav3d', {
        height: '100vh',
      })
  },
  setNavLarge({ state, commit }) {
    commit('setNavSize', true)

    if (state.isMobile) {
      commit('setNavOpen', true)
    }

    const navContainerTl = gsap.timeline()
    const scrollTime = 0.3
    const navTime = 1
    const delay = 0

    navContainerTl
      .to(window, scrollTime, {
        scrollTo: 0,
      })
      .set('#layout', {
        height: 'calc(100vh + 1px)',
        overflow: 'hidden',
      })
      .to('#navContainer', navTime, {
        delay,
        y: '0',
        scale: 1,
        ease: 'power4.out',
        zIndex: 10,
      })
      .set('#navContainer', {
        position: state.isMobile ? 'fixed' : 'absolute',
      })
      .set('#layout', {
        height: 'auto',
        overflow: 'visible',
      })
      .set('#sceneContainer', {
        width: '100%',
      })

    gsap.to('#toggleContainer', navTime, { autoAlpha: 1 })
    gsap.to('#navFeedContainer', navTime, { autoAlpha: 1 })
  },
  setNavContainerSmall() {
    gsap.to('#nav3d', 0.6, {
      height: 0,
      ease: 'power4.out',
    })

    gsap.set('#footer', {
      display: 'block',
    })
  },
  setNavContainerLarge() {
    gsap.to('#nav3d', 0.6, {
      height: '100vh',
      ease: 'power4.out',
    })
  },
  setNavStyle({ state }, isMobile) {
    gsap.set('#navContainer', {
      position: 'fixed',
      y: isMobile ? '3rem' : '-2rem',
      scale: isMobile ? 0.2 : 0.15,
      zIndex: 20,
    })

    gsap.set('#nav3d', {
      height: 0,
    })

    gsap.set('#toggleContainer', { autoAlpha: 0 })
    gsap.to('#navFeedContainer', { autoAlpha: 0 })
    gsap.set('#sceneContainer', {
      width: '250%',
    })
  },
}

export const mutations = {
  setMobile(state, mobileStatus) {
    state.isMobile = mobileStatus
  },
  setNavSize(state, navStatus) {
    state.isNavLarge = navStatus
  },
  setNavOpen(state, openStatus) {
    state.isOpen = openStatus
  },
}
