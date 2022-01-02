import dynamics from 'dynamics.js'
// @ts-check
/**
 * @type {HTMLDivElement}
 */
const $minute = document.querySelector('.minute-hand')
/**
 * @type {HTMLDivElement}
 */
const $hour = document.querySelector('.hour-hand')
/**
 * @type {HTMLDivElement}
 */
const $second = document.querySelector('.second-hand')
const animateEls = [$hour, $minute, $second]

// 摆动指针
function springHand(el, deg) {
  dynamics.animate(
    el,
    {
      rotateZ: deg,
    },
    { frequency: 500, type: dynamics.spring },
  )
}
// 初始动画
function doAnimate() {
  const $root = document.querySelector('.clock-root .point')
  dynamics.animate(
    $root,
    {
      scale: 3,
    },
    {
      type: dynamics.spring,
      frequency: 550,
      friction: 120,
      duration: 1500,
      delay: 100,
    },
  )
}
let timer

function init() {
  doAnimate()

  const time = new Date()
  const minute = time.getMinutes()
  const second = time.getSeconds()
  const hour = time.getHours()

  let minuteDeg = 180 + (360 / 60) * minute + (360 / 3600) * second
  let secondDeg = 180 + (360 / 60) * second
  let hourDeg =
    180 + (360 / 12) * hour + (360 / 720) * second + (360 / 43200) * minute

  const $time = document.getElementById('time')
  // 每秒动画
  function setTime() {
    springHand($minute, minuteDeg)
    springHand($hour, hourDeg)
    springHand($second, secondDeg)

    secondDeg += 360 / 60
    minuteDeg += 360 / 3600
    hourDeg += 360 / 43200

    const second = ((30 + secondDeg / 6) | 0) % 60
    const minute = ((30 + minuteDeg / 6) | 0) % 60
    const hour = ((6 + hourDeg / 30) | 0) % 12

    $time.innerText = `${hour}:${minute.toString().padStart(2, '0')}:${second
      .toString()
      .padStart(2, '0')}`
  }

  setTime()
  timer = setInterval(setTime, 1000)
}
// 重置函数
function reset() {
  animateEls.map(($) => {
    dynamics.stop($)
  })
  timer = clearInterval(timer)
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState == 'hidden') {
    reset()
  }

  if (document.visibilityState == 'visible') {
    init()
  }
})

setTimeout(() => {
  init()
})
// 5 分钟同步
setTimeout(() => {
  reset()
  init()
}, 300000)
