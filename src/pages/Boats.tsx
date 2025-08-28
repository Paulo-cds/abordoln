import { useNavigate } from "react-router-dom";
import ButtonDefault from "../components/ButtonDefault";
import { useQuery } from "react-query";
import { getAllBoats, getMyBoats } from "../services/Routes";
import { useUserData } from "../components/ContextData";
import LoadingDefault from "../components/LoadingDefault";
import CardViewBoat from "../components/CardViewBoat";
import { useEffect, useState } from "react";
import type { Boat } from "../components/TypesUse";

const Boats: React.FC = () => {
  const { dataUser } = useUserData();
  const [boatsData, setBoatsData] = useState<Boat[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading } = useQuery(
    ["data", dataUser],
    () => getAllBoats().then((data)=>setBoatsData(data.data)),
    { refetchOnWindowFocus: false }
  );
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const handleGetMyBoats = async () => {
    setLoading(true);
    try {
      const response = await getAllBoats();
      setBoatsData(response.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center w-full mx-auto pb-4 mt-2">
      <h1 className="text-primary">Todos os Barcos</h1>
      <h3 className="text-primary mt-4">
        Aqui você pode gerenciar todos os barcos cadastrados.
      </h3>
      <div className="w-50 max-w-90 mt-8 ">
        <ButtonDefault
          text={"Adicionar Barco"}
          action={() => navigate("/novo-barco")}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full mt-8">
        {boatsData &&
          boatsData.map((boat) => (
            <div
              key={boat.id}
              className="flex items-center justify-center w-full"
            >
              <CardViewBoat
                name={boat.name}
                type={boat.type}
                price={boat.price}
                images={boat.images}
                capacity={boat.capacity}
                id={boat.id}
                action={handleGetMyBoats}
              />
            </div>
          ))}
      </div>

      {loading && <LoadingDefault />}
    </div>
  );
};

export default Boats;
