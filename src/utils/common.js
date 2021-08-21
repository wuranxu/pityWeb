export default {
  calPercent: function Percentage(num, total) {
    if (num === 0 || total === 0) {
      return 0;
    }
    return (Math.round(num / total * 10000) / 100.00);// 小数点后两位百分比
  },

  calPiePercent: function Percentage(num, total) {
    if (num === 0 || total === 0) {
      return 0;
    }
    return (Math.round(num / total));// 小数点后两位百分比
  }
}
