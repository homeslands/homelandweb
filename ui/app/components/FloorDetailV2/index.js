/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/**
 *
 * FloorDetailV2
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import localStore from 'local-storage';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Add } from '@material-ui/icons';
import queryString from 'query-string';
import { urlLink } from '../../helper/route';
import messages from './messages';
import Room from '../Room';
import './style.scss';

function FloorDetailV2(props) {
  const { floors = [] } = props.motelDetail.motel;
  const location = useLocation();
  const [index, setIndex] = useState(() => {
    const params = queryString.parse(location.search);
    return params.floor || '0';
  });
  const [listRoom, setListRoom] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const isEdit = () => {
    if (!localStore.get('user')) return false;
    if (props.owner === localStore.get('user')._id) return true;
    return localStore.get('user').role.length === 1;
  };

  const isHost = () => {
    if (localStore.get('user') && localStore.get('user').role) {
      if (localStore.get('user').role.length) {
        return localStore.get('user').role.includes('host');
      }
    }
    return false;
  };

  // Effect to update the URL when index changes
  useEffect(() => {
    // Get the current URL
    const currentURL = new URL(window.location.href);

    // Insert the key into the URL
    currentURL.searchParams.set('floor', index);

    // Update the URL without triggering a page reload
    window.history.pushState({ path: currentURL.href }, '', currentURL.href);

    getAllRooms();
  }, [index, props.idMotel]); // Run this effect whenever 'index' changes

  const getAllRooms = async () => {
    try {
      setLoading(true);
      const url = `${urlLink.api.serverUrl +
        urlLink.api.motelDetailOneFloor +
        props.idMotel}/${index}`;
      const response = await axios.get(url);
      setListRoom(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="floor-detail-wrapper">
      {loading && <div className="loading-overlay" />}
      <div className="topnav">
        {floors.map((_item, key) => {
          const keyStr = key.toString();
          return (
            <div
              key={key}
              className={ClassNames('item', { active: index === keyStr })}
              onClick={() => {
                if (index !== keyStr) {
                  setIndex(keyStr);
                }
              }}
            >
              <FormattedMessage {...messages.Floor} /> {key + 1}
            </div>
          );
        })}
      </div>
      <div className="room-list">
        {isHost() && (
          <button
            className={ClassNames('button-add')}
            hidden={!isEdit()}
            onClick={() => {
              history.push(`/createroom/${floors[index]}`);
            }}
          >
            <Add className="add-icon" />
            <FormattedMessage {...messages.addRoom} />
          </button>
        )}
        <div className="room-wrapper">
          <div className={ClassNames('room-container')}>
            {listRoom &&
              listRoom.length > 0 &&
              listRoom.map((item, key) => (
                <Room
                  key={key}
                  isHost={isHost()}
                  isEdit={isEdit()}
                  item={item}
                  status={props.status}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

FloorDetailV2.propTypes = {
  motelDetail: PropTypes.object,
  idMotel: PropTypes.string.isRequired,
  owner: PropTypes.object,
  status: PropTypes.string,
};

export default FloorDetailV2;
