class StringBuffer {
  constructor () {
    this.__strings__ = []
  }
  // 添加字符
  append (str) {
    this.__strings__.push(str)
    return this
  }
  appendFormat (str) {
    for (var i = 1; i < arguments.length; i++) {
      var parent = '\\{' + (i - 1) + '\\}'
      var reg = new RegExp(parent, 'g')
      str = str.replace(reg, arguments[i])
    }
    this.__strings__.push(str)
    return this
  }
  toString () {
    return this.__strings__.join('')
  }
  clear () {
    this.__strings__ = []
  }
  size () {
    return this.__strings__.length
  }
}

export default StringBuffer
