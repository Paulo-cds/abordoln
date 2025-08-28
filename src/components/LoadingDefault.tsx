import logo from "../assets/logo redondo.png";

const LoadingDefault = () => {
  return (
    <div className="flex items-center justify-center h-screen fixed z-12 top-0 left-0 w-full backdrop-blur-xs bg-grey/30 backdrop-brightness-50">
      <div className="relative w-40 h-40 lg:w-60 lg:h-60" >
        <img src={logo} alt="Github" className="absolute top-0 animate-pulse p-1"  />
        <div className="animate-spin rounded-full h-full w-full border-b-3 border-blue-500"></div>
      </div>
    </div>
  );
};

export default LoadingDefault;
