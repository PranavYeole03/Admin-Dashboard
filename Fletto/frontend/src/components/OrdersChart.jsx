import {
 PieChart,
 Pie,
 Cell,
 Tooltip,
 ResponsiveContainer
} from "recharts";

const COLORS = ["#6366F1","#22c55e","#f59e0b","#ef4444"];

export default function OrdersChart({data}){

 if(!data || data.length===0){
  return (
   <div className="flex items-center justify-center h-[300px] text-gray-400">
    No Data
   </div>
  )
 }

 return(

  <div className="w-full h-[320px]">

   <ResponsiveContainer width="100%" height="100%">

    <PieChart>

     <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      outerRadius={110}
      label
     >

      {data.map((entry,index)=>(
       <Cell key={index} fill={COLORS[index % COLORS.length]} />
      ))}

     </Pie>

     <Tooltip/>

    </PieChart>

   </ResponsiveContainer>

  </div>

 )

}