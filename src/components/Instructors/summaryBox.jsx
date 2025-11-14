const SummaryCard = ({ icon, bgColor, title, count }) => {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm w-[250px]">
      {/* Icon box */}
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <img src={icon} alt={title} className="w-6 h-6" />
      </div>

      {/* Text */}
      <div>
        <p className="text-[#0A033C] font-medium">{title}</p>
        <p className="text-gray-500 text-sm">{count}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
