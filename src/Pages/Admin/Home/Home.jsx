import React from 'react'
import InputArrow from '../../../UI/InputArrow'
import InputField from '../../../UI/InputField'
import Loader from '../../../UI/Loader'
import { CiSearch } from "react-icons/ci";
import SwitchButton from '../../../UI/SwitchButton'
import { IoMdAdd } from "react-icons/io";
import DynamicTable from '../../../Component/DynamicTable';
const Home = () => {
 const data = [
  { id: 1, name: "Ahmed", age: 25, des: "Developer", num: 123 },
  { id: 2, name: "Sara", age: 30, des: "Designer", num: 456 },
  { id: 3, name: "Ali", age: 28, des: "Manager", num: 789 },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "des", label: "Description" },
  { key: "num", label: "Number" },
];
  return (
    <div className='w-full'>
           
 <DynamicTable
        data={data}
        columns={columns}
        rowsPerPage={10}
        currentPage={1}
        actions={(row) => (
          <button
            className="text-blue-500 underline"
            onClick={() => alert(`Edit ${row.name}`)}
          >
            Edit
          </button>
        )}
      />  
          {/* <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-one">Welcome to the Admin Dashboard</h1>
        <p className="text-gray-600">Here you can manage users, view statistics, and more.</p>
      </div>

      <div className="mt-6">
        <InputField placeholder="Search" />
        <InputArrow  placeholder="Search"/>
      </div>

      <div className="mt-6">
        <Loader />
      </div>  
      <div className="flex mt-6">
                <button className='w-[300px] text-[32px] text-white
                 transition-transform hover:scale-95 font-medium h-[72px] bg-one rounded-2xl' >
                 {transition-transform hover:scale-95 font-medium h-[72px] bg-one rounded-2xl' onClick={handleSave}>
                  Done
                </button>
              </div>
              <SwitchButton  value={"active"}/>    */}
    </div>
  )
}

export default Home