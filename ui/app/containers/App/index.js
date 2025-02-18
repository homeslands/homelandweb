/**
 *
 * App
 *
 */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';
import localStore from 'local-storage';
import { FormattedMessage } from 'react-intl';
import { ToastContainer } from 'react-toastify';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { WarningOutlined } from '@material-ui/icons';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';

import AddMoney from 'containers/AddMoney/Loadable';
import Auth from 'containers/Auth/Loadable';
import ChangePassword from 'containers/ChangePassword/Loadable';
import CreateMotel from 'containers/CreateMotel/Loadable';
import CreateRoom from 'containers/CreateRoom/Loadable';
import HistoryFloorsRoomHost from 'containers/HistoryFloorsRoomHost/Loadable';
import HistoryRoomHostDetail from 'containers/HistoryFloorsRoomHostDetail/Loadable';
import HistoryRoomHost from 'containers/HistoryRoomHost/Loadable';
import HistoryRevenue from 'containers/HistoryRevenue/Loadable';
import HistoryRoomHostAdmin from 'containers/HistoryRoomHostAdmin/Loadable';
import HostMotelRoom from 'containers/HostMotelRoom/Loadable';
import HostMotelRoomDetail from 'containers/HostMotelRoomDetail/Loadable';
import HostMotelRoomDetailUser from 'containers/HostMotelRoomDetailUser/Loadable';
import HostRevenue from 'containers/HostRevenue/Loadable';
import ProcessWithdrawAdmin from 'containers/ProcessWithdrawAdmin/Loadable';
import HistoryEnergyUser from 'containers/HistoryEnergyUser/Loadable';
import HistoryEnergyHost from 'containers/HistoryEnergyHost/Loadable';
import BillList from 'containers/BillList/Loadable';
import BillListAdmin from 'containers/BillListAdmin/Loadable';
import Job from 'containers/Job/Loadable';
import MapsPage from 'containers/MapsPage/Loadable';
import Motel from 'containers/Motel/Loadable';
import MotelDetail from 'containers/MotelDetail/Loadable';
import MotelDetailV2 from 'containers/MotelDetailV2/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import OrderDetail from 'containers/OrderDetail/Loadable';
import OrderList from 'containers/OrderList/Loadable';
import OrderListHost from 'containers/OrderListHost/Loadable';
import OrderPay from 'containers/OrderPay/Loadable';
import Payment from 'containers/Payment/Loadable';
import PaymentReturn from 'containers/PaymentReturn/Loadable';
import Profile from 'containers/Profile/Loadable';
import ProfileUpdate from 'containers/ProfileUpdate/Loadable';
import ReportProblem from 'containers/ReportProblem/Loadable';
import ReportProblemList from 'containers/ReportProblemList/Loadable';
import ReportProblemListAdmin from 'containers/ReportProblemListAdmin/Loadable';
import RoomDetail from 'containers/RoomDetail/Loadable';
import RoomDetailUpdate from 'containers/RoomDetailUpdate/Loadable';
import RoomDetailUpdateAdmin from 'containers/RoomDetailUpdateAdmin/Loadable';
import TransactionLog from 'containers/TransactionLog/Loadable';
import TransactionPayMentList from 'containers/TransactionPayMentList/Loadable';
import TransactionPayMentListHost from 'containers/TransactionPayMentListHost/Loadable';
import TransactionPayMentUserList from 'containers/TransactionPayMentUserList/Loadable';
import UpdateMotel from 'containers/UpdateMotel/Loadable';
import UpdateRoom from 'containers/UpdateRoom/Loadable';
import EnergyBillingManage from 'containers/EnergyBillingManage/Loadable';
import RoomManagePage from 'containers/EnergyBillingManage/RoomManage/Loadable';
import RoomBillingManage from 'containers/EnergyBillingManage/RoomBillingManage/Loadable';
import EnergyRoomsBillUser from 'containers/EnergyRoomsBillUser/Loadable';
import MonthlyOrderList from 'containers/MonthlyOrderList/Loadable';
import ManagerPayDepositHost from 'containers/ManagerPayDepositHost/Loadable';
import ManagerPayDepositUser from 'containers/ManagerPayDepositUser/Loadable';
import ListOrderNoPayOfPayDeposit from 'containers/ListOrderNoPayOfPayDeposit/Loadable';
import HistoryDepositAfterCheckInCost from 'containers/HistoryDepositAfterCheckInCost/Loadable';
import OrderDepositRoomListByMotel from 'containers/OrderDepositRoomListByMotel/Loadable';
import OrderMonthlyRoomListByMotel from 'containers/OrderMonthlyRoomListByMotel/Loadable';
import HistoryMonthly from 'containers/HistoryMonthly/Loadable';
import ManageDeposit from 'containers/ManageDeposit/Loadable';
import ManageMonthly from 'containers/ManageMonthly/Loadable';
import ManagerAcceptMonthlyHost from 'containers/ManagerAcceptMonthlyHost/Loadable';
import OrderMonthlyPendingPayment from 'containers/OrderMonthlyPendingPayment/Loadable';
import ManagerEnergyRooms from 'containers/ManagerEnergyRooms/Loadable';
import ManagerEnergyBuildings from 'containers/ManagerEnergyBuildings/Loadable';
import EnergyDetail from 'containers/EnergyDetail/Loadable';
import ScadaElectricEMS from 'containers/ScadaElectricEMS/Loadable';
import FollowEnergyAdmin from 'containers/FollowEnergyAdmin/Loadable';
import FollowEnergyHost from 'containers/FollowEnergyHost/Loadable';
import FollowEnergyUser2 from 'containers/FollowEnergyUser2/Loadable';
import FollowEnergyUser from 'containers/FollowEnergyUser/Loadable';
import Withdraw from 'containers/Withdraw/Loadable';
import RequestWithdrawUserList from 'containers/RequestWithdrawUserList/Loadable';
import RequestWithdrawList from 'containers/RequestWithdrawList/Loadable';
import ManagerEnergyBuildingsHost from 'containers/ManagerEnergyBuildingsHost/Loadable';
import ManagerEnergyRoomsHost from 'containers/ManagerEnergyRoomsHost/Loadable';
import ManagerEnergyBuildingSummaryReport from 'containers/ManagerEnergyBuildingSummaryReport/Loadable';
import ManagerEnergyRoomsUser from 'containers/ManagerEnergyRoomsUser/Loadable';
import ManagerAcceptDepositHost from 'containers/ManagerAcceptDepositHost/Loadable';
import CensorMotels from 'containers/CensorMotels/Loadable';
import CensorHosts from 'containers/CensorHosts/Loadable';
import ManagerAcceptAfterCheckInCostHost from 'containers/ManagerAcceptAfterCheckInCostHost/Loadable';
import OrderDepositAfterCheckInCostPendingPayment from 'containers/OrderDepositAfterCheckInCostPendingPayment/Loadable';

