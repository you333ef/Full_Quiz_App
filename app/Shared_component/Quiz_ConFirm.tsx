'use client'

import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface QuizData {
  title: string;
  description: string;
  group: string;
  questions_number: number | string;
  difficulty: string;
  type: string;
  schadule: string; // datetime-local value while editing, converted to ISO on submit
  duration: number | string;
  score_per_question: number | string;
  status?: string;
  // other fields from API are ignored here (createdAt, _id, etc.)
}

interface QuestionConfirmationProps {
  isOpen: boolean;
  onConfirm: (data: any) => void; // keep flexible for parent usage
  onCancel: () => void;
  initialData: any;
}

const Quiz_ConFirm: React.FC<QuestionConfirmationProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  initialData,
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<QuizData>();

  const [types, setTypes] = useState<string[]>([]);
  const [Groups, setGroups] = useState<any[]>([]);

  const defaultForm: QuizData = {
    title: '',
    description: '',
    group: '',
    questions_number: 1,
    difficulty: '',
    type: '',
    schadule: '',
    duration: 60,
    score_per_question: 5,
    status: 'open',
  };

  // helper: normalize incoming initialData (handle { data: {...} } and {...})
  const normalizeInitial = (raw: any) => {
    if (!raw) return null;
    return raw.data ?? raw;
  };

  const toLocalDateTimeInput = (iso?: string) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      // convert to local datetime-local value (yyyy-mm-ddThh:mm)
      const tzOffset = d.getTimezoneOffset() * 60000;
      const local = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
      return local;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const quiz = normalizeInitial(initialData);
    if (quiz && (quiz._id || quiz.title)) {
      setValue('title', quiz.title ?? '');
      setValue('description', quiz.description ?? '');
      setValue('group', quiz.group ?? quiz.group?._id ?? '');
      setValue('questions_number', quiz.questions_number ?? quiz.questionsNumber ?? 1);
      setValue('difficulty', quiz.difficulty ?? '');
      setValue('type', quiz.type ?? '');
      setValue('schadule', toLocalDateTimeInput(quiz.schadule ?? quiz.schedule ?? ''));
      setValue('duration', quiz.duration ?? quiz.durationInMin ?? 60);
      setValue('score_per_question', quiz.score_per_question ?? quiz.scorePerQuestion ?? 5);
      setValue('status', quiz.status ?? 'open');
    } else {
      // set defaults
      Object.entries(defaultForm).forEach(([key, value]) => {
        setValue(key as keyof QuizData, value as any);
      });
    }
  }, [initialData, setValue]);

  // fetch question types (kept as in original file — used to populate type select)
  const fetchQuestions = async () => {
    const tokenn = localStorage.getItem('token');
    try {
      const res = await axios.get('https://upskilling-egypt.com:3005/api/question', {
        headers: { Authorization: `Bearer ${tokenn}` },
      });

      const result = res.data;
      // result could be { data: [...] } or [...]; attempt to normalize
      const arr = Array.isArray(result) ? result : (result?.data && Array.isArray(result.data) ? result.data : []);
      if (!Array.isArray(arr)) throw new Error('Invalid data format from /api/question');
      setTypes([...new Set(arr.map((item: any) => item.type).filter(Boolean))]);
    } catch (error: any) {
      console.error('Error fetching question types:', error?.message || error);
    }
  };

  const Get_Groups = async () => {
    const tokenn = localStorage.getItem('token');
    try {
      const response = await axios.get('https://upskilling-egypt.com:3005/api/group', {
        headers: { Authorization: `Bearer ${tokenn}` },
      });
      // response?.data may be array or { data: [...] }
      const groupsArr = Array.isArray(response?.data) ? response.data : (response?.data?.data ?? []);
      setGroups(groupsArr);
      // console.log for dev
      // console.log('groups', groupsArr);
    } catch (error) {
      console.log('Error In Fetching Groups', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    Get_Groups();
  }, []);

  // prepare payload and call onConfirm
  const submitHandler = handleSubmit((formValues) => {
    // convert certain fields to expected types
    const payload: any = {
      title: formValues.title,
      description: formValues.description ?? '',
      group: formValues.group,
      questions_number: Number(formValues.questions_number),
      difficulty: formValues.difficulty,
      type: formValues.type,
      // convert datetime-local (local) to ISO string:
      schadule: formValues.schadule ? new Date(formValues.schadule).toISOString() : undefined,
      duration: Number(formValues.duration),
      score_per_question: Number(formValues.score_per_question),
      status: formValues.status ?? 'open',
    };

    // if some fields are undefined, delete them (clean payload)
    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined || payload[k] === '') delete payload[k];
    });

    onConfirm(payload);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0" onClick={onCancel}></div>

      <div className="relative w-full max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
        <div className="relative px-6 py-4" style={{ backgroundColor: '#000', color: '#fff !important' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#fff' }}>
            {initialData ? 'Update Quiz' : 'Set up a new Quiz'}
          </h2>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={submitHandler}
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
          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(33, 37, 41, 1)' }}>
                Title
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                placeholder="Enter the quiz title"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(33, 37, 41, 1)' }}>
                Description
              </label>
              <input
                type="text"
                {...register('description')}
                className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                placeholder="Enter the Description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Question Level</label>
              <select
                {...register('difficulty', { required: 'Level is required' })}
                className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
              >
                <option value="">Select Level</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty && <p className="text-red-500 text-xs">{errors.difficulty.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Time (min):</label>
                <input
                  type="number"
                  {...register('duration', { required: 'Duration is required' })}
                  className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                  style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                  placeholder="Duration in minutes"
                />
                {errors.duration && <p className="text-red-500 text-xs">{errors.duration?.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Questions Number</label>
                <input
                  type="number"
                  {...register('questions_number', { required: 'Questions number is required' })}
                  className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                  style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                  placeholder="How many questions"
                />
                {errors.questions_number && <p className="text-red-500 text-xs">{errors.questions_number?.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Timetable</label>
                <input
                  type="datetime-local"
                  {...register('schadule', { required: 'Timetable is required' })}
                  className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                  style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                  placeholder="Select date and time"
                />
                {errors.schadule && <p className="text-red-500 text-xs">{errors.schadule?.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Marks/Q</label>
                <input
                  type="number"
                  {...register('score_per_question', { required: 'Score is required' })}
                  className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                  style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                  placeholder="Points per question"
                />
                {errors.score_per_question && <p className="text-red-500 text-xs">{errors.score_per_question?.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Group Name</label>
                <select
                  {...register('group', { required: 'Group is required' })}
                  className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                  style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                >
                  <option value="">Select group</option>
                  {Groups && Groups.length > 0 ? Groups.map((group) => (
                    <option key={group?._id ?? group?.id ?? group?.name} value={group?._id ?? group?.id ?? ''}>
                      {group?.name ?? group?.title ?? 'Group'}
                    </option>
                  )) : <option value="">No Groups</option>}
                </select>
                {errors.group && <p className="text-red-500 text-xs">{errors.group.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Question Type</label>
                <select
                  {...register('type', { required: 'Category type is required' })}
                  className="w-full px-4 py-3 md:px-3 md:py-2 rounded-lg border"
                  style={{ backgroundColor: 'rgba(248, 249, 250, 1)', borderColor: 'rgba(222, 226, 230, 1)', color: 'rgba(33, 37, 41, 1)' }}
                >
                  <option value="">Select type</option>
                  {types.length > 0 ? types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  )) : <option value="">No types</option>}
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

export default Quiz_ConFirm;
