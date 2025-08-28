import { useNavigate } from "react-router-dom";
import logo from "../assets/logo redondo.png";
import { FaSquareWhatsapp } from "react-icons/fa6";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto p-2 h-[200px] shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] mt-10">
      <div className="w-full flex items-center justify-evenly">
        <img
          src={logo}
          alt="A Bordo LN"
          className="w-50 cursor-pointer hidden md:block "  
          onClick={() => navigate("/")}
        />
        <div className="flex flex-col gap-3">
          <a href="/cadastro/client">
            <p className="text-primary text-1em">Crie sua conta</p>
          </a>
          <a href="/cadastro/advertiser">
            <p className="text-primary text-1em">Anuncie</p>
          </a>
        </div>
        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSNUMBER}`}
          target="_blank"
        >
          <FaSquareWhatsapp className="text-green-500" size="3.5em" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
