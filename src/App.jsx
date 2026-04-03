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

  function handleViewChange(view) {
    setCurrentView(view);
    setSelectedGoal(null);
  }

  function renderContent() {
    switch (currentView) {
      case 'Goals':
        return <GoalListView onSelectGoal={setSelectedGoal} />;
      case 'Progress':
        return <ProgressView />;
      case 'Background':
        return <BackgroundView />;
      default:
        return <GoalListView onSelectGoal={setSelectedGoal} />;
    }
  }

  return (
    <GoalProvider>
      <AppShell currentView={currentView} onViewChange={handleViewChange}>
        {renderContent()}
      </AppShell>
      {selectedGoal && (
        <div className="modal-overlay" onClick={() => setSelectedGoal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedGoal(null)}>✕</button>
            <GoalDetailView goal={selectedGoal} onBack={() => setSelectedGoal(null)} />
          </div>
        </div>
      )}
    </GoalProvider>
  );
}
