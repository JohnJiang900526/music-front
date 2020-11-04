const debug = process.env.NODE_ENV === "development";

export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback',
  prefix: 'jp'
}

export const ERR_OK = 0;

export const host_url = debug ? "http://127.0.0.1:3001": "";

