export default function DesktopLogin() {
  // @ts-ignore
  const hash = global?.window.location.hash.substr(1)

  // @ts-ignore
  global.window.location.href = `
    current://auth#${hash}
  ` //

  return null
}
