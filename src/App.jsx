import { useState } from 'react';
import { GoalProvider } from './store/GoalContext';
import AppShell from './components/AppShell';
import GoalListView from './views/GoalListView';
import GoalDetailView from './views/GoalDetailView';
import ProgressView from './views/ProgressView';
import BackgroundView from './views/BackgroundView';

export default function App() {
  const [currentView, setCurrentView] = useState('Goals');
  const [selectedGoal, setSelectedGoal] = useState(null);

  function handleSelectGoal(goal) {
    setSelectedGoal(goal);
  }

  function handleBack() {
    setSelectedGoal(null);
  }

  function handleViewChange(view) {
    setCurrentView(view);
    setSelectedGoal(null);
  }

  function renderContent() {
    if (selectedGoal && currentView === 'Goals') {
      return <GoalDetailView goal={selectedGoal} onBack={handleBack} />;
    }
    switch (currentView) {
      case 'Goals':
        return <GoalListView onSelectGoal={handleSelectGoal} />;
      case 'Progress':
        return <ProgressView />;
      case 'Background':
        return <BackgroundView />;
      default:
        return <GoalListView onSelectGoal={handleSelectGoal} />;
    }
  }

  return (
    <GoalProvider>
      <AppShell currentView={currentView} onViewChange={handleViewChange}>
        {renderContent()}
      </AppShell>
    </GoalProvider>
  );
}
