'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Taple_SHared = dynamic(
  () => import('../../Shared_component/Taple_SHared'),
  { ssr: false }
);

import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { Dialog } from '@radix-ui/react-dialog';
import DialogDemo from '@/app/Shared_component/Dialog';
import QuestionConfirmation from '@/app/Shared_component/Conf_Quetchans';
import { toast, ToastContainer } from 'react-toastify';
import QuestionConfirmationDialog from '@/app/Shared_component/View_Quetchan';
const Confirmation = dynamic(
  () => import('../../Shared_component/Confirmation'),
  { ssr: false }
);

const Groups = () => {
  const handleView = (item: any) => {
    console.log('View:', item);
  };



  let [State_Confirmation, setStateConfirmation] = useState(false);
  let [itemConfirmation, setItemConfirmation] = useState<any>(null);
  const handleConfirmation = (item: any) => {
    setStateConfirmation(true);
    setItemConfirmation(item);
  };

  let [stateExams, setStateExams] = React.useState<any[]>([]);
  let T_Head = ['title', 'difficulty', 'type', 'description'];

  const FunGetAll = async () => {
    try {
      const tokenn = localStorage.getItem('token');
      if (!tokenn) {
        console.warn('No token found in localStorage');
        return;
      }
      const res = await axios.get('https://upskilling-egypt.com:3005/api/question?difficulty', {
        headers: {
          Authorization: `Bearer  ${tokenn}`,
        },
      });
      console.log('res', res.data);
      setStateExams(res.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    FunGetAll();
  }, []);

  console.log(stateExams, 'stateExams');

  let [statusDelete, setStatusDelete] = useState(false);
  let [itemDelete, setItemDelete] = useState(false)
  const [Name, setName] = useState('');

  const Handelation_Selete1 = (item: any) => {
    if(item && item._id){
 setStatusDelete(false);
 setTimeout(() => {
   setStatusDelete(true);
    setItemDelete(item._id);
    setName(item.description);
    console.log(item, 'item Delete');
 }, 0);


    }
  };

  const DeleteTrue = async () => {
    try {
      const response = await axios.delete(`https://upskilling-egypt.com:3005/api/question/${itemDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Delete response:', response.data);
    
      FunGetAll();
        setStatusDelete(false);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  // ===================================================

  //  const[Save_All_Without,setSave_All]=useState([])
  //  let Get_All_Without_Group=async()=>{
  //  try {
  //   let response = await axios.get(
  //     'https://upskilling-egypt.com:3005/api/student/without-group',
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     }
  //   );

  //   console.log(response.data, "response.data Without");
  //   setSave_All(response.data)
  // } catch (error) {
  //   console.error(error);
  // }

  //  }
  //  useEffect(()=>{
  //   Get_All_Without_Group()
  //  },[])

 


    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
let [Edit, setEdit] = useState(null);
 const handleConfirm = async (data: any) => {
  if (Edit && Edit?._id) {
    try {
      const tokenn = localStorage.getItem('token');
      let response = await axios.put(
        `https://upskilling-egypt.com:3005/api/question/${Edit?._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${tokenn}`,
          },
        }
      );

    toast.success(response?.data?.message, {
  style: {
    background: '#000',      
    color: '#fff',           
  },

});

      FunGetAll();
      setIsConfirmationOpen(false);

    } catch (error: any) {
   
         toast.success( error?.response?.data?.message, {
  style: {
    background: '#000',      
    color: '#fff',           
  },

});
    }

  } else {
    try {
      const tokenn = localStorage.getItem('token');
      let response = await axios.post(
        'https://upskilling-egypt.com:3005/api/question',
        data,
        {
          headers: {
            Authorization: `Bearer ${tokenn}`,
          },
        }
      );

     
         toast.success(response?.data?.message, {
  style: {
    background: '#000',      
    color: '#fff',           
  },

});
      FunGetAll();
      setIsConfirmationOpen(false);

    } catch (error: any) {
    
         toast.success(error?.response?.data?.message, {
  style: {
    background: '#000',      
    color: '#fff',           
  },

});
    }
  }
};


  const handleCancel = () => {
    setIsConfirmationOpen(false);
  };
  // View Things
  const[Sv_View,setSv_View]=useState('')
const VIET_Intro=(data:any)=>{
   setSv_View(data)
    VIEW_SECOND_STEP()
  }
  let [Quetchan,setQuetchan]=useState([])
  const VIEW_SECOND_STEP=async()=>{
     const tokenn = localStorage.getItem('token');
    try {
      if(Sv_View && Sv_View?._id){
  const response= await axios.get(`https://upskilling-egypt.com:3005/api/question/${Sv_View?._id}`, 
    {
    headers: {
      Authorization: `Bearer ${tokenn}`,
    },
    
  }
)
  setQuetchan(response)
   setOpen(true);
      }
    
    } catch (error) {
      
    }
  }
 useEffect(()=>{
VIEW_SECOND_STEP()

 },[Sv_View])
  const [open, setOpen] = useState(false);


  // Update Things 
    
  const handleEdit = (item: any) => {
    if (item && item._id) {
       setEdit(item);
        setIsConfirmationOpen(true);
       
      
   
    }
  }
  

  return (
    <div>
      <ToastContainer/>
      <div>
        <div className="flex justify-end overflow-hidden">
          <button
          onClick={() => { 
  setEdit(null); 
  setIsConfirmationOpen(true); 
}}

            className="flex items-center gap-2 border border-gray-300 px-3 md:px-4 py-1.5 rounded-full hover:bg-gray-100 transition text-xs md:text-sm font-medium"
          >
            <FaPlus className="w-4 h-4 text-end flex" />
            <span className="hidden sm:inline">New quiz</span>
          </button>
        </div>

        <div className="mt-10 overflow-hidden">
          <Taple_SHared rows={stateExams && stateExams} funView={VIET_Intro} funEdit={handleEdit} funDelete={Handelation_Selete1} T_Head={T_Head} />

          {statusDelete && (
            <Confirmation
              DeleteTrue={DeleteTrue}
              Name={Name}
            />
          )}

 <QuestionConfirmation
        isOpen={isConfirmationOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        initialData={Edit}
      />
    
          <QuestionConfirmationDialog question={Quetchan} open={open} onOpenChange={setOpen} />
        </div>
      </div>
    </div>
  );
};

export default Groups;
