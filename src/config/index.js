const devHost = 'http://localhost:4000'
const prdHost = 'http://www.xhfkindergarten.cn:4000'
const host = process.env.NODE_ENV === 'development' ? devHost : prdHost
const imgHost = 'https://img.xhfkindergarten.cn'
export default {
  host,
  imgHost
}
