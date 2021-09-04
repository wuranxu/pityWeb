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
  },
  parseHeaders: headers => {
    if (!headers) {
      return [];
    }
    let hd = {}
    if (typeof headers === 'string') {
      hd = JSON.parse(headers);
    } else {
      hd = headers;
    }
    return Object.keys(hd).map(key => ({
      key, value: hd[key]
    }))
  },
  translateHeaders: headers => {
    const hd = {};
    for (const h in headers) {
      hd[headers[h].key] = headers[h].value;
    }
    return JSON.stringify(hd, null, 2);
  },
}
