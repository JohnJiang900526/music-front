import * as Types from './action-types';

export const handleRecommend = (value) => ({
  type: Types.RECOMMEND,
  value
});

export const handleSingers = (value) => ({
  type: Types.SINGER,
  value
});

export const handleRanks = (value) => ({
  type: Types.RANKS,
  value
});

export const handleFullScreen = (value) => ({
  type: Types.FULLSCREEN,
  value
});

export const handleCurrentIndex = (value) => ({
  type: Types.CURRENTINDEX,
  value
});

export const handleSequenceList = (value) => ({
  type: Types.SEQUENCELIST,
  value
});

export const handlePlaylist = (value) => ({
  type: Types.PLAYLIST,
  value
});

export const handleMode = (value) => ({
  type: Types.MODE,
  value
});

export const handlePlaying = (value) =>({
  type: Types.PLAYING,
  value
});
