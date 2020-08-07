import axios from 'axios';
import { host_url } from "./config";

const debug = process.env.NODE_ENV !== 'production';

export function getSingerList() {
  const url = debug ? '/api/singer/list' : `${host_url}/api/singer/list`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}

export function getSingerDetail(singerId) {
  const url = debug ? `/api/singer/detail/${singerId}` : `${host_url}/api/singer/detail/${singerId}`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}