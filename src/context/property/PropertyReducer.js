import {
  ADD_PROPERTY,
  DELETE_PROPERTY,
  EDIT_PROPERTY,
  SET_PROPERTY,
} from './types';

export const initialState = {
  properties: [],
  rentals: [],
  hotels: [],
  hostels: [],
  houses: [],
  land: [],
  userProperties: [],
};
const propertyReducer = (state, {type, payload}) => {
  switch (type) {
    case SET_PROPERTY: {
      return {
        ...state,
      };
    }

    case SET_ERROR_MESSAGE: {
      return {...state, error: payload};
    }

    case DELETE_PROPERTY: {
      return {
        ...state,
      };
    }

    case ADD_PROPERTY: {
      return {
        ...state,
      };
    }

    case EDIT_PROPERTY: {
      {
      }
    }
  }
};
export default propertyReducer;
