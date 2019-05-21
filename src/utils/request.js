// 封装http请求
export function request (url, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      data: data,
      method: method,
      url: url,
      // 切记后端的ctx.body中一定要加success字段啊!
      success: function (res) {
        if (res.data) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (err) {
        console.log('err', err)
        reject(err)
      }
    })
  })
}
