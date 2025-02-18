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

import { QuickDepositForm, UploadQuickDepositForm } from '../Forms';

export function QuickDepositTabPanel({
  room,
  bankInfo,
  onQuickDeposit,
  onUploadQuickDeposit,
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
            Đặt cọc phòng {!_.isEmpty(room) && room.name}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => setActiveTab('2')}
            className={`${activeTab === '2' ? 'active' : ''}`}
          >
            Đặt cọc hàng loạt
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <QuickDepositForm
                bankInfo={bankInfo}
                room={room}
                onQuickDeposit={onQuickDeposit}
              />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <UploadQuickDepositForm
            bankInfo={bankInfo}
            onUploadQuickDeposit={onUploadQuickDeposit}
          />
        </TabPane>
      </TabContent>
    </div>
  );
}

QuickDepositTabPanel.propTypes = {
  room: PropTypes.object.isRequired,
  bankInfo: PropTypes.object.isRequired,
  onQuickDeposit: PropTypes.func.isRequired,
  onUploadQuickDeposit: PropTypes.func.isRequired,
};
