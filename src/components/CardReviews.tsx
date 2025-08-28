import RatingStar from "./RatingStar"
import type { Review } from "./TypesUse"


const CardReviews: React.FC<Review> = ({value, text, userName, date}) => {
    return(
        <div className="p-2 w-[350px] lg:w-[400px] border border-primary rounded-2xl">
          <p className="text-primary text-[1em] font-semibold ">
            {userName}
          </p>
          <RatingStar value={value} disabled={true} />
          <p className="text-primary text-[1em]">
            {text}
          </p>
          <p className="text-primary text-[.8em] text-end">
            {date}
          </p>
        </div>
    )
}

export default CardReviews