import ManagerEnergyHostAdmin from 'containers/ManagerEnergyHostAdmin/Loadable';
import ManageMotelListAdmin from 'containers/ManageMotelListAdmin/Loadable';
import ManageDepositAdmin from 'containers/ManageDepositAdmin/Loadable';
import ManageMonthlyAdmin from 'containers/ManageMonthlyAdmin/Loadable';
import ManagerEnergyBuildingsAdmin from 'containers/ManagerEnergyBuildingsAdmin/Loadable';
import ManagerEnergyRoomsAdmin from 'containers/ManagerEnergyRoomsAdmin/Loadable';
import TransactionBankingCashLog from 'containers/TransactionBankingCashLog/Loadable';
import OrdersPendingPayUser from 'containers/OrdersPendingPayUser/Loadable';

import About from 'containers/About/Loadable';
import AdminUsers from 'containers/AdminUsers/Loadable';
import AdminUsersDetail from 'containers/AdminUsersDetail/Loadable';
import JobDetail from 'containers/JobDetail/Loadable';
import JobDetailUser from 'containers/JobDetailUser/Loadable';
import JobList from 'containers/JobList/Loadable';
import JobListUser from 'containers/JobListUser/Loadable';
import JobVerify from 'containers/JobVerify/Loadable';
import MoneyInformation from 'containers/MoneyInformation/Loadable';
import MoneyInformationDetail from 'containers/MoneyInformationDetail/Loadable';
import RoomBill from 'containers/RoomBill/Loadable';
import ExportBillRoom from 'containers/ExportBillRoom/Loadable';
import RoomManage from 'containers/RoomManager/Loadable';
import Terms from 'containers/Terms/Loadable';
import Notification from 'containers/Notification/Loadable';

