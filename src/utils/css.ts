import { keyframes } from 'styled-components'

interface DeviceBreakPoint {
  mobileS: '(max-width: 320px)'
  mobileM: '(max-width: 375px)'
  mobileL: '(max-width: 425px)'
  tablet: '(max-width: 768px)'
  laptop: '(max-width: 1024px)'
  laptopL: '(max-width: 1440px)'
  desktop: '(max-width: 2560px)'
}

export const deviceBreakPoint: DeviceBreakPoint = {
  mobileS: '(max-width: 320px)',
  mobileM: '(max-width: 375px)',
  mobileL: '(max-width: 425px)',
  tablet: '(max-width: 768px)',
  laptop: '(max-width: 1024px)',
  laptopL: '(max-width: 1440px)',
  desktop: '(max-width: 2560px)'
}

export const animationRotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`