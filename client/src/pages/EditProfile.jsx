import React,{useState} from "react";
import {useSelector,useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {updateUser} from "../redux/userSlice";


function EditProfile(){

const user = useSelector(
(state)=>state.user.user
);


const dispatch = useDispatch();
const navigate = useNavigate();



const [form,setForm]=useState({

name:user?.name || "",
email:user?.email || ""

});



const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};





const handleSubmit=async(e)=>{

e.preventDefault();


try{


const token=localStorage.getItem("token");


const {data}=await axios.put(

"https://hiremind-server-syni.onrender.com/api/user/profile",

form,

{
headers:{
Authorization:`Bearer ${token}`
}
}

);



dispatch(updateUser(data.user));


alert("Profile Updated Successfully");


navigate("/dashboard");



}catch(error){

console.log(error);

alert(
error.response?.data?.message ||
"Update failed"
);

}


};





return(

<div className="
min-h-screen
bg-[#06070A]
text-white
">


<Navbar/>




<div className="
max-w-xl
mx-auto
px-6
py-16
">


<div className="
bg-[#0B0D12]
border
border-[#1F2430]
rounded-3xl
p-8
">


<h1 className="
text-3xl
font-bold
mb-8
">

Edit Profile

</h1>



<form
onSubmit={handleSubmit}
className="space-y-6"
>



<div>

<label className="text-[#8891A0]">

Name

</label>


<input

name="name"

value={form.name}

onChange={handleChange}

className="
w-full
mt-2
bg-[#111318]
border
border-[#1F2430]
rounded-xl
px-4
py-3
outline-none
focus:border-[#5B6EFF]
"

/>

</div>





<div>

<label className="text-[#8891A0]">

Email

</label>


<input

name="email"

value={form.email}

onChange={handleChange}

className="
w-full
mt-2
bg-[#111318]
border
border-[#1F2430]
rounded-xl
px-4
py-3
outline-none
focus:border-[#5B6EFF]
"

/>

</div>





<button

className="
w-full
bg-[#5B6EFF]
hover:bg-[#4759e6]
py-3
rounded-xl
font-semibold
"

>

Save Changes

</button>



</form>



</div>


</div>



<Footer/>

</div>

);


}


export default EditProfile;