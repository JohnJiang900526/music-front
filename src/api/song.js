import axios from 'axios';
import { host_url } from "./config";
import { getUid } from 'common/js/uid'

const debug = process.env.NODE_ENV !== 'production';

// 获取歌曲链接
export function getPurlUrl(songs) {
  const url = debug ? '/api/song/getPurlUrl' : `${host_url}/api/song/getPurlUrl`;
  const result = [];

  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid);
    types.push(0);
  });

  const urlMid = genUrlMid(mids, types);

  return axios.post(url, { url_mid: urlMid }).then(({ data = {} }) => {
    if (data.code === 0) {
      let { midurlinfo = [] } = data.data;
      midurlinfo.forEach((info, index) => {
        if (info.purl) {
          let song = songs[index];

          song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`;
          result.push(song);
        }
      });
      data.data.songs = [...result];
    } else {
      data.data.songs = [];
    }

    return Promise.resolve(data)
  });
}

// 获取歌词
export function getLyric(songmid) {
  const url = debug ? '/api/song/getLyric' : `${host_url}/api/song/getLyric`;
  const params = { songmid };

  return axios.get(url, { params }).then(({data = {}}) => {
    return Promise.resolve(data);
  });
}

function genUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: "CgiGetVkey",
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
