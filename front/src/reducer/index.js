import { combineReducers } from 'redux';
import post from './post';
import member from './member';

const rootReducer = combineReducers({
  post,
  member,
});

export default rootReducer;
