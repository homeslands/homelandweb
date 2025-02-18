import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import Money from "../../containers/App/format";

const PieChartElectric = ({ nameChart, hostRevenue }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    if (!hostRevenue) {
      return;
    }
    const totalDepositPrice = Math.round(hostRevenue.totalDepositPrice) || 0;

    const totalRoomPrice = Math.round(hostRevenue.totalRoomPrice) || 0;
    const totalElectricPrice = Math.round(hostRevenue.totalElectricPrice) || 0;
    const totalWaterPrice = Math.round(hostRevenue.totalWaterPrice) || 0;
    const totalServicePrice = Math.round(hostRevenue.totalServicePrice) || 0;
    const totalVehiclePrice = Math.round(hostRevenue.totalVehiclePrice) || 0;
    const totalWifiPrice = Math.round(hostRevenue.totalWifiPrice) || 0;
    const totalOtherPrice = Math.round(hostRevenue.totalOtherPrice) || 0;

    const option = {
        title: {
            text: nameChart,
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
            orient: 'horizontal',
            left: 'center',
            top: '10%',
            // data: ['Tiền điện', 'Tiền nước', 'Tiền phòng', `Tiền dịch vụ`, `Tiền xe`, `Tiền wifi`, `Khác`],
            data: ['Điện', 'Nước', 'Phòng', `Dịch vụ`, `Xe`, `Wifi`, `Khác`],
        },
        series: [
            {
                name: 'Tỉ lệ',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: totalElectricPrice, name: `Điện:` },
                    { value: totalWaterPrice, name: `Nước:` },
                    { value: totalRoomPrice, name: `Phòng:` },
                    { value: totalServicePrice, name: `Dịch vụ:` },
                    { value: totalVehiclePrice, name: `Xe:` },
                    { value: totalWifiPrice, name: `Wifi:` },
                    { value: totalOtherPrice, name: `Khác:` },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                    },
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{b}: {c} ({d}%)',
                        },
                        labelLine: { show: true },
                    },
                    color: ['#91cc75', '#FFD700', '#7798BF'],
                },
                data: [
                    {
                        value: totalElectricPrice,
                        name: `Điện`,
                        itemStyle: {
                            color: '#FFD700',
                        },
                    },
                    {
                        value: totalWaterPrice,
                        name: `Nước`,
                        itemStyle: {
                            color: '#7798BF',
                        },
                    },
                    {
                        value: totalRoomPrice,
                        name: `Phòng`,
                        itemStyle: {
                            color: '#ffaf00',
                        },
                    },
                    {
                        value: totalDepositPrice,
                        name: `Cọc`,
                        itemStyle: {
                            color: '#8f9779',
                        },
                    },
                    {
                        value: totalServicePrice,
                        name: `Dịch vụ`,
                        itemStyle: {
                            color: '#91a3b0',
                        },
                    },
                    {
                        value: totalVehiclePrice,
                        name: `Xe`,
                        itemStyle: {
                            color: '#4c8bf5',
                        },
                    },
                    {
                        value: totalWifiPrice,
                        name: `Wifi`,
                        itemStyle: {
                            color: '#7eb6ff',
                        },
                    },
                    {
                        value: totalOtherPrice,
                        name: `Khác`,
                        itemStyle: {
                            color: '#ec546e',
                        },
                    },
                ],
            },
        ],
    };


    // Sử dụng cấu hình và dữ liệu đã xác định để hiển thị biểu đồ
    chartInstance.setOption(option);

    // Hàm dọn dẹp khi component bị hủy
    return () => {
      chartInstance.dispose();
    };
}, [hostRevenue, nameChart]);

    return (
        <div
            ref={chartRef}
            style={{
                width: '100%',
                height: '400px',
            }}
        />
    );
}

export default PieChartElectric;
