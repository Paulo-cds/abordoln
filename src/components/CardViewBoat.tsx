import { useLocation, useNavigate } from "react-router-dom";
import { useUserData } from "./ContextData";
import { typesOfBoats, type Boat } from "./TypesUse";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useState } from "react";
import AlertDeleteItem from "./AlertDeleteItem";
import { deleteSingleBoat } from "../services/Routes";
import LoadingDefault from "./LoadingDefault";
import AlertNotification from "./AlertNotification";

type ActionDelete = {
  action: () => void;
};

type NewAction = ActionDelete & Boat;

const CardViewBoat: React.FC<NewAction> = ({
  images,
  name,
  type,
  price,
  capacity,
  id,
  action,
}) => {
  const { dataUser } = useUserData();
  const pathName = useLocation();
  const [loading, setLoading] = useState(false);
  const allTypes = typesOfBoats;
  const newType = allTypes.find((boat) => boat.value === type);
  const navigate = useNavigate();
  const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const canUserEditBoat =
    dataUser?.role === "advertiser" || dataUser?.role === "admin";

  const handleDeleteBoat = async () => {
    setLoading(true);
    try {
      await deleteSingleBoat(id || "", images);
      setAlertMessage("Embarcação deletada com sucesso!");
      setAlertType("success");
      setOpenAlert(true);
      setTimeout(() => {
        action();
      }, 1500);
    } catch (e) {
      console.log(e);
      setAlertMessage("Erro ao eletar embarcação, tente novamente.");
      setAlertType("error");
      setOpenAlert(true);
    }
    setLoading(false);
  };

  return (
    <div
      className={`w-[450px] border radius-2 border-solid rounded-xl border-primary bg-cover bg-center bg-no-repeat aspect-12/9 relative         
        ${
          pathName.pathname === "/embarcacoes"
            ? "cursor-pointer hover:scale-105 hover:shadow-xl/70 transition duration-150 ease-in-out"
            : ""
        } `}
      onClick={() =>
        pathName.pathname === "/embarcacoes"
          ? navigate(`/detalhes-barco/${id}`)
          : null
      }
      style={{ backgroundImage: `url(${images[0]})` }}
    >
      <div className="flex items-center justify-between absolute bottom-0 left-0 bg-secondary w-full px-2 py-4 rounded-b-xl opacity-90">
        <div className="flex flex-col  ">
          <p className="text-primary text-[1em] ">
            {newType?.label} {name}{" "}
          </p>
          <p className="text-primary text-[1em]">A partir de R${price} </p>
          <p className="text-primary text-[1em]">
            Capacidade {capacity} pessoas
          </p>
        </div>
        {canUserEditBoat && (pathName.pathname === "/meus-barcos" || pathName.pathname === "/barcos" ) && (
          <div className="flex items-center gap-1">
            <div>
              <FaRegEdit
                className="cursor-pointer text-primary text-2xl"
                onClick={() => navigate(`/editando-barco/${id}`)}
              />
            </div>
            <div>
              <MdOutlineDeleteForever
                className="cursor-pointer text-primary text-2xl"
                onClick={() => setOpenAlertDelete(true)}
              />
            </div>
          </div>
        )}
      </div>
      {openAlertDelete && (
        <AlertDeleteItem
          setOpen={setOpenAlertDelete}
          text={"Tem certeza que deseja excluir esse barco?"}
          subText={"Essa ação não poderá ser desfeita"}
          action={handleDeleteBoat}
        />
      )}
      {loading && <LoadingDefault />}
      {openAlert && (
        <AlertNotification
          open={openAlert}
          setOpen={setOpenAlert}
          message={alertMessage}
          type={alertType}
        />
      )}
    </div>
  );
};

export default CardViewBoat;
