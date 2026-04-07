import { useEffect,useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function UserDetails(){

const { id } = useParams();
const navigate = useNavigate();

const [data,setData] = useState(null);

useEffect(()=>{
 fetchUser();
},[]);

const fetchUser = async () => {

 try{

  const res = await api.get(`/admin/users/${id}/details`);
  setData(res.data);

 }catch(error){
  console.log("Fetch user error",error);
 }

};

const downloadUserPDF = ()=>{

 window.open(
 `http://localhost:8000/api/admin/reports/users/${id}`,
 "_blank"
 );

};

if(!data) return <div className="p-6 text-center">Loading...</div>;

return(

<div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">

{/* HEADER */}

<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

<div className="flex items-center gap-3">

<button
onClick={()=>navigate("/dashboard/users")}
className="text-lg font-bold px-3 py-1 rounded hover:bg-gray-200"
>
<FaArrowLeftLong size={18}/>
</button>

<h1 className="text-xl md:text-2xl font-bold">
User Details
</h1>

</div>

<button
onClick={downloadUserPDF}
className="bg-green-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
>
Download PDF
</button>

</div>


{/* PROFILE */}

<div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6">

<p className="text-sm md:text-base"><b>Name:</b> {data.profile.fullName}</p>
<p className="text-sm md:text-base"><b>Email:</b> {data.profile.email}</p>
<p className="text-sm md:text-base"><b>Mobile:</b> {data.profile.mobile}</p>

</div>


{/* STATS */}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

<div className="bg-white p-4 rounded shadow">

<p className="text-gray-500 text-sm">
Total Orders
</p>

<p className="text-xl md:text-2xl font-bold">
{data.stats?.totalOrders || 0}
</p>

</div>

<div className="bg-white p-4 rounded shadow">

<p className="text-gray-500 text-sm">
Total Spent
</p>

<p className="text-xl md:text-2xl font-bold text-green-600">
₹{data.stats?.totalSpent || 0}
</p>

</div>

</div>


{/* ORDER HISTORY */}

<h2 className="text-lg md:text-xl font-semibold mb-4">
Order History
</h2>

<div className="bg-white rounded-xl shadow overflow-x-auto">

<table className="min-w-[700px] w-full text-sm md:text-base">

<thead className="bg-gray-100">

<tr>
<th className="p-3 text-left">Order</th>
<th className="p-3 text-left">Shop</th>
<th className="p-3 text-left">Amount</th>
<th className="p-3 text-left">Payment</th>
<th className="p-3 text-left">Date</th>
</tr>

</thead>

<tbody>

{data.orders.length === 0 ? (

<tr>
<td colSpan="5" className="text-center p-6 text-gray-500">
No orders found
</td>
</tr>

) : (

data.orders.map(order=>(

<tr key={order._id} className="border-t">

<td className="p-3">{order._id}</td>

<td className="p-3">
{order.shopOrders.map(s=>s.shop?.name).join(", ")}
</td>

<td className="p-3">
₹{order.totalAmount}
</td>

<td className="p-3">
{order.paymentMethod}
</td>

<td className="p-3">
{new Date(order.createdAt).toLocaleDateString()}
</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>

);

}