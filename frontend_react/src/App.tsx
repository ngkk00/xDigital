import React, { useState, useEffect } from 'react';
import TaskList from './pages/TaskList';
import TaskCreation from './pages/TaskCreation';
import type { Skill } from './types';
import { api } from './services/api';
import './App.css';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'create'>('list');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const skillsData = await api.getSkills();
      setSkills(skillsData);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setCurrentView('list');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Assignment System</h1>
        <nav>
          <button 
            onClick={() => setCurrentView('list')}
            className={currentView === 'list' ? 'active' : ''}
          >
            Task List
          </button>
          <button 
            onClick={() => setCurrentView('create')}
            className={currentView === 'create' ? 'active' : ''}
          >
            Create Task
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'list' ? (
          <TaskList key={refreshTrigger} />
        ) : (
          <TaskCreation skills={skills} onTaskCreated={handleTaskCreated} />
        )}
      </main>
    </div>
  );
};

export default App;