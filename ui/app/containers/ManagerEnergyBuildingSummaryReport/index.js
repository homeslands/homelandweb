/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import _ from 'lodash';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { GetApp } from '@material-ui/icons';
import localStore from 'local-storage';
import { NavLink, useParams } from 'react-router-dom';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import './style.scss';
import { urlLink } from '../../helper/route';
import makeSelectEnergyMotel from './selectors';
import { getEnergyMotel } from './actions';

export function ManagerEnergyBuildingsHost(props) {
  useInjectReducer({ key: 'energyMotel', reducer });
  useInjectSaga({ key: 'energyMotel', saga });
  const { energyMotel = [] } = props;

  const { id, name } = useParams();
  const currentUser = localStore.get('user') || {};
  const { role = [] } = currentUser;
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] =
    useState('') || new Date().getFullYear();
  // const [latestData, setLatestData] = useState([]);
  const [enableFilter, setEnableFilter] = useState(false);
  const [enableExport, setEnableExport] = useState(false);
  const [lastMonth, setLastMonth] = useState('');
  const [lastYear, setLastYear] = useState('');

  const handleMonthChange = event => {
    setSelectedMonth(event.target.value);
    setEnableFilter(true);
  };

  const handleCallApiGetAllData = async () => {
    setEnableExport(true);

    const current = new Date();
    const currentYear = current.getFullYear();
    const currentMon = current.getMonth();
    if (
      selectedYear > currentYear ||
      (selectedYear === currentYear && selectedMonth > currentMon)
    ) {
      alert('Thời gian bạn chọn không thể lớn hơn thời gian hiện tại');
      return;
    }

    if (selectedMonth === '1') {
      setLastMonth('12');
      setLastYear((selectedYear - 1).toString());
    } else {
      setLastMonth((parseInt(selectedMonth, 10) - 1).toString());
      setLastYear(selectedYear);
    }
    props.handleGetEnergyMotel({
      id,
      month: selectedMonth,
      year: selectedYear,
    });
  };

  const handleExportPDF = () => {
    const pdfDoc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    pdfDoc.setFontSize(12);
    pdfDoc.setFont('times', 'normal');

    const headers = [
      [
        'Phòng',
        'Electricity Last Month (kWh)',
        'Electricity This Month (kWh)',
        'Electricity Consumption (kWh)',
        'Water Last Month',
        'Water This Month',
        'Electricity Price (VND)',
        'Electricity Cost (VND)',
        'Water Cost (VND)',
        'Note',
      ],
    ];

    pdfDoc.setFontSize(13);
    pdfDoc.setFont('times', 'normal');
    pdfDoc.setTextColor(0, 0, 0);

    const data = [];
    let totalElectricityCost = 0;

    energyMotel.forEach((latestData, index) => {
      const electricityDifference = latestData
        ? // ? (latestData.latestDataCurrentMonth - latestData.latestDataBeforeMonth)
          latestData.totalKwhCurrentMonth
        : 0;
      const electricityDifferenceFormat = electricityDifference;
      const electricityCost = electricityDifferenceFormat * 3900;
      const electricityCostFormat =
        electricityCost.toLocaleString('vi-VN') + ' VND';

      totalElectricityCost += electricityCost;

      data.push([
        latestData.name,
        latestData ? latestData.latestDataBeforeMonth : 'Data not available',
        latestData.latestDataCurrentMonth,
        electricityDifferenceFormat,
        'No data',
        'No data',
        '3,900 VND',
        electricityCostFormat,
        'No data',
        latestData.numberOfMeter > 1
          ? `Changed ${latestData.numberOfMeter} meters`
          : '',
      ]);
    });

    const totalElectricityCostFormat =
      totalElectricityCost.toLocaleString('vi-VN') + ' VND';

    data.push([
      'Total',
      '',
      '',
      '',
      '',
      '',
      '',
      totalElectricityCostFormat,
      'No data',
    ]);

    const title = 'HOMELAND INVOICE';
    pdfDoc.setFontSize(14);

    pdfDoc.text(`Building: ${name}`, 20, 35);
    pdfDoc.text(`Monthly Report: ${selectedMonth}/${selectedYear}`, 20, 45);

    pdfDoc.setFont('times');
    pdfDoc.setLineWidth(0.3);
    pdfDoc.line(10, 25, 290, 25);

    const { pageSize } = pdfDoc.internal;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    const textWidth =
      (pdfDoc.getStringUnitWidth(title) * pdfDoc.internal.getFontSize()) /
      pdfDoc.internal.scaleFactor;
    const textOffset = (pageWidth - textWidth) / 2;

    pdfDoc.setFontSize(16);
    pdfDoc.text(title, textOffset, 20);

    pdfDoc.autoTable({
      head: headers,
      body: data,
      startY: 50,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 30 },
        7: { cellWidth: 30 },
        8: { cellWidth: 30 },
        9: { cellWidth: 25 },
      },
    });

    pdfDoc.save(`Summary_Report_${name}_${selectedMonth}_${selectedYear}.pdf`);
  };

  console.log(energyMotel);

  return (
    <div className="">
      <Helmet>
        <title>Trang quản lý tiền tòa nhà: {name}</title>
        <meta name="description" content="Description of Profile" />
      </Helmet>

      {role.length === 2 && role[0] === 'host' && (
        <>
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbItem>
              <NavLink to={urlLink.home}>Home</NavLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <NavLink to={urlLink.managerEnergyBuildingsHost}>
                Quản lý điện năng
              </NavLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <NavLink to={`${urlLink.managerEnergyRoomsHost}/${id}/${name}`}>
                {name}
              </NavLink>
            </BreadcrumbItem>
            <BreadcrumbItem active>Báo cáo tổng hợp</BreadcrumbItem>
          </Breadcrumb>

          {/* Content */}
          <div className="container">
            <div className="card-wrap">
              <div className="filter-container">
                <select
                  className="select-month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  <option value="" disabled>
                    Select month
                  </option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
                <select
                  className="select-year"
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                >
                  <option value="" disabled>
                    Select year
                  </option>
                  {Array.from(
                    { length: 3 },
                    (_, i) => new Date().getFullYear() + i,
                  ).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <Button
                  className="filter-btn"
                  onClick={handleCallApiGetAllData}
                  disabled={!enableFilter}
                >
                  <Search className="filter-icon" />
                </Button>
                <Button
                  className="export-btn"
                  onClick={handleExportPDF}
                  disabled={!enableExport}
                >
                  <GetApp className="export-icon" />
                </Button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Phòng</th>
                      <th>
                        Chỉ số điện tháng trước ({lastMonth}/{lastYear})
                      </th>
                      <th>
                        Chỉ số điện mới nhất ({selectedMonth}/{selectedYear})
                      </th>
                      <th>Tổng số điện đã dùng (kWh)</th>
                      <th>Chỉ số nước tháng trước</th>
                      <th>Chỉ số nước mới nhất</th>
                      <th>Giá điện (VND)</th>
                      <th>Tiền điện (VND)</th>
                      <th>Tiền nước (VND)</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_.isArray(energyMotel) &&
                      energyMotel.map((latestData, index) => {
                        const electricityCost =
                          latestData.totalKwhCurrentMonth * 3900;

                        return (
                          <tr key={index}>
                            <td>{latestData.name}</td>
                            <td>
                              {latestData.latestDataBeforeMonth
                                ? latestData.latestDataBeforeMonth
                                : 'Data not available'}
                            </td>
                            <td>{latestData.latestDataCurrentMonth}</td>
                            {/* <td>{latestData.latestDataCurrentMonth - latestData.latestDataBeforeMonth}</td> */}
                            <td>{latestData.totalKwhCurrentMonth}</td>
                            <td>No data</td>
                            <td>No data</td>
                            <td>3.900 (VND)</td>
                            <td>
                              {electricityCost.toLocaleString('vi-VN')} (VND)
                            </td>
                            <td>No data</td>
                            <td>
                              {latestData.numberOfMeter > 1
                                ? `Đã thay ${latestData.numberOfMeter} đồng hồ`
                                : ''}
                            </td>
                          </tr>
                        );
                      })}
                    <tr className="total-container">
                      <td colSpan="7">Tổng cộng</td>
                      <td>
                        {_.sumBy(
                          energyMotel,
                          data => data.totalKwhCurrentMonth * 3900,
                        ).toLocaleString('vi-VN')}{' '}
                        (VND)
                      </td>
                      <td>No data</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

ManagerEnergyBuildingsHost.propTypes = {
  // getMotelList: PropTypes.func.isRequired,
  energyMotel: PropTypes.object.isRequired,
  handleGetEnergyMotel: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  energyMotel: makeSelectEnergyMotel(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetEnergyMotel: data => {
      dispatch(getEnergyMotel(data));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ManagerEnergyBuildingsHost);
