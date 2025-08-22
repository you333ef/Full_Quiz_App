'use client'

import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface QuestionData {
  title: string;
  description: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
  status: string;
  difficulty: string;
  points: number;
  type: string;
}

interface QuestionConfirmationProps {
  isOpen: boolean;
  onConfirm: (data: QuestionData) => void;
  onCancel: () => void;
  initialData: any;
}

const QuestionConfirmation: React.FC<QuestionConfirmationProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  initialData,
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<QuestionData>();

  const [data, setData] = useState<any[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const defaultForm: QuestionData = {
    title: '',
    description: '',
    options: { A: '', B: '', C: '', D: '' },
    answer: '',
    status: 'active',
    difficulty: '',
    points: 1,
    type: '',
  };

  useEffect(() => {
    if (initialData && initialData._id) {
      setValue('title', initialData.title ?? '');
      setValue('description', initialData.description ?? '');
      setValue('options.A', initialData.options?.A ?? '');
      setValue('options.B', initialData.options?.B ?? '');
      setValue('options.C', initialData.options?.C ?? '');
      setValue('options.D', initialData.options?.D ?? '');
      setValue('answer', initialData.answer ?? '');
      setValue('status', initialData.status ?? 'active');
      setValue('difficulty', initialData.difficulty ?? '');
      setValue('points', initialData.points ?? 1);
      setValue('type', initialData.type ?? '');
    } else {
      Object.entries(defaultForm).forEach(([key, value]) => {
        setValue(key as keyof QuestionData, value as any);
      });
    }
  }, [initialData, setValue]);

  const fetchQuestions = async () => {
    const tokenn = localStorage.getItem('token');
    try {
      const res = await axios.get('https://upskilling-egypt.com:3005/api/question', {
        headers: {
          Authorization: `Bearer ${tokenn}`,
        },
      });

      const result = res.data;
      if (!Array.isArray(result)) throw new Error('Invalid data format from API');
      setData(result);

      const uniqueTypes = [...new Set(result.map((item: any) => item.type).filter(Boolean))];
      setTypes(uniqueTypes);
    } catch (error: any) {
      console.error('Error fetching data:', error?.message || error);
    }
  };
  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleConfirm = handleSubmit((data) => {
    onConfirm(data);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0" onClick={onCancel}></div>

      <div className="relative w-full max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
        <div className="relative px-6 py-4" style={{ backgroundColor: '#000', color: '#fff !important' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#fff' }}>
            {initialData ? 'Update question' : 'Set up a new question'}
          </h2>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleConfirm}
              className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: '#fff', color: '#000' }}
            >
              <Check size={20} className="md:w-4 md:h-4" />
            </button>
            <button
              onClick={onCancel}
              className="w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: '#fff', color: '#000' }}
            >
              <X size={20} className="md:w-4 md:h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4 max-h-80 md:max-h-96 overflow-y-auto">
          <form className="space-y-4" onSubmit={handleConfirm}>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(33, 37, 41, 1)' }}>
                Title
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                placeholder="Enter the question title"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(33, 37, 41, 1)' }}>
                Description
              </label>
              <input
                type="text"
                {...register('description', { required: 'Description is required' })}
                className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                placeholder="Enter the Description"
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Question Level</label>
              <select
                {...register('difficulty', { required: 'Level is required' })}
                className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
              >
                <option value="">Select Level</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
              {errors.difficulty && <p className="text-red-500 text-xs">{errors.difficulty.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['A', 'B', 'C', 'D'] as const).map((option) => (
                <div key={option}>
                  <label className="block text-sm font-medium mb-2">{option}</label>
                  <input
                    type="text"
                    {...register(`options.${option}`, { required: `Option ${option} is required` })}
                    className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                    style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                    placeholder={`Option: ${option}`}
                  />
                  {errors.options?.[option] && <p className="text-red-500 text-xs">{errors.options[option]?.message}</p>}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Right Answer</label>
                <select
                  {...register('answer', { required: 'Right answer is required' })}
                  className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                  style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                >
                  <option value="">Select Answer</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
                {errors.answer && <p className="text-red-500 text-xs">{errors.answer.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category type</label>
                <select
                  {...register('type', { required: 'Category type is required' })}
                  className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                  style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                >
                  <option value="">Select Category</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionConfirmation;
