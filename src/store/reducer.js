import * as Types from './action-types';
import defaultState from "./state";
import { shuffle, findIndex, toggleList, insertList } from "common/js/util";
import { playMode } from "common/js/config";

export default (state = defaultState, action) => {
  let newState = Object.assign({}, state);
  let { mode, sequenceList, currentIndex } = newState;

  switch (action.type) {
    case Types.RECOMMEND:
      newState.recommend = Object.assign({}, action.value);
      return newState;
    case Types.SINGER:
      newState.singers = [...action.value];
      return newState;
    case Types.RANKS:
      newState.ranks = [...action.value];
      return newState;
    case Types.FULLSCREEN:
      newState.fullScreen = action.value;
      return newState;
    case Types.SEQUENCELIST:
      newState.sequenceList = action.value;
      if (mode === playMode.random) {
        newState.playlist = shuffle(action.value);
      } else {
        newState.playlist = action.value;
      }
      return newState;
    case Types.PLAYLIST:
      newState.playlist = action.value;
      return newState;
    case Types.CURRENTINDEX:
      newState.currentIndex = action.value;
      return newState;
    case Types.MODE:
      if (action.value === playMode.random) {
        const playlist = shuffle(sequenceList);
        const song = sequenceList[currentIndex];

        currentIndex = findIndex(song, playlist);
        newState.playlist = playlist;
        newState.currentIndex = currentIndex;
      } else {
        const playlist = newState.playlist;
        const song = playlist[currentIndex];

        currentIndex = findIndex(song, sequenceList);
        newState.playlist = sequenceList;
        newState.currentIndex = currentIndex;
      }
      newState.mode = action.value;
      return newState;
    case Types.PLAYING:
      newState.playing = action.value;
      return newState;
    case Types.PLAYHISTORY:
      newState.playHistory = insertList(action.value, newState.playHistory);
      return newState;
    case Types.FAVORITELIST:
      newState.favoriteList = toggleList(action.value, newState.favoriteList);
      return newState;
    default:
      return state;
  }
};

