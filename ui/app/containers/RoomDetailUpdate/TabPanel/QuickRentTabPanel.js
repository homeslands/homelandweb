/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
} from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { QuickRentForm, UploadQuickRentForm } from '../Forms';

export function QuickRentTabPanel({
  room,
  bankInfo,
  onQuickRent,
  uploadQuickRent,
}) {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={`${activeTab === '1' ? 'active' : ''}`}
            onClick={() => setActiveTab('1')}
          >
            Thuê nhanh phòng {!_.isEmpty(room) && room.name}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => setActiveTab('2')}
            className={`${activeTab === '2' ? 'active' : ''}`}
          >
            Thuê nhanh hàng loạt
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <QuickRentForm
                bankInfo={bankInfo}
                room={room}
                onQuickRent={onQuickRent}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <UploadQuickRentForm
            bankInfo={bankInfo}
            uploadQuickRent={uploadQuickRent}
          />
        </TabPane>
      </TabContent>
    </div>
  );
}

QuickRentTabPanel.propTypes = {
  room: PropTypes.object.isRequired,
  bankInfo: PropTypes.object.isRequired,
  onQuickRent: PropTypes.func.isRequired,
  uploadQuickRent: PropTypes.func.isRequired,
};
