import { useEffect, useState } from "react";

import courseData from "../../data/course.json"; 
import notFound from "../../assets/notfound.jpg";

import RUNavbar from '../../components/RegisteredUsers/RUnavbar.jsx'
import Footer from "../../components/Instructors/footer";
import CourseBox from "../../components/Instructors/courseBox";
import SearchBox from "../../components/Instructors/search";
import CourseForm from "../../components/Instructors/courseForm";

const RUCourses = () => {
    const [search, setSearch] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const filteredCourses = courseData
    .filter(course => 
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
        <div className="bg-[#f7f5fa] min-h-screen px-10 sm:px-[70px]">
            <RUNavbar />

            {/* Courses section */}
            <div className='pb-10'>
                <h1 className='text-4xl font-bold pb-10'>Courses</h1>
                <div className='pb-10 flex justify-between'>
                    <SearchBox value={search} onChange={setSearch} />
                </div>
                <div className={`flex flex-wrap gap-22.5 overflow-x-auto pb-10 items-center w-full justify-center lg:justify-start`}
                >
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
            </div>
        </div>
        <div>
            <Footer/>
        </div>
        </>
    );
};

export default RUCourses