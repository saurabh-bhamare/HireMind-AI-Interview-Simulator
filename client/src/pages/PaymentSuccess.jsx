import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {

  const navigate = useNavigate();


  useEffect(() => {

    const timer = setTimeout(() => {

      alert(
        "✅ Payment Successful!\n\n🎉 Your credits have been added successfully."
      );

      navigate("/");

    }, 2000);


    return () => clearTimeout(timer);

  }, [navigate]);



  return (

    <div className="
    min-h-screen
    bg-[#06070A]
    flex
    items-center
    justify-center
    text-white
    ">

      <div className="
      bg-[#0B0D12]
      border border-[#1F2430]
      rounded-3xl
      p-10
      text-center
      ">

        <h1 className="
        text-3xl
        font-bold
        text-[#35D399]
        ">
          Payment Successful 🎉
        </h1>


        <p className="
        text-[#8891A0]
        mt-4
        ">
          Redirecting to dashboard...
        </p>


      </div>

    </div>

  );
}


export default PaymentSuccess;