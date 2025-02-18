/**
 *
 * HostMotelRoom
 *
 */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useParams , useHistory } from 'react-router-dom';
import localStore from 'local-storage';
import {
  Row,
  Col,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import * as XLSX from 'xlsx-color';
import { MonetizationOn, Payment } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import axios from 'axios';


import { getListRoom, getHostRevenue, postWithdraw } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectHostMotelRoomDetailUser, {
  makeSelectHostRevenue,
  makeSelectWithdraw,
} from './selectors';
import './style.scss';
import LineChart from '../../components/LineChartRevenue';
import LineChartElectric from '../../components/LineChartElectric';
import ModalComponent from './modal';
import { urlLink } from '../../helper/route';
import Money from '../App/format';
import messages from './messages';

export function HostMotelRoomDetailUser(props) {
  useInjectReducer({ key: 'hostMotelRoomDetailUser', reducer });
  useInjectSaga({ key: 'hostMotelRoomDetailUser', saga });
  const history = useHistory();
  const { listRoom = [] } = props.hostMotelRoomDetailUser;
  const { hostRevenue } = props.hostMotelRoomDetailUser;
  const currentUser = localStore.get('user') || {};
  const { role = [] } = currentUser;
  console.log({currentUser})
  let totalRevenue = 0;
  let remainingRevenue = 0;

  if (hostRevenue) {
    totalRevenue = hostRevenue.totalRevenueAllOfYear; //Tổng tất cả tiền
    remainingRevenue = hostRevenue.remainingRevenueAllMotel; //Tiền còn lại sau khi admin phê duyệt request rút tiền của host
  }

  // Define the formatter
  const vndFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const { id = '' } = useParams();
  useEffect(() => {
    const data = {
      id,
    };
    props.getListRoom(data);
  }, []);
  const roomEntries = Object.entries(listRoom);

  // Extract the motels object from roomEntries
  const motelsEntry = roomEntries.find(([key]) => key === 'motels');
  const motels = motelsEntry ? motelsEntry[1] : {};

  // Convert motels object to array of [key, value] pairs
  const motelsArray = Object.entries(motels);
  const [isOpen, setIsOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedBuilding, setSelectedBuilding] = useState('Chọn tòa nhà');
  const [motelId, setMotelId] = useState('');
  const [modal, setModal] = useState(false);
  const [bankData, setBankData] = useState({});
  const [selectedBank, setSelectedBank] = useState('');

  const years = ['Chọn năm'];
  for (let i = 2000; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }

  const handleSelectBuilding = (value, key) => {
    setMotelId(value);
    setSelectedBuilding(key);
    setIsOpen(false);
  };

  const handleFilter = () => {
    if (selectedBuilding === 'Chọn tòa nhà') {
      toast.error('Vui lòng chọn tòa nhà và tháng cần xem doanh thu');
      return;
    }

    const data = {
      selectedBuilding: motelId,
      selectedYear: selectedYear,
    };

    props.getHostRevenue(data);
  };

  let currentRevenueMonthTotal = 0;

  if (hostRevenue) {
    // eslint-disable-next-line prefer-destructuring
    currentRevenueMonthTotal = hostRevenue.currentRevenueMonthTotal;
  }

  const exportFile = async () => {
    const data = hostRevenue.monthlyRevenue || [];

    if (data.length < 1) {
      toast.error('Hiện tòa không có dữ liệu');
    }

    const arrData = data.map((obj, index) => ({
      STT: index + 1,
      'Thời gian': obj.time,
      'Doanh thu': Money(obj.total),
    }));

    const totalRevenue = data.reduce((sum, obj) => sum + obj.total, 0);

    arrData.push({
      STT: 'Tổng',
      'Thời gian': '',
      'Doanh thu': Money(totalRevenue),
    });

    const headerStyle = {
      font: { bold: true, color: { rgb: '000000' } },
      alignment: { horizontal: 'center' },
      fill: { fgColor: { rgb: 'FFC000' } },
    };

    const dataStyle = {
      font: { bold: false, color: { rgb: '000000' } },
      alignment: { horizontal: 'left' },
      fill: { fgColor: { rgb: 'FFFFFF' } },
    };

    const titleStyle = {
      font: { bold: true, sz: 16, color: { rgb: '000000' } },
      alignment: { horizontal: 'center' },
    };

    const timeStyle = {
      font: { italic: true, color: { rgb: '000000' } },
      alignment: { horizontal: 'right' },
    };

    const wscols = [
      { wch: 15 },
      { wch: 20 },
      { wch: 30 },
    ];

    const worksheet = XLSX.utils.json_to_sheet([]);

    // Thêm tiêu đề và hợp nhất các ô
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`Báo cáo Doanh Thu ${selectedBuilding} - ${selectedYear}`]],
      {
        origin: 'A1',
      },
    );
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
    worksheet['A1'].s = titleStyle;

    // Thêm thời gian xuất file
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() +
      1}/${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`Thời gian xuất file: ${formattedDate}`]],
      { origin: 'A2' },
    );
    worksheet['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 2 } });
    worksheet['A2'].s = timeStyle;

    // Thêm hàng tiêu đề
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [['STT', 'THỜI GIAN', 'DOANH THU (VNĐ)']],
      { origin: 'A4' },
    );

    // Thêm dữ liệu
    XLSX.utils.sheet_add_json(worksheet, arrData, {
      skipHeader: true,
      origin: 'A5',
    });

    worksheet['!cols'] = wscols;

    // Định dạng tiêu đề
    const headerRange = XLSX.utils.decode_range('A4:C4');
    for (let c = headerRange.s.c; c <= headerRange.e.c; c++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: headerRange.s.r, c })];
      cell.s = headerStyle;
    }

    // Định dạng dữ liệu
    const dataRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = 4; R <= dataRange.e.r; ++R) {
      for (let C = dataRange.s.c; C <= dataRange.e.c; ++C) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
        cell.s = dataStyle;
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    if (arrData.length > 0) {
      XLSX.writeFile(
        workbook,
        `[${selectedBuilding}] - Report revenue - ${selectedYear}.xlsx`,
      );
    }
  };

  const handleWithdrawRequest = () => {
    setModal(true);
    const userBankRequest = urlLink.api.serverUrl + urlLink.api.getBankUser;
    const data = { id };

    axios
      .get(userBankRequest, { params: data })
      .then(response => {
        const fetchedData = response.data.data.data;
        if (Array.isArray(fetchedData)) {
          setBankData(fetchedData); // Ensure data is an array
          if (fetchedData.length > 0) {
            setSelectedBank(fetchedData[0]._id); // Set the first bank as the default selected
          }
        } else {
          setBankData([]); // Set as empty array if data is not an array
        }
      })
      .catch(error => {
        setBankData([]); // Set as empty array on error
      });
  };

  const handleBankChange = event => {
    setSelectedBank(event.target.value);
  };

  const getSelectedBankAccountNumber = () => {
    if (Array.isArray(bankData)) {
      const selectedBankData = bankData.find(bank => bank._id === selectedBank);
      return selectedBankData ? selectedBankData.stk : '';
    }
    return '';
  };

  const handleSendWithdrawRequest = async () => {
    const bankId = selectedBank;
    const accountNumber = getSelectedBankAccountNumber();
    const withdrawAmount = document.getElementById('withdrawAmount').value;
    const withdrawReason = document.getElementById('withdrawReason').value;

    function getRandomHex() {
      const randomInt = Math.floor(Math.random() * 0xffffffff);
      const hexString = randomInt
        .toString(16)
        .toUpperCase()
        .padStart(8, '0');
      return hexString;
    }
    const keyPayment = getRandomHex();

    if (!withdrawAmount) {
      toast.error('Vui lòng nhập số tiền cần rút');
      return;
    }

    if (!withdrawReason) {
      toast.error('Vui lòng nhập lý do rút tiền');
      return;
    }

    const data = {
      id,
      keyPayment,
      motelName: selectedBuilding,
      bankId,
      accountNumber,
      withdrawAmount,
      withdrawReason,
      type: 'cash',
    };
    setModal(false);
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('withdrawReason').value = '';
    props.postWithdraw(data);
  };

  const directToHistory = () => {
    history.push(`/historyRevenue/${id}`);
  };

  return (
    <div className="login-page-wrapper">
      <Helmet>
        <title>RevenueManagement</title>
        <meta name="description" content="Description of HostRevenue" />
      </Helmet>
      <div className="title">
        <FormattedMessage {...messages.Header} />
      </div>
      <div className="job-list-wrapper container-fluid">
        <Row className="action-container">
          <ModalComponent
            modal={modal}
            toggle={() => setModal(!modal)}
            className="modal-lg"
            modalTitle="Xác nhận yêu cầu rút tiền"
            footer={
              <>
                <Button color="secondary" onClick={() => setModal(!modal)}>
                  <FormattedMessage {...messages.Cancel} />
                </Button>
                <Button color="primary" onClick={handleSendWithdrawRequest}>
                  <FormattedMessage {...messages.Send} />
                </Button>
              </>
            }
          >
            <Row>
              <Col md={12}>
                <Form>
                  <FormGroup>
                    <Label for="bankName">
                      <FormattedMessage {...messages.Bank} />
                    </Label>
                    <Input
                      type="select"
                      name="bankName"
                      id="bankName"
                      value={selectedBank}
                      onChange={handleBankChange}
                    >
                      {bankData.length > 0 ? (
                        bankData.map(bank => (
                          <option key={bank._id} value={bank._id}>
                            {bank.nameTkLable}
                          </option>
                        ))
                      ) : (
                        <option>
                          <FormattedMessage {...messages.NoData} />
                        </option>
                      )}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="accountNumber">
                      <FormattedMessage {...messages.BankAccount} />
                    </Label>
                    <Input
                      type="text"
                      name="accountNumber"
                      id="accountNumber"
                      value={getSelectedBankAccountNumber()}
                      readOnly
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="withdrawAmount">
                      <FormattedMessage {...messages.AmountToWithdraw} />
                    </Label>
                    <Input
                      type="text"
                      name="withdrawAmount"
                      id="withdrawAmount"
                      placeholder="Nhập số tiền cần rút"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="withdrawReason">
                      <FormattedMessage {...messages.Note} />
                    </Label>
                    <Input
                      type="textarea"
                      name="withdrawReason"
                      id="withdrawReason"
                    />
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </ModalComponent>
          <Row />
          <Col xs={12} sm={2}>
            <Dropdown
              isOpen={yearDropdownOpen}
              toggle={() => setYearDropdownOpen(!yearDropdownOpen)}
              className="mt-4 room-dropdown-container"
            >
              <DropdownToggle
                caret
                color="none"
                className="room-dropdown custom-dropdown-toggle"
              >
                {selectedYear}
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu">
                {years.map((year, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => setSelectedYear(year, index)}
                    className="dropdown-item"
                  >
                    <span className="dropdown-key">{year}</span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Col>
          <Col xs={12} sm={2}>
            <Dropdown
              isOpen={isOpen}
              toggle={() => setIsOpen(!isOpen)}
              className="mt-4 room-dropdown-container"
            >
              <DropdownToggle caret color="none" className="room-dropdown">
                {selectedBuilding}
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu">
                {motelsArray.length > 0 ? (
                  motelsArray.map(([key, value]) => (
                    <DropdownItem
                      key={key}
                      value={value}
                      className="dropdown-item"
                      onClick={() => handleSelectBuilding(value, key)}
                    >
                      <span className="dropdown-key">{key}</span>
                    </DropdownItem>
                  ))
                ) : (
                  <DropdownItem>
                    <FormattedMessage {...messages.NoData} />
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </Col>
          <Col xs={12} sm={5}>
            <Row>
              <Col md={3}>
                <Button
                  color="primary"
                  className="btn-block mt-4"
                  onClick={handleFilter}
                >
                  {<FormattedMessage {...messages.Search} />}
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  onClick={exportFile}
                  color="success"
                  className="btn-block mt-4"
                >
                  {<FormattedMessage {...messages.Export} />}
                </Button>
              </Col>
              <Col md={3}>
                {role && role.length === 2 && role.includes('host') ? (
                  <Button
                    onClick={handleWithdrawRequest}
                    color="primary"
                    className="btn-block mt-4"
                  >
                    {<FormattedMessage {...messages.Withdraw} />}
                  </Button>
                ) : (
                  ''
                )}
              </Col>
              <Col md={3}>
                <Button
                  onClick={directToHistory}
                  color="primary"
                  className="btn-block mt-4"
                >
                  {<FormattedMessage {...messages.HistoryRevenue} />}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="revenueData-container">
          <Col xs={12} sm={3} className="totalRevenue-container">
            <div className="totalRevenue">
              <div className="icon-container">
                <MonetizationOn />
              </div>
              <div className="revenueText-container">
                <span className="totalRevenue-text">
                  <FormattedMessage {...messages.Total} />
                </span>
                <span className="totalRevenue-number">
                  {totalRevenue
                    ? vndFormatter.format(totalRevenue)
                    : 'Không có dữ liệu'}
                </span>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={4} className="totalRevenue-container">
            <div className="totalRevenue">
              <div className="icon-container">
                <MonetizationOn />
              </div>
              <div className="revenueText-container">
                <span className="totalRevenue-text">
                  <FormattedMessage {...messages.RemainingRevenue} />
                </span>
                <span className="totalRevenue-number">
                  {remainingRevenue
                    ? vndFormatter.format(remainingRevenue)
                    : 'Không có dữ liệu'}
                </span>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={4} className="totalRevenue-container">
            <div className="totalRevenue">
              <div className="icon-container">
                <Payment />
              </div>
              <div className="revenueText-container">
                <span className="totalRevenue-text">
                  <FormattedMessage {...messages.CurrentMonth} />
                </span>
                <span className="totalRevenue-number">
                  {currentRevenueMonthTotal
                    ? vndFormatter.format(currentRevenueMonthTotal)
                    : 'Không có dữ liệu'}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="dashboard-container">
          <Col xs={12} sm={5} className="compare-container">
            <LineChartElectric
              textY="Tỉ lệ doanh thu tháng"
              nameChart="Tỉ lệ doanh thu tháng"
              hostRevenue={hostRevenue.currentRevenueMonth}
            />
          </Col>
          <Col xs={12} sm={5} className="compare-container">
            <LineChartElectric
              textY="Tỉ lệ doanh thu năm"
              nameChart="Tỉ lệ doanh thu năm"
              hostRevenue={hostRevenue}
            />
          </Col>
        </Row>
        <Row className="dashboard-container">
          <Col xs={12} sm={11} className="compare-container">
            <LineChart
              textY="Doanh thu"
              nameChart="Doanh thu"
              hostRevenue={hostRevenue ? hostRevenue.monthlyRevenue : []}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

HostMotelRoomDetailUser.propTypes = {
  hostMotelRoomDetailUser: PropTypes.object.isRequired,
  getListRoom: PropTypes.func,
  getHostRevenue: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  hostMotelRoomDetailUser: makeSelectHostMotelRoomDetailUser(),
  hostRevenueData: makeSelectHostRevenue(),
  withdraw: makeSelectWithdraw(),
});

function mapDispatchToProps(dispatch) {
  return {
    getListRoom: id => {
      dispatch(getListRoom(id));
    },
    getHostRevenue: data => {
      dispatch(getHostRevenue(data));
    },
    postWithdraw: data => {
      dispatch(postWithdraw(data));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HostMotelRoomDetailUser);
