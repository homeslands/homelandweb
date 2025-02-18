/* eslint-disable no-console */
/**
 *
 * MarkerPrice
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import './style.scss';
import { OverlayView } from 'react-google-maps';
import localStore from 'local-storage';
import { Button } from 'reactstrap';
import { LocationOn, Phone, AccountBalanceWallet } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import messages from '../../containers/MapsPage/messages';
import Money from '../../containers/App/format';
import { isHost } from '../../utils/auth';

function MarkerPrice(props) {
  const [isOpen] = useState(false);
  const currentUser = localStore.get('user');
  const { item } = props;
  const listReview = JSON.parse(localStorage.getItem('listReview'));
  const [backgroundColor, setBackgroundColor] = useState('green');
  const history = useHistory();

  const handleClick = () => {
    if (listReview) {
      if (!listReview.includes(item)) {
        localStore.set('listReview', [...listReview, item._id]);
      }
    } else {
      localStore.set('listReview', [item._id]);
    }
    setBackgroundColor('grey');
  };

  useEffect(() => {
    /* eslint no-underscore-dangle: 0 */
    if (listReview && listReview.includes(item._id)) {
      setBackgroundColor('grey');
    } else if (item.availableRoom > 0) {
      setBackgroundColor('green');
    } else if (item.depositedRoom > 0) {
      setBackgroundColor('orange');
    } else {
      setBackgroundColor('red');
    }
  }, [listReview]);

  useEffect(() => {
    const place = 'Ho Chi Minh, Vietnam'; // Replace with the province/state you are searching for
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      place,
    )}&types=(regions)&key=AIzaSyCVwwlv1Q3FKlJUZTV-ab5hknaivIDv87o`;

    fetch(autocompleteUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK' && data.predictions.length > 0) {
          const placeId = data.predictions[0].place_id;
          console.log('Place ID:', placeId);

          // Proceed to get place details using the place ID
          getPlaceDetails(placeId);
        } else {
          console.error('Autocomplete API error:', data.status);
        }
      })
      .catch(error => {
        console.error('Request failed', error);
      });
  }, []);

  function getPlaceDetails(placeId) {
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyCVwwlv1Q3FKlJUZTV-ab5hknaivIDv87o`;

    fetch(placeDetailsUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK') {
          const { result } = data;

          // Extract relevant information
          const provinceName = result.name;
          const provinceId = result.place_id; // This will be used as the unique identifier

          console.log('Province/State Name:', provinceName);
          console.log('Unique Province/State ID:', provinceId);
        } else {
          console.error('Place Details API error:', data.status);
        }
      })
      .catch(error => {
        console.error('Request failed', error);
      });
  }

  return (
    <OverlayView
      position={item.address.location}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div>
        <div
          id={`motel-tooltip-${item._id}`}
          className="marker-price-wrapper"
          style={{ color: backgroundColor }}
          role="presentation"
        >
          <div
            className="marker-price"
            style={{ backgroundColor }}
            title={item.description}
            role="presentation"
          >
            {Money(item.minPrice)}
          </div>
        </div>
        <Tooltip
          opacity={1}
          anchorSelect={`#motel-tooltip-${item._id}`}
          className="motel_tooltip"
          clickable
        >
          <div className="motel__info">
            <div className="motel__info-image">
              <img className="image" src={item.images} alt="motel" />
            </div>
            <div className="motel__info-content">
              <div className="motel__info-name">{item.name}</div>
              <div className="motel__info-address">
                <LocationOn className="address-icon" />
                {item.address.address}
              </div>
              <div className="motel__info-phone">
                <Phone className="phone-icon" />
                {item.contactPhone}
              </div>
              <div className="motel__info-range-price">
                <AccountBalanceWallet />
                {Money(item.minPrice || 0)} - {Money(item.maxPrice || 0)} đ
              </div>
              {isHost(currentUser) ? (
                <Button
                  type="button"
                  className="motel__info-detail-button"
                  color="primary"
                  onClick={() => {
                    history.push(`/motel/${item._id}`);
                    handleClick();
                  }}
                >
                  <FormattedMessage {...messages.Detail} />
                </Button>
              ) : (
                <Button
                  type="button"
                  color="primary"
                  className="motel__info-detail-button"
                  onClick={() => {
                    history.push(`/motel-detail-v2/${item._id}`);
                    handleClick();
                  }}
                >
                  <FormattedMessage {...messages.Detail} />
                </Button>
              )}
            </div>
          </div>
        </Tooltip>
      </div>
    </OverlayView>
  );
}

MarkerPrice.propTypes = {
  item: PropTypes.object.isRequired,
  setMotel: PropTypes.func.isRequired,
};

export default MarkerPrice;
