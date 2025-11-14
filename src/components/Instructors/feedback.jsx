const FeedbackBox = ({value, onChange}) => {
  return (
    <div className="pb-10">

      <div className="bg-[#F0ECE9] rounded-3xl p-8">
        <textarea
          className="w-full h-48 bg-transparent resize-none outline-none text-center text-gray-600"
          placeholder="write feedback about the website system itself"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FeedbackBox;
