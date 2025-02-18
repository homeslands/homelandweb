/* eslint-disable no-underscore-dangle */
/**
 *
 * Profile
 *
 */

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { DataGrid } from '@mui/x-data-grid';

import { getHistoryRevenue } from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import Money from '../App/format';
import './style.scss';
import 'react-toastify/dist/ReactToastify.css';
import makeSelectHistoryRevenue from './selectors';

export function HistoryRevenue(props) {
  useInjectReducer({ key: 'historyRevenue', reducer });
  useInjectSaga({ key: 'historyRevenue', saga });

  const { id = '' } = useParams();

  useEffect(() => {
    if (id) {
      props.getHistoryRevenue(id);
    }
  }, []);
  const { historyRevenue = [] } = props.historyRevenue;

  const columns = [
    {
      field: 'time',
      headerName: <FormattedMessage {...messages.time} />,
      width: 200,
    },
    {
      field: 'type',
      headerName: <FormattedMessage {...messages.type} />,
      width: 200,
      editable: true,
      renderCell: params => {
        const type = params.value;
        const amountClass =
          type === 'recharge' ? 'amount-positive' : 'amount-negative';
        return <span className={amountClass}>{type}</span>;
      },
    },
    {
      field: 'amountChange',
      headerName: <FormattedMessage {...messages.amount} />,
      width: 200,
      editable: true,
      renderCell: params => {
        const amountChange = params.value;
        const amountClass = amountChange.startsWith('+')
          ? 'amount-positive'
          : 'amount-negative';
        return <span className={amountClass}>{amountChange}</span>;
      },
    },
    {
      field: 'currentAmount',
      headerName: <FormattedMessage {...messages.currentAmount} />,
      width: 300,
    },
    {
      field: 'nameIncome',
      headerName: <FormattedMessage {...messages.nameIncome} />,
      width: 300,
    },
    {
      field: 'bankName',
      headerName: <FormattedMessage {...messages.bankName} />,
      width: 150,
    },
    {
      field: 'accountIncome',
      headerName: <FormattedMessage {...messages.accountIncome} />,
      width: 250,
    },
  ];

  // Loại bỏ các đối tượng không có _id
  let totalRecharge = 0;
  let totalWithdraw = 0;
  const rows = historyRevenue
    .filter(item => item && item._id)
    .map(item => {
      if (item.type === 'recharge') {
        totalRecharge += item.amountChange;
      } else if (item.type === 'withdraw') {
        totalWithdraw += item.amountChange;
      }

      return {
        id: item._id,
        type: item.type,
        nameIncome: item.bankInCome ? item.bankInCome.nameTk : 'N/A',
        bankName: item.bankInCome ? item.bankInCome.bank : 'N/A',
        accountIncome: item.bankInCome ? item.bankInCome.stk : 'N/A',
        amountChange:
          item.type === 'recharge'
            ? `+ ${Money(item.amountChange)}`
            : `- ${Money(item.amountChange)}`,
        currentAmount: Money(item.currentAmount),
        time: new Date(item.time).toLocaleString('vi-VN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }),
      };
    });

    console.log({totalRecharge})
    console.log({totalWithdraw})
    // .map(item => ({
    //   id: item._id,
    //   type: item.type,
    //   nameIncome: item.bankInCome ? item.bankInCome.nameTk : 'N/A',
    //   bankName: item.bankInCome ? item.bankInCome.bank : 'N/A',
    //   accountIncome: item.bankInCome ? item.bankInCome.stk : 'N/A',
    //   amountChange:
    //     item.type === 'recharge'
    //       ? `+ ${Money(item.amountChange)}`
    //       : `- ${Money(item.amountChange)}`,
    //   currentAmount: Money(item.currentAmount),
    //   time: new Date(item.time).toLocaleString('vi-VN', {
    //     year: 'numeric',
    //     month: 'numeric',
    //     day: 'numeric',
    //     hour: 'numeric',
    //     minute: 'numeric',
    //     second: 'numeric',
    //   }),
    // }));

  return (
    <div className="user-notification-wrapper container">
      <Helmet>
        <title>History Revenue</title>
        <meta name="description" content="Description of History Revenue" />
      </Helmet>
      <div className="user-notification">
        <div className="notification-container">
          <div className="notification-title">
            <FormattedMessage {...messages.header} />
          </div>
          <div className="synthetic">
            <div className="synthetic-recharge">
              <div className="recharge-title">
                <FormattedMessage {...messages.rechargeTotal} />
              </div>
              {Money(totalRecharge)} (VNĐ)
            </div>
            <div className="synthetic-withdraw">
              <div className="withdraw-title">
                <FormattedMessage {...messages.withdrawTotal} />
              </div>
              {Money(totalWithdraw)} (VNĐ)
            </div>
          </div>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </div>
    </div>
  );
}

HistoryRevenue.propTypes = {
  historyRevenue: PropTypes.object.isRequired,
  getHistoryRevenue: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  historyRevenue: makeSelectHistoryRevenue(),
});

function mapDispatchToProps(dispatch) {
  return {
    getHistoryRevenue: id => {
      dispatch(getHistoryRevenue(id));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HistoryRevenue);
