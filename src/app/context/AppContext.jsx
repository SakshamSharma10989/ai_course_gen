'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [topic, setTopic] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // State for quiz and module data
  const [quizData, setQuizData] = useState(null);
  const [moduleData, setModuleData] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Load persisted module data and topic once client-side
  useEffect(() => {
    try {
      const storedModuleData = localStorage.getItem('moduleData');
      const storedTopic = localStorage.getItem('currentTopic');

      if (storedModuleData && storedTopic) {
        setModuleData(JSON.parse(storedModuleData));
        setCurrentTopic(storedTopic);
      }
    } catch (e) {
      console.warn('Failed to load persisted data from localStorage:', e);
    }
  }, []);

  // Persist module data and currentTopic anytime they change
  useEffect(() => {
    try {
      if (moduleData && currentTopic) {
        localStorage.setItem('moduleData', JSON.stringify(moduleData));
        localStorage.setItem('currentTopic', currentTopic);
      }
    } catch (e) {
      console.warn('Failed to persist module data to localStorage:', e);
    }
  }, [moduleData, currentTopic]);

  // Generate modules function
  const generateModules = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to proceed.');
      return null;
    }

    setError('');
    setCurrentTopic(topic.trim());
    setIsLoading(true);
    setShowQuiz(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic.trim() }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch modules data.');

      setModuleData(data.content);

      return topic.trim();
    } catch (err) {
      setError(err.message);
      setModuleData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate quiz function (for completeness)
  const generateQuiz = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to proceed.');
      return;
    }

    setError('');
    setCurrentTopic(topic.trim());
    setIsLoading(true);
    setShowQuiz(false);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch quiz data.');

      setQuizData(data);
      setShowQuiz(true);
    } catch (err) {
      setError(err.message);
      setQuizData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        topic,
        setTopic,
        currentTopic,
        isLoading,
        error,
        quizData,
        moduleData,
        showQuiz,
        generateQuiz,
        generateModules,
        setError,
        setIsLoading,
        setQuizData,
        setModuleData,
        setShowQuiz,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
