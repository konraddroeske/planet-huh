import gsap from "gsap"

export const state = () => ({
  isMobile: null,
  isNavLarge: true,
  isOpen: false,
  isPlay: true,
  pause: null,
  play: null,
  addNavClick: null,
  removeNavClick: null,
  isResize: false,
  resizeTimer: null,
  addResize: null,
  removeResize: null,
})

export const actions = {
  setNavSmall({ state, commit }) {
    commit("setNavSize", false)
    commit("setNavOpen", false)

    const navContainerTl = gsap.timeline({
      onComplete: () => {
        state.pause()
        state.addResize()
        state.removeNavClick()
      },
    })
    const navTime = 1

    navContainerTl
      .to("#navContainer", navTime, {
        y: state.isMobile ? "3rem" : "-2rem",
        scale: state.isMobile ? 0.2 : 0.15,
        ease: "power4.out",
        zIndex: 20,
      })
      .set("#layout", {
        height: "auto",
        overflow: "visible",
      })

    gsap.to("#toggleContainer", navTime, { autoAlpha: 0 })
    gsap.to("#navFeedContainer", navTime, { autoAlpha: 0 })
  },
  setNavIndex({ state }, startRouting) {
    const navContainerTl = gsap.timeline()
    const scrollTime = 0.4
    const navTime = 1

    navContainerTl
      .to(window, scrollTime, {
        scrollTo: 0,
        ease: "power4.out",
        onComplete: () => {
          startRouting()
          state.pause()
          state.addResize()
          state.removeNavClick()
        },
      })
      .set("#layout", {
        height: "calc(100vh + 1px)",
        overflow: "hidden",
      })
      .set("#navContainer", {
        position: "fixed",
      })
      .to("#navContainer", navTime, {
        y: "-2rem",
        scale: state.isMobile ? 0.2 : 0.15,
        ease: "power4.out",
      })
      .set("#layout", {
        height: "auto",
        overflow: "visible",
      })

    const footerTl = gsap.timeline()

    gsap.to("#footer", 0.6, {
      y: "60vh",
      ease: "power4.out",
    })

    footerTl
      .to("#footer", 0.6, {
        autoAlpha: 0,
        ease: "power4.out",
      })
      .set("#footer", {
        display: "none",
      })

    gsap.to("#toggleContainer", navTime, { autoAlpha: 0 })
    gsap.to("#navFeedContainer", navTime, { autoAlpha: 0 })
  },
  setNavIndexSmall({ state }, payload) {
    const { done, el } = payload

    const navContainerTl = gsap.timeline({
      onComplete: () => {
        done()
      },
    })
    const scrollTime = 0.4

    navContainerTl
      .set("#footer", {
        display: "none",
      })
      .to(el, scrollTime, {
        autoAlpha: 0,
        ease: "power4.out",
      })
      .set("#main", {
        y: "100vh",
      })

    const footerTl = gsap.timeline()

    gsap.to("#footer", 0.6, {
      y: "60vh",
      ease: "power4.out",
    })

    footerTl
      .to("#footer", 0.6, {
        autoAlpha: 0,
        ease: "power4.out",
      })
      .set("#footer", {
        display: "none",
      })
  },
  setNavLarge({ state, commit }) {
    commit("setNavSize", true)

    if (state.isMobile) {
      commit("setNavOpen", true)
    }

    const navContainerTl = gsap.timeline({
      onComplete: () => {
        state.play()
        state.removeResize()
        state.addNavClick()
        commit("clearResizeTimer")
      },
    })
    const navTime = 1
    const delay = 0

    navContainerTl
      .set("#layout", {
        height: "calc(100vh + 1px)",
        overflow: "hidden",
      })
      .to("#navContainer", navTime, {
        delay,
        y: "0",
        scale: 1,
        ease: "power4.out",
        zIndex: 10,
      })
      .set("#navContainer", {
        position: state.isMobile ? "fixed" : "absolute",
      })
      .set("#layout", {
        height: "auto",
        overflow: "visible",
      })
      .set("#footer", {
        display: "block",
        autoAlpha: 1,
        y: 0,
      })

    gsap.to("#toggleContainer", navTime, { autoAlpha: 1 })
    gsap.to("#navFeedContainer", navTime, { autoAlpha: 1 })
  },
  setNavContainerSmall() {
    // gsap.to("#main", 0.6, {
    //   y: 0,
    //   ease: "power4.out",
    // })
  },
  setNavContainerLarge(context) {
    gsap.set("#main", {
      y: "100vh",
    })
  },
  setNavStyle({ state }, isMobile) {
    gsap.set("#navContainer", {
      position: "fixed",
      y: isMobile ? "3rem" : "-2rem",
      scale: isMobile ? 0.2 : 0.15,
      zIndex: 20,
    })

    gsap.set("#main", {
      y: "0",
    })

    gsap.set("#toggleContainer", { autoAlpha: 0 })
    gsap.set("#navFeedContainer", { autoAlpha: 0 })
  },
  setLeave(context, payload) {
    const { el, done } = payload

    gsap.to(el, 0.6, {
      y: "60vh",
      ease: "power4.out",
    })

    gsap.to(el, 0.6, {
      autoAlpha: 0,
      ease: "power4.out",
    })

    gsap.to("#footer", 0.6, {
      y: "60vh",
      ease: "power4.out",
    })

    const tl = gsap.timeline()

    tl.to("#footer", 0.6, {
      autoAlpha: 0,
      ease: "power4.out",
    }).set("#footer", {
      display: "none",
      onComplete: () => done(),
    })
  },
  setEnter(context, payload) {
    const tl = gsap.timeline()
    const { el } = payload

    gsap.to("#main", 0.6, {
      y: 0,
      ease: "power4.out",
    })

    gsap.fromTo(
      el,
      { y: "60vh" },
      {
        y: "0",
        ease: "power4.out",
        duration: 1,
      }
    )

    tl.fromTo(
      el,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 1.3,
        ease: "power4.out",
      }
    ).set("#footer", {
      display: "block",
      autoAlpha: 1,
      y: 0,
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
  setIsPlay(state, payload) {
    state.isPlay = payload
  },
  setPause(state, fn) {
    state.pause = fn
  },
  setPlay(state, fn) {
    state.play = fn
  },
  setAddNavClick(state, fn) {
    state.addNavClick = fn
  },
  setRemoveNavClick(state, fn) {
    state.removeNavClick = fn
  },
  setIsResize(state, payload) {
    state.isResize = payload
  },
  setResizeTimer(state, payload) {
    state.resizeTimer = payload
  },
  clearResizeTimer(state) {
    const clearedTimer = clearInterval(state.resizeTimer)
    state.resizeTimer = clearedTimer
  },
  setAddResize(state, fn) {
    state.addResize = fn
  },
  setRemoveResize(state, fn) {
    state.removeResize = fn
  },
}
