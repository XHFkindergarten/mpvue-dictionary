const success = (msg, time = 3000) => {
  wx.showToast({
    title: msg,
    duration: time,
    image: '/static/icon/Happy-Wink.png'
  })
}
const warning = (msg, time = 3000) => {
  wx.showToast({
    title: msg,
    duration: time,
    image: '/static/icon/warning.png'
  })
}
const error = (msg, time = 3000) => {
  wx.showToast({
    title: msg,
    duration: time,
    image: '/static/icon/cross.png'
  })
}
export default {
  success,
  warning,
  error
}
