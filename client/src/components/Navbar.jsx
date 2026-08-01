import React, { useEffect, useRef, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";



import {
  Edit3,
  LogOut,
  LayoutDashboard,
  Wallet,
  X,
  Zap
} from "lucide-react";

import { logoutUser } from "../redux/userSlice";


const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .font-display {
      font-family: 'Space Grotesk', sans-serif;
    }

    .font-mono-data {
      font-family: 'JetBrains Mono', monospace;
    }
  `}</style>
);



function Navbar() {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [showDropdown,setShowDropdown] = useState(false);
  const [showPopup,setShowPopup] = useState(false);


  const dropdownRef = useRef(null);


  const user = useSelector(
    (state)=>state.user.user
  );



  useEffect(()=>{


    const handleClickOutside=(e)=>{

      if(
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ){
        setShowDropdown(false);
      }

    };


    const handleEscape=(e)=>{

      if(e.key==="Escape"){
        setShowDropdown(false);
        setShowPopup(false);
      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );


    return ()=>{

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };


  },[]);




  const getInitials=(name)=>{

    if(!name)
      return "GU";


    const words=name.split(" ");


    if(words.length===1)
      return words[0][0].toUpperCase();


    return (
      words[0][0]+words[1][0]
    ).toUpperCase();

  };




  const handleLogout=()=>{

    localStorage.removeItem("token");

    dispatch(logoutUser());

    navigate("/auth");

  };





return (

<>

<GlobalStyle/>


<nav className="
sticky top-0 z-40 w-full 
bg-[#06070A]/90 backdrop-blur-xl
border-b border-[#1F2430]
px-6 md:px-8 py-4
flex items-center justify-between
">


{/* LOGO */}

<Link 
to="/"
className="flex items-center gap-2"
>

<div className="
w-8 h-8 rounded-lg
bg-[#5B6EFF]/15
border border-[#5B6EFF]/30
flex items-center justify-center
text-[#5B6EFF]
">

<Zap size={16}/>

</div>


<h1 className="
font-display text-2xl md:text-3xl
font-bold text-[#EDEFF3]
">

Hire
<span className="text-[#5B6EFF]">
Mind
</span>

</h1>


</Link>




<div 
ref={dropdownRef}
className="flex items-center gap-4 relative"
>



{/* CREDIT DISPLAY */}

<button

onClick={()=>setShowPopup(true)}

className="
bg-[#111318]
border border-[#1F2430]
px-4 py-2 rounded-xl
hover:border-[#5B6EFF]
transition
text-left
"

>

<p className="
font-mono-data
text-[10px]
uppercase
tracking-widest
text-[#8891A0]
">

Credits

</p>


<p className="
text-[#35D399]
font-semibold
">

{user?.credits ?? 0}

</p>


</button>





{/* PROFILE */}

<div className="relative">


<button

onClick={()=>setShowDropdown(!showDropdown)}

className="
w-11 h-11 rounded-full
bg-[#5B6EFF]
flex items-center justify-center
text-white font-bold
hover:bg-[#4759e6]
transition
"

>

{
user 
? getInitials(user.name)
: "GU"
}


</button>




{
showDropdown &&

<div className="
absolute right-0 mt-3
w-64
bg-[#0B0D12]
border border-[#1F2430]
rounded-2xl
shadow-2xl
overflow-hidden
z-50
">


{
user ?

<div className="
p-5 border-b border-[#1F2430]
">

<p className="
font-display
text-[#EDEFF3]
font-semibold
text-lg
">

{user.name}

</p>


<p className="
text-[#8891A0]
text-sm mt-1 truncate
">

{user.email}

</p>


</div>


:

<div className="
p-5 border-b border-[#1F2430]
">

<p className="
font-display
text-[#EDEFF3]
font-semibold
">

Guest User

</p>


</div>

}





<div className="flex flex-col">


{
user ?

<>


<button

onClick={()=>navigate("/profile/edit")}

className="
flex items-center gap-3
px-5 py-4
text-[#EDEFF3]
hover:bg-[#111318]
"

>

<Edit3 size={16}/>

Edit Profile

</button>

<button

onClick={()=>navigate("/dashboard")}

className="
flex items-center gap-3
px-5 py-4
text-[#EDEFF3]
hover:bg-[#111318]
"

>

<LayoutDashboard size={16}/>

Dashboard

</button>





<button

onClick={()=>setShowPopup(true)}

className="
flex items-center gap-3
px-5 py-4
text-[#EDEFF3]
hover:bg-[#111318]
"

>

<Wallet size={16}/>

My Credits

</button>






<button

onClick={handleLogout}

className="
flex items-center gap-3
px-5 py-4
text-[#FF5C5C]
hover:bg-[#111318]
"

>

<LogOut size={16}/>

Logout

</button>


</>


:


<Link
to="/auth"
className="
px-5 py-4
text-[#EDEFF3]
hover:bg-[#111318]
"
>

Login

</Link>


}



</div>



</div>

}



</div>


</div>


</nav>







{/* CREDIT POPUP */}


{
showPopup &&

<div

onClick={()=>setShowPopup(false)}

className="
fixed inset-0
bg-black/70
backdrop-blur-sm
flex items-center justify-center
z-50 px-4
"

>


<div

onClick={(e)=>e.stopPropagation()}

className="
bg-[#0B0D12]
border border-[#1F2430]
rounded-3xl
p-8
w-full max-w-md
relative
"

>



<button

onClick={()=>setShowPopup(false)}

className="
absolute top-4 right-4
text-[#8891A0]
"

>

<X size={20}/>

</button>




<div className="text-center">


<div className="
w-12 h-12 mx-auto
rounded-xl
bg-[#5B6EFF]/15
flex items-center justify-center
text-[#5B6EFF]
">

<Wallet size={22}/>

</div>



<h2 className="
font-display
text-2xl
font-bold
text-[#EDEFF3]
mt-4
">

Your Credits

</h2>



<p className="
font-mono-data
text-6xl
font-bold
text-[#35D399]
mt-6
">

{user?.credits ?? 0}

</p>



<p className="
text-[#8891A0]
mt-4
">

Use credits to unlock AI mock interviews.

</p>



<Link

to="/pricing"

onClick={()=>setShowPopup(false)}

className="
block
w-full
mt-8
bg-[#5B6EFF]
hover:bg-[#4759e6]
py-3
rounded-2xl
font-semibold
text-white
transition
"

>

Buy More Credits

</Link>


</div>


</div>


</div>

}


</>

);

}


export default Navbar;