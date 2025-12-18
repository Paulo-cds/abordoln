import ButtonDefault from "./ButtonDefault";

type ItemDelete = {
  text: string;
  subText?: string;
  buttonText?: string;
  action?: () => void;
  setOpen: (open: boolean) => void;
};

const AlertDeleteItem: React.FC<ItemDelete> = ({
  text,
  action,
  setOpen,
  subText,
  buttonText,
}) => {
  const handleDeleteItem = () => {
    setOpen(false);
    if (action) {
      action();
    }
  };
  return (
    <div className="flex items-center justify-center h-screen fixed z-10 top-0 left-0 w-screen backdrop-blur-xs bg-grey/30 backdrop-brightness-50">
      <div className="bg-white border rounded border-primary radius-[25px] border-solid p-3 flex flex-col items-center justify-center gap-10 ">
        <div className="text-center">
          <p className="text-primary text-2xl">{text}</p>
          {subText && <p className="text-primary text-1xl">{subText}</p>}
        </div>
        <div className="flex items-center gap-2">
          <ButtonDefault
            text={"Cancelar"}
            action={() => setOpen(false)}
            colorSecondary={true}
          />
          <ButtonDefault text={buttonText || "Deletar"} action={handleDeleteItem} />
        </div>
      </div>
    </div>
  );
};

export default AlertDeleteItem;
