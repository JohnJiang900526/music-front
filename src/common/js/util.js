function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 格式化歌手数据
export function formatSinger (dataList = []) {
  let hots = [];
  let last = [];
  let groups = [];
  let temp = {};
  let otherGroups= [];

  function formatAvatar (str) {
    return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${ str }.jpg?max_age=2592000`;
  }

  let data = deepClone(dataList);

  if (data.length > 10) {
    hots = data.slice(0, 10);
    last = data.slice(10);
  } else {
    last = [...data];
  }

  hots = hots.map((item) => {
    item.avatar = formatAvatar(item.Fsinger_mid);
    
    item.Findex = "hot";

    return item;
  });

  last.map((item) => {
    let pattern = /^[a-zA-Z]+$/gi;

    item.avatar = formatAvatar(item.Fsinger_mid);

    if (pattern.test(item.Findex)) {
      if (temp[item.Findex]) {
        temp[item.Findex].push(item);
      } else {
        temp[item.Findex] = [];
        temp[item.Findex].push(item);
      }
    } else {
      otherGroups.push(item);
    }

    return item;
  });

  let arr = [];
  Object.keys(temp).sort().forEach((key) => {
    let obj = {
      key,
      name: key,
      data: temp[key]
    };
    arr.push(obj);
  });


  groups = [...[{
    key: "hot",
    name: "热门",
    data: hots
  }], ...arr, ...[{
    key: "*",
    name: "其他",
    data: otherGroups
  }]];

  return groups;
}

// 深度克隆
export function deepClone(obj) {
  let toString = Object.prototype.toString;
  let newObj = obj instanceof Array ? [] : {};

  for (let i in obj) {
    let item = obj[i];
    let isDeep = toString.call(item) === "[object Object]" ||  toString.call(item) === "[object Array]";

    if (isDeep) {
      newObj[i] = deepClone(item);
    } else {
      newObj[i] = item;
    }
  }

  return newObj;
}

// 计算滚动到的位置的信息
export function getDOMPosition (list, scrollTop) {
  let tempArr = [];

  for (let i = 0; i < list.length;  i++) {
    let item = list[i];

    tempArr.push({
      key: item.dataset.key,
      offsetTop: item.offsetTop,
      diff: scrollTop - item.offsetTop,
      dom: item
    });
  }

  tempArr = tempArr.filter((item) => {
    return item.diff >= 0;
  });
  
  return tempArr[tempArr.length - 1];
}

// 计算滚动到的位置的高度信息
export function scrollToY (key, list) {
  let obj = {};

  for (let i = 0; i < list.length;  i++) {
    let item = list[i];

    if (item.dataset.key === key) {
      obj = {
        key: item.dataset.key,
        offsetTop: item.offsetTop,
        dom: item
      };

      break;
    }
  }

  return obj;
}

// 查找下标
export function findIndex(song, list) {
  let index = -1;

  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    if (item.id === song.id) {
      index = i;
      break;
    }
  }
  return index;
}

// 插入和删除数据
export function toggleList(song, list = []) {
  let result = [];
  let temp = [];

  if (!song || !song.id) {
    return list;
  }

  result = list.filter((item) => {
    if (item.id === song.id) {
      return true;
    } else {
      temp.push(item);
      return false;
    }
  });

  if (result.length === 0) {
    temp.push(song);
  }

  return temp;
}

// 判断数据存在
export function isExist(song, list = []) {
  let result = [];

  result = list.filter((item) => {
    return item.id === song.id;
  });

  return result.length > 0;
}