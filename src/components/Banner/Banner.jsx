const Banner = ({ title }) => {
  return (
    <div className="relative">
      <img
        src={productBg}
        alt="Product-bg"
        className="w-full h-auto object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-white text-3xl md:text-5xl">{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default Banner;
