// src/pages/Dashboard.jsx

import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Brain,
  FileText,
  BarChart3,
  Wallet,
  ArrowRight,
  Trophy,
  Clock
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InterviewHistory from "../components/InterviewHistory";


function Dashboard(){

const user = useSelector(
(state)=>state.user.user
);

const navigate = useNavigate();



const stats=[
{
title:"Total Interviews",
value:"12",
icon:<Brain size={24}/>,
color:"#5B6EFF"
},

{
title:"Credits Available",
value:user?.credits || 0,
icon:<Wallet size={24}/>,
color:"#35D399"
},

{
title:"Average Score",
value:"86%",
icon:<Trophy size={24}/>,
color:"#FFB454"
},

{
title:"Practice Time",
value:"8h 30m",
icon:<Clock size={24}/>,
color:"#B98CFF"
}

];



return(

<div className="
min-h-screen
bg-[#06070A]
text-[#EDEFF3]
">


<Navbar/>





<section className="
px-6 md:px-20
py-16
">


{/* HEADER */}

<div className="
flex
flex-col
md:flex-row
justify-between
items-start
md:items-center
gap-5
mb-12
">


<div>

<h1 className="
font-display
text-5xl
font-black
">

Welcome back,
<span className="text-[#5B6EFF]">
 {" "}
{user?.name?.split(" ")[0] || "Candidate"}
</span>

</h1>


<p className="
text-[#8891A0]
mt-4
text-lg
">

Track your AI interview preparation progress.

</p>


</div>



<button

onClick={()=>navigate("/upload")}

className="
bg-[#5B6EFF]
hover:bg-[#4759e6]
px-6
py-3
rounded-xl
font-semibold
flex
items-center
gap-2
"

>

Start Interview

<ArrowRight size={18}/>

</button>



</div>







{/* STATS */}


<div className="
grid
md:grid-cols-4
gap-6
mb-12
">


{
stats.map((item,index)=>(


<div

key={index}

className="
bg-[#0B0D12]
border
border-[#1F2430]
rounded-3xl
p-6
hover:-translate-y-1
transition
"


>


<div

className="
w-12
h-12
rounded-xl
flex
items-center
justify-center
mb-5
"

style={{
backgroundColor:`${item.color}20`,
color:item.color
}}

>

{item.icon}

</div>



<p className="
text-[#8891A0]
text-sm
">

{item.title}

</p>



<h2 className="
text-3xl
font-bold
mt-2
">

{item.value}

</h2>



</div>


))
}


</div>









{/* QUICK ACTIONS */}


<div className="
grid
md:grid-cols-3
gap-6
mb-12
">


<div
className="
bg-[#0B0D12]
border
border-[#1F2430]
rounded-3xl
p-6
"
>


<FileText
className="text-[#5B6EFF]"
size={30}
/>


<h3 className="
text-xl
font-bold
mt-5
">

Resume Analysis

</h3>


<p className="
text-[#8891A0]
mt-2
">

Upload resume and generate personalized interview questions.

</p>


<button

onClick={()=>navigate("/upload")}

className="
mt-5
text-[#5B6EFF]
"

>

Analyze Resume →

</button>


</div>







<div

className="
bg-[#0B0D12]
border
border-[#1F2430]
rounded-3xl
p-6
"

>


<Brain
className="text-[#35D399]"
size={30}
/>


<h3 className="
text-xl
font-bold
mt-5
">

AI Mock Interview

</h3>


<p className="
text-[#8891A0]
mt-2
">

Practice technical and HR rounds with AI interviewer.

</p>


<button

onClick={()=>navigate("/upload")}

className="
mt-5
text-[#35D399]
"

>

Start Practice →

</button>


</div>








<div

className="
bg-[#0B0D12]
border
border-[#1F2430]
rounded-3xl
p-6
"

>


<BarChart3
className="text-[#FFB454]"
size={30}
/>


<h3 className="
text-xl
font-bold
mt-5
">

Performance

</h3>


<p className="
text-[#8891A0]
mt-2
">

Check your previous scores and improvements.

</p>


<button

onClick={()=>navigate("/history")}

className="
mt-5
text-[#FFB454]
"

>

View Analytics →

</button>


</div>



</div>









{/* HISTORY */}



<div

className="
bg-[#0B0D12]
border
border-[#1F2430]
rounded-3xl
p-8
"

>


<div className="
flex
justify-between
items-center
mb-6
">


<h2 className="
font-display
text-3xl
font-bold
">

Recent Interviews

</h2>


<button

onClick={()=>navigate("/history")}

className="
text-[#5B6EFF]
"

>

View All

</button>


</div>



<InterviewHistory limit={5}/>



</div>






</section>



<Footer/>


</div>

);

}


export default Dashboard;