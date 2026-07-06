// const keyCodeMap = {
//     91: true, // command
//     61: true,
//     107: true, // 数字键盘 +
//     109: true, // 数字键盘 -
//     173: true, // 火狐 - 号
//     187: true, // +
//     189: true // -
// }
// // 覆盖ctrl||command + ‘+’/‘-’
// document.onkeydown = function (event) {
//     const e = event || window.event
//     const ctrlKey = e.ctrlKey || e.metaKey
//     if (ctrlKey && keyCodeMap[e.keyCode]) {
//         e.preventDefault()
//     } else if (e.detail) {
//         // Firefox
//         event.returnValue = false
//     }
// }
// // 覆盖鼠标滑动
// document.body.addEventListener(
//     'wheel',
//     (e) => {
//         if (e.ctrlKey) {
//             if (e.deltaY < 0) {
//                 e.preventDefault()
//                 return false
//             }
//             if (e.deltaY > 0) {
//                 e.preventDefault()
//                 return false
//             }
//         }
//     },
//     { passive: false }
// )

function setScale(viewportWidth = 1920, viewportHeight = 1080) {
  const dom: any = document.querySelectorAll('#mainBox')[0]
  // console.log('dom :>> ', document.querySelectorAll('.main'));
  if (!dom) return
  const childElement = dom.querySelector('.cimBox')
  // console.log('childElement :>> ', childElement);
  dom.style['transform-origin'] = 'top left'
  dom.style['-ms-transform-origin'] = 'top left'
  dom.style['-webkit-transform-origin'] = 'top left'
  if (childElement) {
    childElement.style['transform-origin'] = 'top left'
    childElement.style['-ms-transform-origin'] = 'top left'
    childElement.style['-webkit-transform-origin'] = 'top left'
  }

  let s: any = null
  let h: any = null

  if (window.innerWidth / window.innerHeight > 2) {
    // console.log('window.innerWidth / window.innerHeight', window.innerWidth / window.innerHeight);
    s = window.innerWidth / ((viewportHeight * window.innerWidth) / window.innerHeight)
    h = window.innerHeight / viewportHeight
    dom.style['transform'] = ` scale(${s},${h})`
    dom.style['-ms-transform'] = ` scale(${s},${h})`
    dom.style['-webkit-transform'] = ` scale(${s},${h})`
    dom.style.width = window.innerWidth / s + 'px'
    dom.style.height = window.innerHeight / h + 'px'
    if (childElement) childElement.style.transform = `scale(${1 / s},${1 / h})`
  } else if (window.innerWidth / window.innerHeight <= 2) {
    s = window.innerWidth / viewportWidth
    h = window.innerHeight / viewportHeight
    dom.style['transform'] = ` scale(${s},${h})`
    dom.style['-ms-transform'] = ` scale(${s},${h})`
    dom.style['-webkit-transform'] = ` scale(${s},${h})`
    dom.style.width = window.innerWidth / s + 'px'
    dom.style.height = window.innerHeight / h + 'px'
    if (childElement) childElement.style.transform = `scale(${1 / s},${1 / h})`
  }

  window.s = s
  window.h = h
}

window.setScale = setScale
window.onload = () => {
  window.addEventListener('resize', () => {
    setScale()
  })
}

// setScale()
