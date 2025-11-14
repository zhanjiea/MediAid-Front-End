const Buttons = ({ buttonName, variant = "primary", onClick}) => {
  const baseClasses = "w-24 h-10 sm:w-28 sm:h-11 md:w-32 md:h-12";
  const variants = {
    primary: "border-[#9C4DF4] hover:bg-[#9C4DF4] hover:text-white rounded-lg border",
    secondary: "bg-[#9C4DF4] border-[#9C4DF4] text-white hover:bg-white hover:text-[#9C4DF4] rounded-lg border",
    back: "mb-6 text-gray-600 text-5xl text-left",
    delete: "bg-red-600 border-red-600 text-white hover:bg-white hover:text-red-600 rounded-lg border",
  };

  const variantClasses = variants[variant] || variants.primary;

  return (
    <div>
      <button className={`${baseClasses} ${variantClasses}`} 
      onClick={onClick}
      >
        {buttonName}
      </button>
    </div>
  );
};

export default Buttons;