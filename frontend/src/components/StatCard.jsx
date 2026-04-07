import { motion } from "framer-motion";

export default function StatCard({ title, value }) {

 return(

 <motion.div
  initial={{opacity:0,y:20}}
  animate={{opacity:1,y:0}}
  className="bg-white shadow rounded-xl p-6"
 >

  <h3 className="text-gray-500">
   {title}
  </h3>

  <p className="text-3xl font-bold">
   {value}
  </p>

 </motion.div>

 );

}