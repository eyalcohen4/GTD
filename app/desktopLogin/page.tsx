export default function DesktopLogin() {
  const hash = window.location.hash.substr(1)

  window.location.href = `
    current://auth#${hash}
  ` //

  return null
}
