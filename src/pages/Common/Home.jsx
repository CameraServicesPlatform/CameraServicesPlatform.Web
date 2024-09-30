import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  calculateCountdown,
  formatDate,
  formatDateTime,
} from "../../utils/util";

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // Add a state for search query

  const images = [
    {
      url: "https://images.pexels.com/photos/976862/pexels-photo-976862.jpeg?cs=srgb&dl=pexels-joshsorenson-976862.jpg&fm=jpg",
      title: "Event 1",
      description: "Description for Event 1",
    },
    {
      url: "https://images.pexels.com/photos/2020432/pexels-photo-2020432.jpeg?cs=srgb&dl=pexels-phreewil-2020432.jpg&fm=jpg",
      title: "Event 2",
      description: "Description for Event 2",
    },
    {
      url: "https://wallpapers.com/images/hd/stage-light-background-kn0w04juezldy7et.jpg",
      title: "Event 3",
      description: "Description for Event 3",
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

  const fetchData = () => {
    setTimeout(() => {
      setEvents([]);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      events.forEach((event, index) => {
        newCountdowns[index] = calculateCountdown(event.eventDate);
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [events]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (!events || events.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-3xl font-bold mb-8 text-red-500">
          No events available at the moment
        </h2>
      </div>
    );
  }

  return (
    <>
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">CameraServicePlatform</h1>
          <div className="flex items-center">
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search events"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
            <button className="bg-red-700 text-white px-4 py-2 rounded-md ml-2">
              Search
            </button>
          </div>
        </div>
      </header>
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
        <h2 className="text-4xl font-bold mb-8 text-center text-red-600 py-4 rounded-lg">
          Các sản phẩm chuẩn bị diễn ra tại CameraServicePlatform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
              onClick={() => navigate(`/ event/${event.id}`)}
            >
              <div className="p-6">
                <h4 className="text-2xl font-bold text-red-700 mb-2">
                  {event.title}
                </h4>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center mb-2">
                  <i className="fas fa-calendar-alt text-red-700 mr-2"></i>
                  <span className="text-gray-600">
                    {formatDate(event.eventDate)}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <i className="fas fa-clock text-red-700 mr-2"></i>
                  <span className="text-gray-600">
                    {formatDateTime(event.startTime)} -{" "}
                    {formatDateTime(event.endTime)}
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <i className="fas fa-map-marker-alt text-red-700 mr-2"></i>
                  <span className="text-gray-600">
                    {event.location.name}, {event.location.address}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-building text-red-700 mr-2"></i>
                  <span className="text-gray-600">
                    {event.organization.name}
                  </span>
                </div>
              </div>
              <div className="bg-red-700 text-white p-4">
                <p className="text-lg font-semibold">
                  Thời gian còn lại: {countdowns[index]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="bg-gray-200 py-4 text-center">
        <p>Copyright 2023 CameraServicePlatform. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;