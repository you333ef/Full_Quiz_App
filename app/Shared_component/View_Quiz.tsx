'use client'
import React from 'react';

interface QuizData {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  instructor: string;
  group: string;
  questions_number: number;
  questions: any[];
  schadule: string;
  duration: number;
  score_per_question: number;
  type: string;
  difficulty: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
}

interface ViewConfirmQuizProps {
  quiz: QuizData;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ViewConfirm_Quiz: React.FC<ViewConfirmQuizProps> = ({ quiz, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return { backgroundColor: '#10b981', color: '#ffffff' };
      case 'closed':
        return { backgroundColor: '#ef4444', color: '#ffffff' };
      case 'pending':
        return { backgroundColor: '#f59e0b', color: '#ffffff' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#6b7280' };
    }
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return { color: '#10b981' };
      case 'medium':
        return { color: '#f59e0b' };
      case 'hard':
        return { color: '#ef4444' };
      default:
        return { color: '#6b7280' };
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: '#fff' }}
    >
      <div 
        className="w-[100%] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e5e7eb' 
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 sm:p-6 border-b"
          style={{ borderBottomColor: '#e5e7eb' }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6" 
                fill="none" 
                stroke="#000000" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <div>
              <h2 
                className="text-lg sm:text-xl font-bold"
                style={{ color: '#000000' }}
              >
                Confirm Quiz
              </h2>
              <p 
                className="text-sm"
                style={{ color: '#6b7280' }}
              >
                Review quiz details before starting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ 
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="#000000" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Quiz Title and Code */}
          <div className="text-center space-y-2">
            <h3 
              className="text-xl sm:text-2xl font-bold"
              style={{ color: '#000000' }}
            >
              {quiz.title}
            </h3>
            <div 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
              style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#000000' 
              }}
            >
              Code: {quiz.code}
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Status */}
            <div 
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <span 
                className="text-sm sm:text-base font-medium"
                style={{ color: '#000000' }}
              >
                Status
              </span>
              <span 
                className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize"
                style={getStatusStyle(quiz.status)}
              >
                {quiz.status}
              </span>
            </div>

            {/* Duration */}
            <div 
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <span 
                className="text-sm sm:text-base font-medium"
                style={{ color: '#000000' }}
              >
                Duration
              </span>
              <span 
                className="text-sm sm:text-base font-bold"
                style={{ color: '#000000' }}
              >
                {quiz.duration} min
              </span>
            </div>

            {/* Questions */}
            <div 
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <span 
                className="text-sm sm:text-base font-medium"
                style={{ color: '#000000' }}
              >
                Questions
              </span>
              <span 
                className="text-sm sm:text-base font-bold"
                style={{ color: '#000000' }}
              >
                {quiz.questions_number}
              </span>
            </div>

            {/* Score per Question */}
            <div 
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <span 
                className="text-sm sm:text-base font-medium"
                style={{ color: '#000000' }}
              >
                Score/Question
              </span>
              <span 
                className="text-sm sm:text-base font-bold"
                style={{ color: '#000000' }}
              >
                {quiz.score_per_question} pts
              </span>
            </div>

            {/* Total Score */}
            <div 
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <span 
                className="text-sm sm:text-base font-medium"
                style={{ color: '#000000' }}
              >
                Total Score
              </span>
              <span 
                className="text-sm sm:text-base font-bold"
                style={{ color: '#000000' }}
              >
                {quiz.questions_number * quiz.score_per_question} pts
              </span>
            </div>

            {/* Difficulty */}
            <div 
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <span 
                className="text-sm sm:text-base font-medium"
                style={{ color: '#000000' }}
              >
                Difficulty
              </span>
              <span 
                className="text-sm sm:text-base font-bold capitalize"
                style={getDifficultyStyle(quiz.difficulty)}
              >
                {quiz.difficulty}
              </span>
            </div>
          </div>

          {/* Schedule Information */}
       

          {/* Action Buttons */}
          <div className="flex  flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200"
              style={{ 
                border: '1px solid #e5e7eb', 
                backgroundColor: '#ffffff',
                color: '#000000',
                cursor: 'pointer',
              
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200"
              style={{ 
                backgroundColor: '#000000', 
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Delete Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewConfirm_Quiz;