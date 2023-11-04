export function slide(
  show: boolean,
  direction: "top" | "x" | "y" = "top",
  type?: "tween" | "spring",
  animateInValue?: string,
  animateOutValue?: string,
) {
  const animateIn = {
    [direction]: animateInValue || "0px",
    transition: { type: type, duration: 0.5 },
  }
  const animateOut = {
    [direction]: animateOutValue || "1000px",
    transition: { type: type, duration: 0.5 },
  }
  return show ? animateIn : animateOut
}
