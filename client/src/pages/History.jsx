import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function History() {


  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const navigate = useNavigate();



  const fetchHistory = async () => {

    try {


      setLoading(true);


      const token =
        localStorage.getItem("token");



      if(!token){

        setError("Please login first");

        return;

      }



      const res = await axios.get(

        "https://hiremind-server-syni.onrender.com/api/interview/history",

        {

          headers:{

            Authorization:`Bearer ${token}`

          }

        }

      );



      console.log(
        "HISTORY RESPONSE:",
        res.data
      );



      setInterviews(

        Array.isArray(res.data.interviews)

        ? res.data.interviews

        : []

      );



    }

    catch(error){


      console.log(
        "HISTORY ERROR:",
        error.response?.data
      );


      setError(

        error.response?.data?.message ||

        "Unable to load history"

      );


    }

    finally{

      setLoading(false);

    }


  };




  useEffect(()=>{

    fetchHistory();

  },[]);






  if(loading){

    return (

      <div className="min-h-screen bg-[#06070A] text-white flex items-center justify-center">

        <h2 className="text-xl">

          Loading interview history...

        </h2>

      </div>

    );

  }






  return (

    <div className="min-h-screen bg-[#06070A] text-white p-8">



      <div className="flex justify-between items-center mb-8">


        <h1 className="text-4xl font-bold">

          Interview History

        </h1>



        <button

          onClick={fetchHistory}

          className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700"

        >

          Refresh

        </button>


      </div>





      {
        error && (

          <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg mb-5">

            {error}

          </div>

        )
      }






      {
        interviews.length === 0 && !error ?


        (

          <div className="text-gray-400 text-center mt-20">


            <h2 className="text-2xl">

              No completed interviews found

            </h2>


            <p className="mt-3">

              Complete an interview to see history here.

            </p>


          </div>

        )


        :


        (

          <div className="grid gap-5 md:grid-cols-2">


            {
              interviews.map((item)=>(


                <div

                  key={item._id}

                  className="bg-[#10131A] border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition"


                >



                  <div className="flex justify-between">


                    <h2 className="text-xl font-bold">

                      {item.jobRole || "AI Interview"}

                    </h2>



                    <span className="text-green-400">

                      {item.status}

                    </span>


                  </div>





                  <div className="mt-4 space-y-2 text-gray-300">



                    <p>

                      Experience:

                      <span className="text-white ml-2">

                        {item.experience || "Fresher"}

                      </span>

                    </p>




                    <p>

                      Type:

                      <span className="text-white ml-2">

                        {item.interviewType}

                      </span>

                    </p>





                    <p>

                      Difficulty:

                      <span className="text-white ml-2">

                        {item.difficulty}

                      </span>

                    </p>






                    <p>

                      Score:

                      <span className="text-yellow-400 ml-2 font-bold">

                        {item.overallScore || 0}/100

                      </span>

                    </p>




                    <p className="text-sm text-gray-500">


                      {item.createdAt &&

                        new Date(
                          item.createdAt
                        ).toLocaleDateString()

                      }


                    </p>



                  </div>





                  <button

                    onClick={()=>navigate(`/interview/report/${item._id}`)}

                    className="mt-5 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700"

                  >

                    View Report

                  </button>




                </div>


              ))

            }


          </div>

        )

      }



    </div>

  );

}


export default History;