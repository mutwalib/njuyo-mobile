import api from "../../services/api/api"
import {Property} from '../../models/property';
import GlobalState from '../GlobalState';
import propertyReducer, {initialState} from './PropertyReducer';
import { ADD_PROPERTY } from './types';

const createProperty =
  ({property, files}) =>
  async dispatch => {
    try {
      const response = await api.post(`/property/create`, {
        ...property,
        ...files,
      });
      const propert = new Property(
        response.data,
        property.bookStatus,
        property.adminLockStatus,
        property.currency,
        property.isApproved,
        property.transactionType,
        property.rental,
        property.sale,
        property.residence,
        property.pics,
        property.latitude,
        property.longitude,
        property.ownerId,
        property.villageId,
      );
      dispatch({type: ADD_PROPERTY, payload: propert});
    } catch (err) {
      throw err;
    }
  };
export const {Context, Provider} = GlobalState(propertyReducer, initialState, {
  createProperty,
});
