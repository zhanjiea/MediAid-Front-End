import { useState } from "react";
import { useNavigate } from "react-router-dom";

import courseData from "../../data/course.json"; 
import Icon from "../../assets/square.png";
import notFound from "../../assets/notfound.jpg";

import SummaryBox from '../../components/Instructors/summaryBox.jsx'
import Navbar from '../../components/Instructors/navbar.jsx'
import CourseBox from '../../components/Instructors/courseBox.jsx'
import SearchBox from '../../components/Instructors/search.jsx'
import Buttons from '../../components/Instructors/buttons.jsx'
import FeedbackBox from '../../components/Instructors/feedback.jsx'
import Footer from '../../components/Instructors/footer.jsx'

const Dashboard = () => {
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const goToCourses = () => {
    navigate("/courses");
  };

  const filteredCourses = courseData
    .filter(course => 
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 3);

  const handleSubmit = () => {
    console.log("Feedback submitted:", feedback);
    // send to backend here
    setFeedback(""); // optional: clear after submit
  };

  return (
    <>
    <div className="bg-[#f7f5fa] min-h-screen px-10 sm:px-[70px]">
      <Navbar />

      {/* Summary section */}
      <div className='pb-10'>
        <h1 className='text-4xl font-bold pb-10'>
          Summary
        </h1>
        <div className='flex flex-wrap gap-5 lg:gap-[70px] items-center justify-center'>
          <SummaryBox icon={Icon} bgColor= "bg-#FFEDE1" title="Total Courses" count={5}/>
          <SummaryBox icon={Icon} bgColor= "bg-#FFEDE1" title="Total Exam" count={5}/>
          <SummaryBox icon={Icon} bgColor= "bg-#FFEDE1" title="Total Badges" count={5}/>
        </div>
      </div>

      {/* Courses section */}
      <div className='pb-10'>
        <h1 className='text-4xl font-bold pb-10'>Courses</h1>
        <div className='pb-10'>
          <SearchBox value={search} onChange={setSearch} />
        </div>
        <div className={`flex flex-wrap gap-22.5 overflow-x-auto pb-10 items-center w-full justify-center`}>
          {filteredCourses.length === 0 ? (
            <div className="w-full flex flex-col justify-center items-center">
                <img src={notFound} alt="Not found" className="w-100 h-70" />
              <p className="text-2xl text-[#0A033C]">No results found</p>
              <p className="text-gray-500">We cant any courses matching your search.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <CourseBox
                key={course.id}
                courseId={course.courseId}
                icon={course.image}
                title={course.title}
                description={course.description}
              />
            ))
          )
          }
        </div>
        <div className='flex justify-center'>
          <Buttons buttonName= "More Courses" variant="secondary" onClick={goToCourses}/>
        </div>
      </div>

      {/* Feedback section */}
      <div className='pb-10'>
        <h1 className='text-4xl font-bold pb-10'>Feedback</h1>
        <FeedbackBox value={feedback} onChange={setFeedback}/>
        <div className='flex justify-center'>
          <Buttons buttonName= "Submit" variant="secondary" onClick={handleSubmit}/>
        </div>
      </div>
    </div>
    <div>
        <Footer/>
    </div>
  </>
  )
}

export default Dashboard
