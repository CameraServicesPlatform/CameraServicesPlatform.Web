import productBg from "../../Images/table.jpg";

const Banner = ({ title }) => {
  return (
    <div className="relative">
      <img
        src={productBg}
        alt="Product-bg"
        className="w-200 h-60 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-white text-3xl">{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default Banner;
