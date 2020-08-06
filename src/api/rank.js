import axios from 'axios';
import { host_url } from "./config";

const debug = process.env.NODE_ENV !== 'production';

export function getTopList() {
  const url = debug ? '/api/rank/topList' : `${host_url}/api/rank/topList`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}

export function getMusicList(topid) {
  const url = debug ? '/api/rank/musicList' : `${host_url}/api/rank/musicList`;

  return axios.get(url, {
    params: {
      topid
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  });
}

