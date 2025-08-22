'use client';

import HeadlessDemo from '@/app/Shared_component/Confirmation';
import Taple_Two from '@/app/Shared_component/Taple_Two';
import TemplateDemo from '@/app/Shared_component/View_Confirmation';
import axios from 'axios';
import { useEffect, useState, useMemo, useDeferredValue, useCallback, Suspense } from 'react';

const Page = () => {
  const [data_Students, setDataStudents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [saveInput, setSaveInput] = useState('');
  const [status_Confirm, setStatus_Confirm] = useState(false);
  const [id_delete, setId_Delete] = useState('');
  const [name, setName] = useState('');
  const [stateView, setStateView] = useState(false);
  const [save_info, setSave_info] = useState<any>(null);

  const itemsPerPage = 10;
  const deferredInput = useDeferredValue(saveInput);

  // Optimized API fetch with scheduling
  const fetchAllStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://upskilling-egypt.com:3005/api/student', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDataStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, []);

  // Schedule fetch on idle
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(fetchAllStudents, { timeout: 500 });
    } else {
      setTimeout(fetchAllStudents, 100);
    }
  }, [fetchAllStudents]);

  // Memoized filtered students
  const filteredStudents = useMemo(() => {
    const normalized = deferredInput.trim().toLowerCase();
    return normalized === ''
      ? data_Students
      : data_Students.filter((s) => {
          const name = `${s.first_name ?? ''} ${s.last_name ?? ''}`.toLowerCase();
          return name.includes(normalized);
        });
  }, [data_Students, deferredInput]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedData = useMemo(
    () =>
      filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredStudents, currentPage]
  );

  // Reset page if filtered data shrinks
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  // Delete handler
  const funDelete = useCallback((item: any) => {
    if (item?._id) {
      setStatus_Confirm(true);
      setId_Delete(item._id);
      setName(item.first_name);
    }
  }, []);

  const deleteTrue = useCallback(async () => {
    try {
      setStatus_Confirm(false);
      await axios.delete(`https://upskilling-egypt.com:3005/api/student/${id_delete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchAllStudents();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, [id_delete, fetchAllStudents]);

  // View handler
  const funView = useCallback((item: any) => {
    setStateView(true);
    setSave_info(item);
  }, []);

  // Memoized pagination buttons
  const paginationButtons = useMemo(() => {
    const maxVisible = 5;
    let startPage = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxVisible + 1, 1);
    }

    const pagesToShow = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return pagesToShow.map((pageNum) => (
      <button
        key={pageNum}
        onClick={() => setCurrentPage(pageNum)}
        className={`px-3 py-1 border rounded ${
          currentPage === pageNum ? 'bg-[#eaeef2]' : 'bg-[#ffffff]'
        } text-[#1f2937]`}
      >
        {pageNum}
      </button>
    ));
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#ffffff] p-4">
      <div className="mb-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center w-full md:w-2/3 lg:w-1/2 bg-[#ffffff] border border-[#e2e8f0] rounded shadow-sm overflow-hidden mx-auto justify-center mt-2.5">
            <input
              type="text"
              value={saveInput}
              onChange={(e) => {
                setSaveInput(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search students..."
              className="w-full px-3 py-2 text-sm outline-none text-[#1f2937]"
            />
            <button
              type="button"
              className="px-4 py-2 bg-[#eaeef2] text-[#000000] font-bold text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="w-full h-64 bg-[#f3f4f6] animate-pulse" />}>
        <Taple_Two
          data_Students={paginatedData}
          FunGetAll={fetchAllStudents}
          funView={funView}
          funDelete={funDelete}
        />
      </Suspense>

      {filteredStudents?.length > 0 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-[#000000] text-[#ffffff] disabled:opacity-50"
          >
            Prev
          </button>
          {paginationButtons}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-[#000000] text-[#ffffff] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {status_Confirm && <HeadlessDemo DeleteTrue={deleteTrue} Name={name} />}
      {stateView && (
        <TemplateDemo stateView={stateView} setstateView={setStateView} sampleUser={save_info} />
      )}
    </div>
  );
};

export default Page;