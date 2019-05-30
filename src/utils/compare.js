import StringBuffer from './StringBuffer'

/*
  * 传入2个字符串进行相比高亮显示
  * 例如
  * 原数据一:王五张三
  * 原数据二:张三李四
  * <span style='color:blue'>王五</span>张三
  * 张三<span style='color:blue'>李四</span>

  * 例如
  * 原数据一:1000
  * 原数据二:10012
  * 100<span style='color:blue'>0</span>
  * 100<span style='color:blue'>12</span>
  html里下边调用

  <script src="/Scripts/pages/getHighLightDifferent.js"></script>
  <script>
      $(document).ready(const () {
          getHighLightDifferent("王五张三", "张三李四");
          getHighLightDifferent("1000", "10012");
      });
  </script>
*/

// let flag = 1

const getHighLightDifferent = (a, b) => {
  // console.log("输入：" + a);
  // console.log("输入：" + b);

  let temp = getDiffArray(a, b)
  let a1 = getHighLight(a, temp[0])
  // console.log("输出：" + a1);

  let a2 = getHighLight(b, temp[1])
  // console.log("输出：" + a2);
  // console.log(flag);
  return [a1, a2]
}

const getHighLight = (source, temp) => {
  let result = new StringBuffer()
  let sourceChars = source.split('')
  let tempChars = temp.split('')
  let flag = false
  for (let i = 0; i < sourceChars.length; i++) {
    if (tempChars[i] !== ' ') {
      if (i === 0) {
        result.append("<span style='background:red;color:#FFF;'>")
        result.append(sourceChars[i])
      } else if (flag) {
        result.append(sourceChars[i])
      } else {
        result.append("<span style='background:red;color:#FFF;'>")
        result.append(sourceChars[i])
      }
      flag = true
      if (i === sourceChars.length - 1) {
        result.append('</span>')
      }
    } else if (flag === true) {
      result.append('</span>')
      result.append("<span style='background:#2E7866;color:#FFF;'>")
      result.append(sourceChars[i])
      result.append('</span>')
      flag = false
    } else {
      // 该位为空格，且flag为false
      result.append("<span style='background:#2E7866;color:#FFF;'>")
      result.append(sourceChars[i])
      result.append('</span>')
    }
  }
  return result.toString()
}

const getDiffArray = (a, b) => {
  let result = []
  // 选取长度较小的字符串用来穷举子串
  if (a.length < b.length) {
    let start = 0
    let end = a.length
    result = getDiff(a, b, start, end)
  } else {
    // let start = 0
    // let end = b.length
    result = getDiff(b, a, 0, b.length)
    result = [result[1], result[0]]
  }
  return result
}

// 将a的指定部分与b进行比较生成比对结果
const getDiff = (a, b, start, end) => {
  let result = [a, b]
  let len = result[0].length
  while (len > 0) {
    for (let i = start; i < end - len + 1; i++) {
      let sub = result[0].substring(i, i + len)
      let idx = -1
      if ((idx = result[1].indexOf(sub)) !== -1) {
        result[0] = setEmpty(result[0], i, i + len)
        result[1] = setEmpty(result[1], idx, idx + len)
        if (i > 0) {
          // 递归获取空白区域左边差异
          result = getDiff(result[0], result[1], start, i)
        }
        if (i + len < end) {
          // 递归获取空白区域右边差异
          result = getDiff(result[0], result[1], i + len, end)
        }
        len = 0// 退出while循环
        break
      }
    }
    len = parseInt(len / 2)
    // len = len - 1;
    // console.log(len);
  }
  // console.log(result.join(""));
  return result
}

// 将字符串s指定的区域设置成空格
const setEmpty = (s, start, end) => {
  let array = s.split('')
  for (let i = start; i < end; i++) {
    array[i] = ' '
  }
  return array.join('')
}

export default getHighLightDifferent
