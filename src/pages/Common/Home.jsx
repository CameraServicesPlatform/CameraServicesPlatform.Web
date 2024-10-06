import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { calculateCountdown } from "../../utils/util";

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // Add a state for search query

  const images = [
    {
      url: "https://th.bing.com/th/id/R.71e5cd9565219e6a53ef5805025b4bc6?rik=VDvYSPf2D5ty%2bw&pid=ImgRaw&r=0",
      title: "Event 1",
      description: "Description for Event 1",
    },
    {
      url: "https://koala.sh/api/image/v2-3cfnz-6x48e.jpg?width=1344&height=768&dream",
      title: "Event 2",
      description: "Description for Event 2",
    },
    {
      url: "https://th.bing.com/th/id/OIP.gm94XOQvsa0S89QhcaLtCwAAAA?w=474&h=287&rs=1&pid=ImgDetMain",
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
      setEvents([]); // Simulating fetching data
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

  return (
    <>
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">CameraServicePlatform</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="may-anh" className="hover:underline">
                Camera
              </a>
            </li>
            <li>
              <a href="lens" className="hover:underline">
                Lens
              </a>
            </li>
            <li>
              <a href="phu-kien" className="hover:underline">
                Accessory
              </a>
            </li>
          </ul>
        </nav>
        {/* <div className="flex items-center">
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
        </div> */}
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
    </>
  );
};

export default Home;
