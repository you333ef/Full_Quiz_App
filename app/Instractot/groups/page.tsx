'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Taple_SHared = dynamic(
  () => import('../../Shared_component/Taple_SHared'),
  { ssr: false }
);

import { FaPlus } from "react-icons/fa";
import axios from 'axios';
import { Dialog } from '@radix-ui/react-dialog';
import DialogDemo from '@/app/Shared_component/Dialog';

const Confirmation = dynamic(
  () => import('../../Shared_component/Confirmation'),
  { ssr: false }
);

const Groups = () => {
  const handleView = (item: any) => {
    console.log("View:", item);
  };

  let [Edit, setEdit] = useState<any>(null);

  const handleEdit = (item: any) => {
    setEdit(item);
    if (item) {
      SetOpen(true);
    }
  };

  let [State_Confirmation, setStateConfirmation] = useState(false);
  let [itemConfirmation, setItemConfirmation] = useState<any>(null);
  const handleConfirmation = (item: any) => {
    setStateConfirmation(true);
    setItemConfirmation(item);
  };

  let [stateExams, setStateExams] = React.useState<any[]>([]);
  let T_Head = ['name', 'status', '_id', 'instructor', 'students'];

  const FunGetAll = async () => {
    try {
      const tokenn = localStorage.getItem("token");
      if (!tokenn) {
        console.warn("No token found in localStorage");
        return;
      }
      const res = await axios.get('https://upskilling-egypt.com:3005/api/group', {
        headers: {
          Authorization: `Bearer  ${tokenn}`,
        },
      });
      console.log("res", res.data);
      setStateExams(res.data);

    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  useEffect(() => {
    FunGetAll();
  }, []);

  console.log(stateExams, "stateExams");

  let [statusDelete, setStatusDelete] = useState(false);
  let [itemDelete, setItemDelete] = useState<any>(null);
  const [Name, setName] = useState('');

  const Handelation_Selete1 = (item: any) => {
    setStatusDelete(true);
    setItemDelete(item._id);
    setName(item.name);
    console.log(item, "item Delete");
  };

  const DeleteTrue = () => {
    setStatusDelete(false);
    axios.delete(`https://upskilling-egypt.com:3005/api/group/${itemDelete}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log("Delete response:", response.data);
        FunGetAll();
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });

  };

  const [Save_All_Without, setSave_All] = useState([]);
  let Get_All_Without_Group = async () => {
    try {
      let response = await axios.get(
        'https://upskilling-egypt.com:3005/api/student/without-group',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data, "response.data Without");
      setSave_All(response.data);
    } catch (error) {
      console.error(error);
    }

  };
  useEffect(() => {
    Get_All_Without_Group();
  }, []);

  const [Open, SetOpen] = useState(false);

  return (
    <div>
      <div>
        <div className="flex justify-end overflow-hidden">
          <button
            onClick={() => {
              setEdit(null); 
              SetOpen(true);
            }}
            className="flex items-center gap-2 border border-gray-300 px-3 md:px-4 py-1.5 rounded-full hover:bg-gray-100 transition text-xs md:text-sm font-medium"
          >
            <FaPlus className="w-4 h-4 text-end flex" />
            <span className="hidden sm:inline">New quiz</span>
          </button>
        </div>

        <div className='mt-10 overflow-hidden'>
          <Taple_SHared
            rows={stateExams && stateExams}
            funEdit={handleEdit}
            funDelete={Handelation_Selete1}
            T_Head={T_Head}
          />

          {statusDelete && (
            <Confirmation
              DeleteTrue={DeleteTrue}
              Name={Name}
            />
          )}

          <DialogDemo
            Save_All_Without={Save_All_Without}
            FunGetAll={FunGetAll}
            Get_All_Without_Group={Get_All_Without_Group}
            SetOpen={SetOpen}
            Open={Open}
            Edit={Edit}
          />
        </div>
      </div>
    </div>
  );
};

export default Groups;
