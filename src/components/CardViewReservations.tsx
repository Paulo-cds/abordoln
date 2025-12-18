import { useNavigate } from "react-router-dom";
import { type Reservation } from "./TypesUse";
import ButtonDefault from "./ButtonDefault";
import DividerComponent from "./DividerComponent";
import { useUserData } from "./ContextData";

type ReservationCardProps = Pick<
  Reservation,
  | "boatId"
  | "data"
  | "quantity"
  | "price"
  | "paid"
  | "dataTour"
  | "imgBoat"
  | "boatName"
  | "status"
> & {
  id: string;
};

const CardViewReservations: React.FC<ReservationCardProps> = ({
  boatId,
  boatName,
  data,
  price,
  // paid,
  dataTour,
  imgBoat,
  id,
  status
}) => {
  const navigate = useNavigate();
  const { dataUser } = useUserData();

  return (
    <div className="w-full shadow-xl/30 border radius-2 border-solid rounded-xl text-primary px-2 py-4 md:max-w-9/10 ">
      <p className="text-[1em] mb-2">Reservado em: {data}</p>
      <DividerComponent />
      <div className="w-full flex items-start justify-between gap-4 flex-wrap mt-4">
        <div
          className="w-35 hidden md:block border radius-2 border-solid rounded-xl border-primary bg-cover bg-center bg-no-repeat aspect-12/9"
          style={{ backgroundImage: `url(${imgBoat})` }}
        />
        <div className="flex flex-col gap-4">
          <p className="text-[1em]">Data do passeio: {dataTour}</p>
          <p className="text-[1em]">Barco {boatName}</p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-[1em]">Valor R${price}</p>
          <p
            className={`text-[1em]`}
          >
            Status: 
            {status === "requested"
                  ? " Aguardando aprovação do dono da embarcação"
                  : status === "aproved"
                  ? " Reserva aprovada pelo dono da embarcação"
                  : status === "rejected"
                  ? " Reserva recusada pelo dono da embarcação"
                  : status === "finished"
                  ? " O passeio ja foi realizado"
                  : status === "canceled"
                  ? " Cancelado"
                  : ""}
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <ButtonDefault
            text="Ver reserva"
            action={() => navigate(`/minha-reserva/${id}`)}
          />
          {dataUser && dataUser.role === "client" && (
            <ButtonDefault
              text="Reservar novamente"
              colorSecondary={true}
              action={() => navigate(`/detalhes-barco/${boatId}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardViewReservations;
