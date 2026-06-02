import { animateMini, stagger } from "motion";

export function animateSlideDown(selector: string) {
  animateMini(
    selector,
    { opacity: [0, 1], y: [-20, 0] },
    { duration: 0.45, ease: "easeOut" },
  );
}

export function animatePageIn(selector: string) {
  animateMini(
    selector,
    { opacity: [0, 1], y: [12, 0] },
    { duration: 0.35, ease: "easeOut" },
  );
}

export function animateStaggerIn(containerSelector: string) {
  animateMini(
    `${containerSelector} > *`,
    { opacity: [0, 1], y: [28, 0] },
    { duration: 0.4, delay: stagger(0.07), ease: "easeOut" },
  );
}

export function animateFadeIn(selector: string, delay = 0) {
  animateMini(
    selector,
    { opacity: [0, 1] },
    { duration: 0.5, delay, ease: "easeOut" },
  );
}

export function animateSlideUp(selector: string) {
  animateMini(
    selector,
    { opacity: [0, 1], y: [32, 0] },
    { duration: 0.45, ease: "easeOut" },
  );
}
