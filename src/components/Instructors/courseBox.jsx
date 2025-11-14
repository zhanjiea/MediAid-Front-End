import { useNavigate } from "react-router-dom";
import Buttons from "./buttons";

const SummaryCard = ({ icon, title, description, buttonName = "Enter", buttonVariant = "primary", courseId }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-xl shadow-sm 
                    w-full sm:w-[300px] md:w-[350px] lg:w-[400px] h-[550px]">
      
      {/* Image box */}
      <div className={`pt-3 pb-3 rounded-lg object-contain w-full flex justify-center`}>
        <img src={icon} alt={title} className="max-h-[250px] max-w-full" />
      </div>

      {/* Text */}
      <p className="text-[#0A033C] font-medium text-center">{title}</p>
      <p className="text-gray-500 text-sm text-center">{description}</p>

      {/* Button */}
      <div className="flex justify-center pt-6 w-full">
        <Buttons 
          buttonName={buttonName} 
          variant={buttonVariant}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default SummaryCard;
