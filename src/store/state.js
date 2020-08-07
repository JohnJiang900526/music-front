import { playMode } from 'common/js/config'

const state = {
  recommend: {
    slider: [],
    data: []
  },
  singers: [],
  ranks: [],

  playing: false,
  fullScreen: false,
  currentIndex: -1,
  sequenceList: [],
  playlist: [],
  mode: playMode.sequence,
  playHistory: [],
  favoriteList: []
};

export default state;
