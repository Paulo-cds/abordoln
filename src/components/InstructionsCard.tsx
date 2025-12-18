import { useState } from "react";

type InstructionsCardProps = {
    title: string;
    description: string;
}

const InstructionsCard = ({ title, description }: InstructionsCardProps) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <div className="cursor-pointer border border-primary rounded-lg p-2 mt-4" onClick={() => setOpen(!open)} >
            <h3 className="text-primary font-bold">{title}</h3>
            {
                open && <div className="instructions-description mt-2">
                    <p className="text-black" >{description}</p>
                </div>
            }
        </div>
    );
}

export default InstructionsCard;