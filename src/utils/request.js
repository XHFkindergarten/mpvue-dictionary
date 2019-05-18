// 封装http请求
export function request (url, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      data: data,
      method: method,
      url: url,
      success: function (res) {
        if (res.data.success) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}
