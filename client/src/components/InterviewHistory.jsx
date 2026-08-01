import React, { useEffect, useState } from "react";
import axios from "axios";

const InterviewHistory = ({ limit }) => {

  const [interviews, setInterviews] = useState([]);

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:8000/api/interview/history",
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );


        let data = res.data.interviews || [];


        if(limit){
          data = data.slice(0, limit);
        }


        setInterviews(data);


      } catch(error){

        console.log(
          "History error:",
          error
        );

      }

    };


    fetchHistory();

  }, [limit]);



  return (

    <div className="space-y-3">


      {
        interviews.length === 0 ?

        (
          <p className="text-[#8891A0] text-sm">
            No interviews completed yet
          </p>
        )

        :

        interviews.map((item)=>(
          
          <div
            key={item._id}
            className="bg-[#10131A] border border-[#1F2430] rounded-xl p-4"
          >

            <div className="flex justify-between">

              <h4 className="font-semibold">
                {item.role}
              </h4>


              <span className="text-[#35D399]">

                {item.analysis?.score || 0}%

              </span>

            </div>


            <p className="text-sm text-[#8891A0] mt-2">

              {item.experience || "Fresher"}

            </p>


          </div>

        ))

      }


    </div>

  );

};


export default InterviewHistory;