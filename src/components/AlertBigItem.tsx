import ButtonDefault from "./ButtonDefault";

type ItemDelete = {
  text: string;
  subText?: string;
  setOpen: (open: boolean) => void;
  action?: () => void;
};

const AlertBigItem: React.FC<ItemDelete> = ({
  text,
  setOpen,
  subText,
  action
}) => {
  return (
    <div className="flex items-center justify-center h-screen fixed z-10 top-0 left-0 w-screen backdrop-blur-xs bg-grey/30 backdrop-brightness-50">
      <div className="bg-white border rounded-2xl max-w-9/10 border-primary radius-[45px] border-solid p-3 flex flex-col items-center justify-center gap-5 ">
        <div className="text-center">
          <p className="text-primary text-[1em] lg:text-[1.3em] ">{text}</p>
          {subText && <p className="text-primary text-[.9em] lg:text-[1em]">{subText}</p>}
        </div>
        <div className="flex items-center gap-2">
          <ButtonDefault
            text={"Ok"}
            action={() => action ? action() : setOpen(false)}
            colorSecondary={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertBigItem;
