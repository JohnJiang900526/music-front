import axios from 'axios';
import { host_url } from "./config";

const debug = process.env.NODE_ENV !== 'production';

export function getHotKey() {
  const url = debug ? '/api/search/hotKey' : `${host_url}/api/search/hotKey`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}

export function search(query, page, zhida, perpage) {
  const url = debug ? '/api/search' : `${host_url}/api/search`;
  const params = { query, page, zhida, perpage };

  return axios.get(url, { params }).then((res) => {
    return Promise.resolve(res.data)
  });
}
