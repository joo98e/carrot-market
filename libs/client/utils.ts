export const cls = (...classnames: string[]) => {
  return classnames.join(' ')
}

export const itostr = (num: number | string) => {
  return num > 9 ? num.toString() : `0${num}`
}