import WithdrawRequestListHost from 'containers/WithdrawRequestListHost/Loadable';
import LoadingIndicator from '../../components/LoadingIndicator';
import Navbar from '../../components/Navbar';
import messages from '../../components/Navbar/messages';
import WarningPopup from '../../components/WarningPopup';
import { changeAppStoreData, getLogout, saveCurrentUser } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectApp from './selectors';
import './style.scss';
import ProtectedRoute from '../../components/ProtectedRoute';

axios.defaults.headers.common.Authorization = `Bearer ${localStore.get(
  'token',
)}`;
export function App(props) {
  useInjectReducer({ key: 'app', reducer });
  useInjectSaga({ key: 'app', saga });

  const { loading, currentUser, showLogout } = props.app;

  useEffect(() => {
    props.saveCurrentUser(localStore.get('user') || {});
  }, []);

  return (
    <div className="app-wrapper">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar
        currentUser={currentUser}
        changeStoreData={props.changeStoreData}
      />
      <Switch>
        <Route exact path="/" render={() => <MapsPage />} />
        <Route path="/auth" component={Auth} />
        <Route path="/motel/:id" component={Motel} />
        <Route path="/motel-detail/:id" component={MotelDetail} />
        <Route path="/motel-detail-v2/:id" component={MotelDetailV2} />
        <Route path="/room-detail/:id" component={RoomDetail} />
        <Route path="/terms" component={Terms} />
        <Route path="/about" component={About} />

        <ProtectedRoute path="/bill-list" component={BillList} />
        <ProtectedRoute path="/report-problem/:id" component={ReportProblem} />
        <ProtectedRoute path="/admin/bill-list" component={BillListAdmin} />
        <ProtectedRoute
          path="/admin/report-problem-list"
          component={ReportProblemListAdmin}
        />
        <ProtectedRoute
          path="/report-problem-list"
          component={ReportProblemList}
        />
        <ProtectedRoute
          path="/room-detail-update-admin/:id"
          component={RoomDetailUpdateAdmin}
        />
        <ProtectedRoute
          path="/room-detail-update/:id"
          component={RoomDetailUpdate}
        />
        <ProtectedRoute path="/create-motel" component={CreateMotel} />
        <ProtectedRoute path="/update-room/:id" component={UpdateRoom} />
        <ProtectedRoute path="/update-motel/:id" component={UpdateMotel} />
        <ProtectedRoute path="/payment" component={Payment} />
        <ProtectedRoute path="/recharge" component={AddMoney} />
        <ProtectedRoute path="/job/:id" component={Job} />
        <ProtectedRoute path="/notifications" component={Notification} />
        <ProtectedRoute path="/roomManage" component={RoomManage} />
        <ProtectedRoute
          path="/job-detail/:id/:idRoom"
          component={JobDetailUser}
        />
        <ProtectedRoute
          path="/job-verify/:id/:idElectricMetter"
          component={JobVerify}
        />
        <ProtectedRoute path="/payment-return" component={PaymentReturn} />
        <ProtectedRoute path="/order-pay/:id" component={OrderPay} />
        <ProtectedRoute path="/admin/users/:id" component={AdminUsersDetail} />
        <ProtectedRoute component={AdminUsers} path="/admin/users" />
        <ProtectedRoute
          path="/money-information/:id"
          component={MoneyInformationDetail}
        />
        <ProtectedRoute
          path="/money-information"
          component={MoneyInformation}
        />
        <ProtectedRoute path="/admin/job/list" component={JobList} />
        <ProtectedRoute
          path="/admin/user/job/list/:id"
          component={JobListUser}
        />
        <ProtectedRoute path="/admin/job/detail/:id" component={JobDetail} />
        <ProtectedRoute path="/admin/order/list" component={OrderList} />
        <ProtectedRoute
          path="/admin/monthly-order/list"
          component={MonthlyOrderList}
        />
        <ProtectedRoute
          path="/monthly-order/list"
          component={MonthlyOrderList}
        />
        <ProtectedRoute path="/order/list" component={OrderListHost} />
        <ProtectedRoute
          path="/host/transaction/list"
          component={TransactionPayMentListHost}
        />
        <ProtectedRoute
          path="/admin/transaction/list"
          component={TransactionPayMentList}
        />
        <ProtectedRoute
          path="/transaction/user/list"
          component={TransactionPayMentUserList}
        />
        <ProtectedRoute
          path="/admin/order/detail/:id"
          component={OrderDetail}
        />
        <ProtectedRoute path="/profile/:id" component={ProfileUpdate} />
        <ProtectedRoute path="/profile" component={Profile} />
        <ProtectedRoute path="/changePassword" component={ChangePassword} />
        <ProtectedRoute
          path="/bill/motel/:id/room/:idroom/user/:idUser"
          component={RoomBill}
        />
        <ProtectedRoute
          path="/exportBillRoom/motel/:id/room/:idroom/user/:idUser"
          component={ExportBillRoom}
        />
        <ProtectedRoute path="/createroom/:id" component={CreateRoom} />
        <ProtectedRoute path="/transactionLog" component={TransactionLog} />
        <ProtectedRoute
          path="/transaction-banking-cash-log"
          component={TransactionBankingCashLog}
        />
        <ProtectedRoute
          path="/orders-pending-pay-user"
          component={OrdersPendingPayUser}
        />
        <ProtectedRoute path="/admin/hostMotelRoom" component={HostMotelRoom} />
        <ProtectedRoute
          path="/hostMotelRoom/:id"
          component={HostMotelRoomDetail}
        />
        <ProtectedRoute
          path="/user/hostMotelRoom"
          component={HostMotelRoomDetailUser}
        />
        <ProtectedRoute path="/user/hostRevenue/:id" component={HostRevenue} />
        <ProtectedRoute path="/admin/hostRevenue/:id" component={HostRevenue} />
        <ProtectedRoute
          path="/admin/withdrawRequest/:userId"
          component={ProcessWithdrawAdmin}
        />
        <ProtectedRoute
          path="/user/history-energy/:id"
          component={HistoryEnergyUser}
        />
        <ProtectedRoute
          path="/history-energy/:id/:name"
          component={HistoryEnergyHost}
        />
        <ProtectedRoute
          path="/historyRoomHost/room/:id/roomdetail/:idroom"
          component={HistoryRoomHostDetail}
        />
        <ProtectedRoute
          path="/historyRoomHost/room/:id"
          component={HistoryFloorsRoomHost}
        />
        <ProtectedRoute path="/historyRoomHost" component={HistoryRoomHost} />
        <ProtectedRoute path="/historyRevenue/:id" component={HistoryRevenue} />
        <ProtectedRoute
          path="/admin/historyRoomHost"
          component={HistoryRoomHostAdmin}
        />
        <ProtectedRoute
          path="/admin/manager-energy-rooms"
          component={ManagerEnergyRooms}
        />
        <ProtectedRoute
          path="/admin/manager-energy-buildings"
          component={ManagerEnergyBuildings}
        />
        <ProtectedRoute
          path="/admin/manager-energy-detail"
          component={EnergyDetail}
        />
        <ProtectedRoute
          path="/admin/scada-electric-ems"
          component={ScadaElectricEMS}
        />
        <ProtectedRoute
          path="/admin/follow-energy/:id/:roomId/:name"
          component={FollowEnergyAdmin}
        />
        <ProtectedRoute
          path="/host/follow-energy/:id/:roomId/:name"
          component={FollowEnergyHost}
        />
        <ProtectedRoute
          path="/follow-energy-2/"
          component={FollowEnergyUser2}
        />
        <ProtectedRoute
          path="/follow-energy/:roomId/:name"
          component={FollowEnergyUser}
        />
        <ProtectedRoute
          path="/manage-deposit/pay-deposit/:id/list-order-no-pay/:idPayDeposit"
          component={ListOrderNoPayOfPayDeposit}
        />
        <ProtectedRoute
          path="/manage-deposit/pay-deposit/:id"
          component={ManagerPayDepositHost}
        />
        <ProtectedRoute
          path="/pay-deposit-user/"
          component={ManagerPayDepositUser}
        />
        <ProtectedRoute
          path="/manage-deposit/history-deposit-aftercheckincost/motel/:idMotel/:nameMotel/room/:idRoom/:nameRoom"
          component={HistoryDepositAfterCheckInCost}
        />
        <ProtectedRoute
          path="/manage-deposit/history-deposit-aftercheckincost/motel/:idMotel/:nameMotel"
          component={OrderDepositRoomListByMotel}
        />
        <ProtectedRoute
          path="/manage-deposit/accept-deposit/:id"
          component={ManagerAcceptDepositHost}
        />
        <ProtectedRoute path="/admin/censor-motels/" component={CensorMotels} />
        <ProtectedRoute path="/admin/censor-hosts/" component={CensorHosts} />
        <ProtectedRoute
          path="/withdraw-request/list/:userId/:motelName"
          component={WithdrawRequestListHost}
        />
        <ProtectedRoute
          path="/manage-deposit/accept-after-check-in-cost/:id"
          component={ManagerAcceptAfterCheckInCostHost}
        />
        <ProtectedRoute
          path="/manage-deposit/order-deposit-pending-payment/:idMotel/:nameMotel"
          component={OrderDepositAfterCheckInCostPendingPayment}
        />
        <ProtectedRoute path="/manage-deposit/" component={ManageDeposit} />
        <ProtectedRoute
          path="/manage-monthly-order/history-monthly/motel/:idMotel/:nameMotel/room/:idRoom/:nameRoom"
          component={HistoryMonthly}
        />
        <ProtectedRoute
          path="/manage-monthly-order/history-monthly/motel/:idMotel/:nameMotel"
          component={OrderMonthlyRoomListByMotel}
        />
        <ProtectedRoute
          path="/manage-monthly-order/manage-order-pending-payment/:idMotel/:nameMotel"
          component={OrderMonthlyPendingPayment}
        />
        <ProtectedRoute
          path="/manage-monthly-order/manage-accept-order/:id"
          component={ManagerAcceptMonthlyHost}
        />
        <ProtectedRoute
          path="/manage-monthly-order/"
          component={ManageMonthly}
        />
        <ProtectedRoute path="/withdraw" component={Withdraw} />
        <ProtectedRoute
          path="/requestWithdraw/user/list"
          component={RequestWithdrawUserList}
        />
        <ProtectedRoute
          path="/admin/requestWithdraw/list"
          component={RequestWithdrawList}
        />
        <ProtectedRoute
          path="/manager-energy-buildings-host"
          component={ManagerEnergyBuildingsHost}
        />
        <ProtectedRoute
          path="/manager-energy-rooms-host/:id/:name"
          component={ManagerEnergyRoomsHost}
        />
        <ProtectedRoute
          path="/manager-energy-building-summary-report/:id/:name"
          component={ManagerEnergyBuildingSummaryReport}
        />
        <ProtectedRoute
          path="/manager-energy-rooms-user"
          component={ManagerEnergyRoomsUser}
        />
        <ProtectedRoute
          path="/admin/manager-energy-host"
          component={ManagerEnergyHostAdmin}
        />
        <ProtectedRoute
          path="/admin/manage-motel-list/:id/:name"
          component={ManageMotelListAdmin}
        />
        <ProtectedRoute
          path="/admin/manage-deposit/:id/:name"
          component={ManageDepositAdmin}
        />
        <ProtectedRoute
          path="/admin/manage-monthly/:id/:name"
          component={ManageMonthlyAdmin}
        />
        <ProtectedRoute
          path="/admin/manager-energy-buildings-host/:id/:name"
          component={ManagerEnergyBuildingsAdmin}
        />
        <ProtectedRoute
          path="/admin/manager-energy-rooms-admin/:id/:name"
          component={ManagerEnergyRoomsAdmin}
        />
        {/* Enegy billing manage */}
        <ProtectedRoute
          path="/energy-billing-manage/:id/rooms/:roomId"
          component={RoomBillingManage}
        />
        <ProtectedRoute
          path="/energy-rooms-bill-user"
          component={EnergyRoomsBillUser}
        />
        <ProtectedRoute
          path="/energy-billing-manage/:id/rooms"
          component={RoomManagePage}
        />
        <ProtectedRoute
          path="/energy-billing-manage"
          component={EnergyBillingManage}
        />
        <ProtectedRoute component={NotFoundPage} />
      </Switch>
      {loading && <LoadingIndicator />}
      <WarningPopup
        visible={showLogout}
        content={
          <div className="logout-content">
            <WarningOutlined className="icon" />
            <FormattedMessage {...messages.question_logout} />
          </div>
        }
        callBack={() => props.getLogout()}
        toggle={() => {
          props.changeStoreData('showLogout', false);
        }}
      />
    </div>
  );
}

App.propTypes = {
  getLogout: PropTypes.func,
  saveCurrentUser: PropTypes.func,
  changeStoreData: PropTypes.func,
  app: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    getLogout: () => {
      dispatch(getLogout());
    },
    saveCurrentUser: user => {
      dispatch(saveCurrentUser(user));
    },
    changeStoreData(key, value) {
      dispatch(changeAppStoreData(key, value));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(App);
