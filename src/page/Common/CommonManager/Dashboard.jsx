import { Select, Card, Statistic, Row, Col, Typography } from "antd";
import { getEventDetailReport, getOverAllReport } from "../../api/dashboardApi";
import { useSelector } from "react-redux";
import { reportType } from "../../utils/labelEnum";
import { useState, useEffect } from "react";
import {
  formatDate,
  formatDateTime,
  formatPrice,
  isEmptyObject,
} from "../../utils/util";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import MangementEvent from "./ManagementEvent";
import { getAllEvent, getEventByOrganizerId, getEventBySponsorId } from "../../api/eventApi";
import EventTable from "../Common/Event/EventTable";
import EventDetailDashboard from "./EventDetailDashboard";

const { Title } = Typography;

export const Dashboard = () => {
  const role = useSelector((state) => state.user.role || "");
  const user = useSelector((state) => state.user.user || {});
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [eventData, setEventData] = useState({});
  const [events, setEvents] = useState([]);

  const handleChangeTime = async (value) => {
    setIsLoading(true);
    const data = await getOverAllReport(
      role == "ADMIN" ? null : user?.organizationId,
      value
    );
    if (data?.isSuccess) {
      setData(data.result);
    }
    setIsLoading(false);
  };
  const handleReportEvent = async (id) => {
    setIsLoading(true);
    const data = await getEventDetailReport(id);
    if (data?.isSuccess) {
      setEventData(data.result);
    }
    setIsLoading(false);
  };
  const fetchData = async () => {
    if(role === "ADMIN"){
      const res = await getAllEvent(1, 10);
      if (res.isSuccess) {
        setEvents(res.result.items);
      }
    }else if(role === "ORGANIZER"){
      const res = await getEventByOrganizerId(user.organizationId,1, 10);
      if (res.isSuccess) {
        setEvents(res.result.items);
      }

    }else if(role === "SPONSOR"){
      const res = await getEventBySponsorId(user.sponsorId,1, 10);
      if (res.isSuccess) {
        setEvents(res.result.items);
      }

    }

   
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <LoadingComponent isLoading={isLoading} />

      <h3 className="text-center text-primary font-bold text-2xl my-4">
        Thống kê
      </h3>
      {role == "ADMIN" &&<>
      
        <div className="mb-6">
        <Select
          className="w-full md:w-64"
          placeholder="Select time range"
          onChange={handleChangeTime}
        >
          {Object.keys(reportType).map((key) => (
            <Select.Option key={key} value={key}>
              {reportType[key]}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic title="Tổng số event" value={data.numOfEvents} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic title="Tổng số vé" value={data.numOfSeat} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic title="Tổng số vé đã đặt" value={data.numOfBookedSeat} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Lợi nhuận ròng"
              value={formatPrice(data.totalRevenue)}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Tổng số lợi nhuận vé đã bán"
              value={formatPrice(data.totalTicketRevenue)}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Tổng số tiền từ nhà tài trợ"
              value={formatPrice(data.totalSponsorAmount)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Tổng chi phí"
              value={formatPrice(data.totalCost)}
              precision={2}
            />
          </Card>
        </Col>
      </Row>
      </>}
      
      <div>
        <h3 className="text-center text-primary font-bold text-2xl my-4">
          Thống kê chi tiết về các sự kiện
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 space-x-9">
          <div className="mt-4 col-span-1 ">
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="table">
                <thead className="h-16 bg-base-200 text-black">
                  <tr>
                    <th>STT</th>
                    <th>Tựa đề</th>
                    <th>Mô tả</th>
                    <th>Thời gian sự kiện</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {events &&
                    events.length > 0 &&
                    events.map((event, index) => (
                      <tr key={index}>
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{event.title}</td>
                        <td className="p-2">{event.description}</td>
                        <td className="p-2">
                          {`${formatDate(event.startEventDate)} - ${formatDate(
                            event.endEventDate
                          )}`}{" "}
                        </td>

                        <td className="p-2">
                          <button
                            className="btn hover:bg-blue-500 transition duration-200 hover:text-white"
                            onClick={() => handleReportEvent(event.id)}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-span-2 p-2 shadow-md rounded-md">
            {!isEmptyObject(eventData) ? (
              <>
                <EventDetailDashboard data={eventData} />
              </>
            ) : (
              <p className="text-primary text-bold animate-pulse">
                Bạn vui lòng chọn 1 sự kiện bên tay trái
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
