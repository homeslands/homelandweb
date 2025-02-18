/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Row,
} from 'reactstrap';
import { FilterList } from '@material-ui/icons';

import messages from '../messages';
import { utilitiesData } from '../mockData';
import CheckBox from '../../CheckBox';

function FilterModal() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  return (
    <>
      <div onClick={toggle}>
        <FilterList className="" />
      </div>
      <Modal isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle}>Title</ModalHeader>
        <ModalBody>
          <div>
            {/* <Select
            placeholder="Chọn vị trí"
            options={vietnamProvinces}
            onChange={selectedOption => {
              setAddress(selectedOption.label);
            }}
          /> */}
            <span style={{ fontSize: '22px', fontWeight: '600' }}>
              <FormattedMessage {...messages.utilities} />
            </span>
            <Row style={{ marginTop: '10px' }}>
              {utilitiesData.map(item => (
                <Col xs={6} md={4}>
                  <CheckBox
                    label={item.label}
                    onChange={e => {
                      // const index = utilities.indexOf('wifi');
                      // if (e.target.checked) {
                      //   if (index === -1) {
                      //     const newArr = [...utilities];
                      //     newArr.push('wifi');
                      //     setUtilities(newArr);
                      //   }
                      // } else if (index !== -1) {
                      //   const newArr = [...utilities];
                      //   newArr.splice(index, 1);
                      //   setUtilities(newArr);
                      // }
                    }}
                  />
                </Col>
              ))}
            </Row>
            <span style={{ fontSize: '22px', fontWeight: '600' }}>
              <FormattedMessage {...messages.priceRange} />
            </span>
            <Row
              style={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              {/* <Col xs={4} sm={2} md={3} lg={3}>
              {
                <FormattedMessage {...messages.MinPrice}>
                  {msg => (
                    <InputBase
                      autoComplete={{}}
                      placeholder={msg}
                      value={minPrice}
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      inputProps={{ 'aria-label': 'search' }}
                      onChange={e => {
                        // handleSearchTermChange(e);
                        setMinPrice(e.target.value);
                      }}
                      className="HanbleSearch"
                      // onFocus={onSearch}
                    />
                  )}
                </FormattedMessage>
              }
            </Col>
            <Col xs={4} sm={2} md={3} lg={3}>
              {
                <FormattedMessage {...messages.MaxPrice}>
                  {msg => (
                    <InputBase
                      autoComplete={{}}
                      placeholder={msg}
                      value={maxPrice}
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      inputProps={{ 'aria-label': 'search' }}
                      onChange={e => {
                        // handleSearchTermChange(e);
                        setMaxPrice(e.target.value);
                      }}
                      className="HanbleSearch"
                      // onFocus={onSearch}
                    />
                  )}
                </FormattedMessage>
              }
            </Col> */}
            </Row>
          </div>
        </ModalBody>
        <ModalFooter>
          <div>
            <Button color="secondary" onClick={toggle}>
              <FormattedMessage {...messages.Cancel} />
            </Button>{' '}
            <Button onClick={toggle} color="primary">
              <FormattedMessage {...messages.Accept} />
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}

export { FilterModal };
