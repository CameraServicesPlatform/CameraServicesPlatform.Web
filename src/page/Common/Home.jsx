import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAllAvailableEvent } from "../../api/eventApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import {
  calculateCountdown,
  formatDate,
  formatDateTime,
} from "../../utils/util";
const Home = () => {
  const [events, setEvents] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(false);
  const images = [
    {
      url: "https://images.pexels.com/photos/976862/pexels-photo-976862.jpeg?cs=srgb&dl=pexels-joshsorenson-976862.jpg&fm=jpg",
      title: "Ánh sáng rực rỡ",
      description:
        "Những tia sáng lung linh, tỏa khắp không gian, tựa những vì sao lấp lánh trên bầu trời đêm.",
    },
    {
      url: "https://images.pexels.com/photos/2020432/pexels-photo-2020432.jpeg?cs=srgb&dl=pexels-phreewil-2020432.jpg&fm=jpg",
      title: "Điệu nhảy của sắc màu",
      description:
        "Các sắc màu đan xen, nhảy múa trong từng nhịp điệu, tạo nên một bữa tiệc đa sắc đầy cuốn hút.",
    },
    {
      url: "https://wallpapers.com/images/hd/stage-light-background-kn0w04juezldy7et.jpg",
      title: "Sân khấu ánh sáng",
      description:
        "Ánh đèn sân khấu chớp nhoáng, mời gọi khán giả bước vào thế giới kỳ diệu của nghệ thuật.",
    },
  ];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const fetchData = async () => {
    setIsLoading(true)
    const res = await getAllAvailableEvent(1, 10);
    if (res.isSuccess) {
      setIsLoading(false)
      setEvents(res.result.items);
      const initialCountdowns = {};
      res.result.items.forEach((event, index) => {
        initialCountdowns[index] = calculateCountdown(event.startEventDate);
      });
      setCountdowns(initialCountdowns);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      events.forEach((event, index) => {
        newCountdowns[index] = calculateCountdown(event.startEventDate);
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [events]);
  if (isLoading) {
    return <LoadingComponent isLoading={true} />;
  }
  return (
    <>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              className="w-full h-96 object-cover rounded-md"
              src={image.url}
              alt={`Slide ${index + 1}`}
            />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4">
              <h2 className="text-2xl font-bold">{image.title}</h2>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </Slider>
      <div className="container mx-auto py-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-primary py-4 rounded-lg">
          Các sự kiện chuẩn bị diễn ra tại Cóc Event
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events &&
            events.length > 0 &&
            events.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <div className="p-6">
                  <h4 className="text-2xl font-bold text-[#0c4a6e] mb-2">
                    {event.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-calendar-alt text-[#0c4a6e] mr-2"></i>
                    <span className="text-gray-600">
                      {formatDate(event.startEventDate)}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-clock text-[#0c4a6e] mr-2"></i>
                    <span className="text-gray-600">
                      {formatDateTime(event.startEventDate)} -{" "}
                      {formatDateTime(event.endEventDate)}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-map-marker-alt text-[#0c4a6e] mr-2"></i>
                    <span className="text-gray-600">
                      {event.location.name}, {event.location.address}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-building text-[#0c4a6e] mr-2"></i>
                    <span className="text-gray-600">
                      {event.organization.name}
                    </span>
                  </div>
                </div>
                <div className="bg-[#0c4a6e] text-white p-4">
                  <p className="text-lg font-semibold">
                    Thời gian còn lại: {countdowns[index]}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;
