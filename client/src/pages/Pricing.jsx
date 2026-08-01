import React from "react";
import axios from "axios";
import { Zap, Check } from "lucide-react";
import { useSelector } from "react-redux";


function Pricing() {


    const user = useSelector((state) => state.user.user);
    console.log(user);

const buyCredits = async (credits, price) => {
  try {
    if (!user) {
      alert("Please login first");
      return;
    }

    const response = await axios.post(
      "http://localhost:8000/api/payment/create-checkout-session",
      {
        credits,
        price,
        userId: user._id,
        email: user.email,
      },
      {
        withCredentials: true,
      }
    );

    if (response.data.url) {
      window.location.href = response.data.url;
    }

  } catch (error) {
    console.error(error);
    alert("Payment failed");
  }
};




  const plans = [
    {
      name: "Starter",
      credits: 5,
      price: 19,
      description: "Perfect for trying AI interviews"
    },

    {
      name: "Pro",
      credits: 20,
      price: 49,
      description: "Best for placement preparation",
      popular: true
    },

    {
      name: "Premium",
      credits: 50,
      price: 99,
      description: "For continuous interview practice"
    }
  ];





  return (

    <div className="
    min-h-screen
    bg-[#06070A]
    text-white
    px-6 py-16
    ">


      <div className="
      max-w-6xl
      mx-auto
      text-center
      ">


        <div className="
        flex justify-center
        items-center gap-2
        mb-4
        text-[#5B6EFF]
        ">

          <Zap size={28}/>

          <h1 className="
          text-4xl
          font-bold
          ">
            HireMind Credits
          </h1>

        </div>


        <p className="
        text-[#8891A0]
        mb-12
        ">
          Choose a plan and unlock AI-powered mock interviews
        </p>





        <div className="
        grid
        md:grid-cols-3
        gap-8
        ">


        {
          plans.map((plan,index)=>(


          <div

          key={index}

          className={`
          relative
          bg-[#0B0D12]
          border
          rounded-3xl
          p-8
          transition
          hover:-translate-y-2

          ${
            plan.popular
            ?
            "border-[#5B6EFF]"
            :
            "border-[#1F2430]"
          }

          `}

          >


          {
            plan.popular &&

            <div className="
            absolute
            top-4 right-4
            bg-[#5B6EFF]
            px-3 py-1
            rounded-full
            text-xs
            font-semibold
            ">
              Popular
            </div>

          }




          <h2 className="
          text-2xl
          font-bold
          ">
            {plan.name}
          </h2>




          <p className="
          text-[#35D399]
          text-4xl
          font-bold
          mt-5
          ">
            {plan.credits}
          </p>


          <p className="
          text-[#8891A0]
          ">
            Interview Credits
          </p>




          <h3 className="
          text-3xl
          font-bold
          mt-6
          ">
            ₹{plan.price}
          </h3>



          <p className="
          text-[#8891A0]
          mt-4
          h-12
          ">
            {plan.description}
          </p>




          <div className="
          mt-6
          space-y-3
          text-left
          ">

          <p className="
          flex gap-2
          items-center
          text-sm
          ">

          <Check size={16}
          className="text-[#35D399]"
          />

          AI Mock Interviews

          </p>


          <p className="
          flex gap-2
          items-center
          text-sm
          ">

          <Check size={16}
          className="text-[#35D399]"
          />

          AI Feedback Report

          </p>


          <p className="
          flex gap-2
          items-center
          text-sm
          ">

          <Check size={16}
          className="text-[#35D399]"
          />

          Performance Tracking

          </p>


          </div>





          <button
  onClick={() => {
    console.log("Buy button clicked");
    buyCredits(plan.credits, plan.price);
  }}
  className="
  w-full
  mt-8
  bg-[#5B6EFF]
  hover:bg-[#4759e6]
  py-3
  rounded-2xl
  font-semibold
  transition
  "
>
  Buy Now
</button>




          </div>


          ))

        }


        </div>


      </div>


    </div>

  );

}


export default Pricing;