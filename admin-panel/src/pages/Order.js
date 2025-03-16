import React from "react";
import { Table } from "antd";

const Orders = () => {
  const columns = [
    {
      title: "Mã Đơn",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Khách Hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  const data = [
    {
      key: "1",
      orderId: "001",
      customer: "Nguyễn Văn A",
      total: "500.000đ",
      status: "Đang xử lý",
    },
    {
      key: "2",
      orderId: "002",
      customer: "Trần Thị B",
      total: "750.000đ",
      status: "Hoàn thành",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách đơn hàng</h2>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Orders; // Export mặc định
