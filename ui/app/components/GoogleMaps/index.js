/* eslint-disable react/no-array-index-key */
/**
 *
 * GoogleMaps
 *
 */

import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import './style.scss';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import MarkerPrice from '../MarkerPrice';

const GoogleMaps = compose(
  withScriptjs,
  withGoogleMap,
)(props => {
  const { location = {}, motels = [], setMotel } = props;

  return (
    <GoogleMap defaultZoom={12} defaultCenter={location} center={location}>
      <Marker position={location} />
      {motels.map((item, key) => (
        <MarkerPrice item={item} key={key} setMotel={setMotel} />
      ))}
    </GoogleMap>
  );
});

GoogleMaps.propTypes = {
  location: PropTypes.object.isRequired,
  motels: PropTypes.array.isRequired,
  setMotel: PropTypes.func.isRequired,
};
export default GoogleMaps;
