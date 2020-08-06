import storage from 'good-storage';

const tag = "__music_app_";

const search_tag = `${ tag }search`;

// 保存历史记录
export function SearchSave (str) {
  let result = getSearch() || [];

  result = result.filter((item) => {
    return item !== str;
  });

  result.push(str);

  storage.set(search_tag, result);
}

// 删除历史记录
export function SearchDelete (str) {
  let result = getSearch() || [];

  result = result.filter((item) => {
    return item !== str;
  });

  storage.set(search_tag, result);
}

// 删除所有历史记录
export function SearchClear () {
  storage.remove(search_tag);
}

// 删除所有历史记录
export function getSearch () {
  return storage.get(search_tag);
}

