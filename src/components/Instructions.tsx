import InstructionsCard from "./InstructionsCard";

const Instructions = () => {
  return (
    <div className="instructions mt-6">
      <h2 className="text-primary">Perguntas frequentes</h2>
      <InstructionsCard
        title="Como funcionam as reservas?"
        description="Ao preencher os dados da reserva e do cartão de crédito, o locador receberá uma notificação para aceitar ou recusar a solicitação.
      Caso aceite, a reserva estará confirmada e você poderá comparecer na data e horário agendados para iniciar o passeio."
      />
      <InstructionsCard
        title="Porque devo colocar dados do meu cartão para realizar a reserva?"
        description="Inserir os dados do cartão é necessário apenas para trazer uma segurança maior para o locador, 
      pois se o cliente não comparecer na data e horário reservados ou cancelar a reserva fora do prazo estabelecido a multa referente a essa situação será cobrada no cartão cadastrado."
      />
      <InstructionsCard
        title="Algum valor será cobrada no ato da reserva?"
        description="Não. A locação deverá ser paga ao final do passeio diretamente para o locador."
      />     
    </div>
  );
};

export default Instructions;
