import { useEffect, useState } from "react";
import api from "../services/api";
import { FiInfo, FiMail, FiFileText, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function AppInfo(){

  const [data,setData] = useState(null);

  useEffect(()=>{
    fetchInfo();
  },[]);

  const fetchInfo = async ()=>{
    try{
      const res = await api.get("/admin/settings/app-info");
      setData(res.data);
    }catch(err){
      console.log(err);
    }
  };

  if(!data){
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        Loading...
      </div>
    )
  }

  return(

    <div className="flex items-center justify-center min-h-[70vh]">

      <div className="w-full max-w-xl bg-white shadow-xl rounded-xl p-8">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Application Information
        </h2>

        <div className="space-y-4">

          {/* APP NAME */}

          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <FiInfo />
              App Name
            </div>
            <p className="font-medium">{data.appName}</p>
          </div>

          {/* VERSION */}

          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <FiInfo />
              Version
            </div>
            <p className="font-medium">{data.version}</p>
          </div>

          {/* SUPPORT EMAIL */}

          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <FiMail />
              Support Email
            </div>
            <p className="font-medium">{data.supportEmail}</p>
          </div>

          {/* TERMS CARD */}

          <div className="border rounded-xl p-5 flex items-start justify-between bg-gray-50">

            <div className="flex items-start gap-3">

              <div className="text-indigo-600 text-xl">
                <FiFileText />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Terms & Conditions
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Read the official terms and conditions for using the
                  Fletto platform including service rules and policies.
                </p>
              </div>

            </div>

            <Link
              to="/terms"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              View
            </Link>

          </div>


          {/* PRIVACY POLICY CARD */}

          <div className="border rounded-xl p-5 flex items-start justify-between bg-gray-50">

            <div className="flex items-start gap-3">

              <div className="text-indigo-600 text-xl">
                <FiShield />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Privacy Policy
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Learn how Fletto collects and protects personal data
                  for users, restaurant owners, and delivery partners.
                </p>
              </div>

            </div>

            <Link
              to="/privacy"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              View
            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}