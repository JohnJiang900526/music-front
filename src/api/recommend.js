import axios from 'axios';
import { host_url } from "./config";
const debug = process.env.NODE_ENV !== 'production';

// 获取推荐数据数据
export function getRecommend() {
  const url = debug ? '/api/recommend' : `${host_url}/api/recommend`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}

// 获取单个热门歌曲的详细数据
export function getCdInfo(disstid) {
  const url = debug ? '/api/recommend/getCdInfo' : `${host_url}/api/recommend/getCdInfo`;
  const params = {
    disstid
  };

  return axios.get(url, { params }).then((res) => {
    return Promise.resolve(res.data)
  });
}

