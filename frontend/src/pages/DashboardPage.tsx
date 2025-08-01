import React, { useState } from 'react';
import apiClient from '../api/axiosConfig';
import { User } from '../types';
import HabitsPage from './HabitsPage';
import DailiesPage from './DailiesPage';
import TodosPage from './TodosPage';
import GroupsPage from './GroupsPage'; // Import GroupsPage
import GroupDetailPage from './GroupDetailPage'; // Import GroupDetailPage

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  refreshUser: () => void;
}

// Define the possible pages the user can view in the dashboard
type DashboardView = 'habits' | 'dailies' | 'todos' | 'groups';

const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onLogout,
  refreshUser,
}) => {
  // State to track the currently active view
  const [currentView, setCurrentView] = useState<DashboardView>('habits');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
      onLogout();
    } catch (error) {
      console.error('Logout failed', error);
      onLogout();
    }
  };

  // Function to render the currently selected page
  const renderCurrentView = () => {
    // If a group is selected, always show the detail page
    if (selectedGroupId) {
      // Pass the current user and refresh function to the detail page
      return (
        <GroupDetailPage
          groupId={selectedGroupId}
          onBack={() => setSelectedGroupId(null)}
          currentUser={user}
          refreshUser={refreshUser}
        />
      );
    }

    switch (currentView) {
      case 'habits':
        return <HabitsPage refreshUser={refreshUser} />;
      case 'dailies':
        return <DailiesPage refreshUser={refreshUser} />;
      case 'todos':
        return <TodosPage refreshUser={refreshUser} />;
      case 'groups':
        // Pass the refresh function to the groups page for when a group is created
        return (
          <GroupsPage
            onViewGroup={setSelectedGroupId}
            refreshUser={refreshUser}
          />
        );
      default:
        return <HabitsPage refreshUser={refreshUser} />;
    }
  };

  return (
    <div>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2>Dashboard</h2>
          <p>
            Welcome, <strong>{user.username}!</strong>
          </p>
          <p>
            Gold: {user.gold} | Gems: {user.gems}
          </p>
        </div>
        <nav style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              setCurrentView('habits');
              setSelectedGroupId(null);
            }}
          >
            Habits
          </button>
          <button
            onClick={() => {
              setCurrentView('dailies');
              setSelectedGroupId(null);
            }}
          >
            Dailies
          </button>
          <button
            onClick={() => {
              setCurrentView('todos');
              setSelectedGroupId(null);
            }}
          >
            To-Dos
          </button>
          <button
            onClick={() => {
              setCurrentView('groups');
              setSelectedGroupId(null);
            }}
          >
            Groups
          </button>
          <button onClick={handleLogout} style={{ marginLeft: '20px' }}>
            Logout
          </button>
        </nav>
      </header>

      <hr />

      <main>{renderCurrentView()}</main>
    </div>
  );
};

export default DashboardPage;
