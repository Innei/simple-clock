/*
 * @Author: Innei
 * @Date: 2020-08-22 13:49:32
 * @LastEditTime: 2020-08-22 22:10:28
 * @LastEditors: Innei
 * @FilePath: /simple-clock/index.js
 * @Coding with Love
 */
// @ts-check
import dynamics from 'dynamics.js'
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

function springHand(el, deg) {
  dynamics.animate(
    el,
    {
      rotateZ: deg,
    },
    { frequency: 500, type: dynamics.spring },
  )
}

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
  const min = time.getMinutes()
  const s = time.getSeconds()
  const hour = time.getHours()

  let minDeg = 180 + (360 / 60) * min
  let sDeg = 180 + (360 / 60) * s
  let hourDeg = 180 + (360 / 12) * hour

  let secondsPass = 0
  let minutesPass = 0
  let isFirstChangeSecond = false
  let isFirstChangeMinute = false

  function setTime() {
    springHand($minute, minDeg)
    springHand($hour, hourDeg)
    springHand($second, sDeg)

    secondsPass++
    sDeg += 360 / 60
    if (secondsPass % (60 - (isFirstChangeSecond ? 0 : s)) == 0) {
      isFirstChangeSecond = true
      secondsPass = 0
      minDeg += 6
      minutesPass++
    }
    if (
      minutesPass &&
      minutesPass % (60 - (isFirstChangeMinute ? 0 : min)) == 0
    ) {
      minutesPass = 0
      isFirstChangeMinute = true
      hourDeg += 360 / 12
    }
  }

  setTime()
  timer = setInterval(setTime, 1000)
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState == 'hidden') {
    animateEls.map(($) => {
      dynamics.stop($)
    })
    timer = clearInterval(timer)
  }

  if (document.visibilityState == 'visible') {
    init()
  }
})
init()
