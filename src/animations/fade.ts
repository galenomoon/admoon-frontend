export function fade(show: boolean) {
  const animateIn = {
    opacity: 1,
    display: "flex",
  }

  const animateOut = {
    opacity: 0,
    transitionEnd: {
      display: "none",
    },
  }

  return show ? animateIn : animateOut
}
