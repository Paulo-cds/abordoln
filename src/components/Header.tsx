import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo redondo.png";
import { useUserData } from "./ContextData";
import { TiThMenuOutline } from "react-icons/ti";
import { useRef, useState } from "react";
import useClickOutside from "./ClickOutsideComponent";
import DividerComponent from "./DividerComponent";

const Header = () => {
  const navigate = useNavigate();
  const { userLoged, dataUser, logout, checkLogin, isLoadingData } =
    useUserData();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(document.createElement('div'));
  const location = useLocation();

  useClickOutside(sidebarRef, () => {
    if (isOpen) {
      // Apenas feche se o sidebar estiver aberto
      setIsOpen(false);
    }
  });

  const handleNavigate = (path: string) => {
    setIsOpen(false); // Fecha o sidebar ao navegar
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      await checkLogin();
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoadingData?.isLoading) {
    return (
      <div className="w-screen flex justify-center items-center p-2 bg-primary h-[70px]">
        <p className="text-secondary">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="w-screen flex justify-center items-center p-2 bg-primary h-[70px]">
      <aside
        className={`
          fixed inset-y-0 ${
            isOpen ? "left-0" : "left-[-550px]"
          } z-50 border-gray-700 border-r
          w-64 bg-primary text-white shadow-xl
          transform ease-in-out transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:flex-shrink-0
        `}
        ref={sidebarRef}
      >
        <div className="border-b border-gray-700 h-[70px] flex items-center justify-center">
          <p className="text-2xl font-semibold text-secondary">Meu App</p>
        </div>
        <nav className="mt-1">
          {userLoged?.isLoged ? (
            <>
              <div
                className={`block py-2 px-4 hover:bg-secondary hover:text-primary  cursor-pointer ${
                  location.pathname === "/" ? "bg-secondary text-primary" : 'text-secondary'
                }  `}
                onClick={() => handleNavigate("/")}
              >
                <p className="font-semibold">Início</p>
              </div>

              {dataUser?.role === "advertiser" && (
                <>
                  <DividerComponent />
                  <div
                    className={`block py-2 px-4 hover:bg-secondary hover:text-primary  cursor-pointer ${
                  location.pathname === "/meus-barcos" ? "bg-secondary text-primary" : 'text-secondary'
                }  `}
                    onClick={() => handleNavigate("/meus-barcos")}
                  >
                    Meus Barcos
                  </div>
                </>
              )}
              {(dataUser?.role === "client" ||
                dataUser?.role === "advertiser") && (
                <>
                  <DividerComponent />
                  <div
                    className={`block py-2 px-4 hover:bg-secondary hover:text-primary  cursor-pointer ${
                  location.pathname === "/minhas-reservas" ? "bg-secondary text-primary" : 'text-secondary'
                }  `}
                    onClick={() => handleNavigate("/minhas-reservas")}
                  >
                    Minhas Reservas
                  </div>
                </>
              )}
              {dataUser?.role === "advertiser" && (
                <>
                  <DividerComponent />
                  <div
                    className={`block py-2 px-4 hover:bg-secondary hover:text-primary  cursor-pointer ${
                  location.pathname === "/perfil" ? "bg-secondary text-primary" : 'text-secondary'
                }  `}
                    onClick={() => handleNavigate("/perfil")}
                  >
                    Perfil
                  </div>
                </>
              )}
              {dataUser?.role === "admin" && (
                <>
                  <DividerComponent />
                  <div
                    className={`block py-2 px-4 hover:bg-secondary hover:text-primary  cursor-pointer ${
                  location.pathname === "/barcos" ? "bg-secondary text-primary" : 'text-secondary'
                }  `}
                    onClick={() => handleNavigate("/barcos")}
                  >
                    Barcos
                  </div>
                  <DividerComponent />
                  <div
                    className={`block py-2 px-4 hover:bg-secondary hover:text-primary  cursor-pointer ${
                  location.pathname === "/reservas" ? "text-primary bg-secondary " : 'text-secondary'
                }  `}
                    onClick={() => handleNavigate("/reservas")}
                  >
                    Reservas
                  </div>
                  <DividerComponent />
                  <div
                    className={`block py-2 px-4 hover:bg-secondary hover:text-primary cursor-pointer ${
                  location.pathname === "/usuarios" ? "bg-secondary text-primary" : 'text-secondary'
                }  `}
                    onClick={() => handleNavigate("/usuarios")}
                  >
                    Usuários
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="md:hidden">
              <>
                <DividerComponent />
                <div
                  className="block py-2 px-4 hover:bg-secondary hover:text-primary text-secondary cursor-pointer "
                  onClick={() => handleNavigate("/cadastro/advertiser")}
                >
                  Anuncie
                </div>
              </>
              <>
                <DividerComponent />
                <div
                  className="block py-2 px-4 hover:bg-secondary hover:text-primary text-secondary cursor-pointer "
                  onClick={() => handleNavigate("/cadastro/client")}
                >
                  Cadastre-se
                </div>
              </>
            </div>
          )}
          <div className="md:hidden ">
            <DividerComponent />
            <div
              className="block py-2 px-4 hover:bg-secondary hover:text-primary text-secondary cursor-pointer "
              onClick={() => handleNavigate("/embarcacoes")}
            >
              Embarcações
            </div>
          </div>

          {!userLoged?.isLoged ? (
            <div className="md:hidden ">
              <DividerComponent />
              <div
                className="block py-2 px-4 hover:bg-secondary hover:text-primary text-secondary cursor-pointer "
                onClick={() => handleNavigate("/login")}
              >
                Login
              </div>
            </div>
          ) : (
            <div className="md:hidden ">
              <DividerComponent />
              <div
                className="block py-2 px-4 hover:bg-secondary hover:text-primary text-secondary cursor-pointer "
                onClick={() => handleLogout()}
              >
                Sair
              </div>
            </div>
          )}
        </nav>
      </aside>
      <div className={`w-full max-w-7xl flex justify-between items-center `}>
        <div
          className={`flex items-center gap-2 w-full md:w-max justify-between`}
        >
          {userLoged?.isLoged && (
            <div
              className="cursor-pointer hidden md:block "
              onClick={() => setIsOpen(!isOpen)}
            >
              <TiThMenuOutline className="text-secondary text-3xl" />
            </div>
          )}
          <div
            className="cursor-pointer md:hidden block "
            onClick={() => setIsOpen(!isOpen)}
          >
            <TiThMenuOutline className="text-secondary text-3xl" />
          </div>
          <img
            src={logo}
            alt="A Bordo LN"
            className="w-12 cursor-pointer"
            onClick={() => handleNavigate("/")}
          />
        </div>
        <div className="gap-4 items-center hidden md:flex ">
          {!userLoged?.isLoged && (
            <>
              <p
                className="text-secondary text-base cursor-pointer "
                onClick={() => navigate("/cadastro/advertiser")}
              >
                Anuncie
              </p>
              <p
                className="text-secondary text-base cursor-pointer "
                onClick={() => navigate("/cadastro/client")}
              >
                Cadastre-se
              </p>
            </>
          )}
          <p
            className="text-secondary text-base cursor-pointer"
            onClick={() => navigate("/embarcacoes")}
          >
            Embarcações
          </p>
          {!userLoged?.isLoged ? (
            <p
              className="text-secondary text-base cursor-pointer "
              onClick={() => navigate("/login")}
            >
              Login
            </p>
          ) : (
            <p
              className="text-secondary text-base cursor-pointer "
              onClick={() => handleLogout()}
            >
              Sair
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
