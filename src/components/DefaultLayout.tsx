import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom"; 

const DefaultLayout= () => {
  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-y-auto scroll-smooth overflow-x-hidden justify-between ">
      <main className="w-full">
      <Header />
        <div className="w-full flex flex-col items-center max-w-9/10 lg:max-w-7xl mx-auto pb-4">
          <Outlet />
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default DefaultLayout;
