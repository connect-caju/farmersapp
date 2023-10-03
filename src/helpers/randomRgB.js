export const randomRBG = () => {
  let r = ((Math.floor(Math.random() * 100) + 100) % 100) + 100
  let g = ((Math.floor(Math.random() * 100) + 100) % 100) + 100
  let b = ((Math.floor(Math.random() * 100) + 100) % 100) + 100
  while (r > 70 && g > 70) {
    r = ((Math.floor(Math.random() * 100) + 100) % 100) + 100
    b = ((Math.floor(Math.random() * 100) + 100) % 100) + 100
    g = ((Math.floor(Math.random() * 100) + 100) % 100) + 100
  }

  return `#${r}${g}${b}`
}
