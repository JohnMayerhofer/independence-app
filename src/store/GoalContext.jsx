import { createContext, useContext, useReducer, useCallback } from 'react';
import { loadGoals, updateSelfEval, updateTeamEval } from '../api/sheets';
import { SELF_EVAL_USER } from '../config';

const GoalContext = createContext(null);

const initialState = {
  goals: [],
  loading: false,
  error: null,
  user: null,
  canEditSelf: false,
  canEditTeam: false,
  authed: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        user: action.user,
        canEditTeam: action.canEditTeam,
        canEditSelf: action.user?.email?.toLowerCase() === SELF_EVAL_USER.toLowerCase(),
        authed: true,
      };
    case 'SIGN_OUT':
      return { ...initialState };
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_GOALS':
      return { ...state, goals: action.goals, loading: false };
    case 'ERROR':
      return { ...state, error: action.error, loading: false };
    case 'UPDATE_SELF_EVAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.rowNumber === action.rowNumber
            ? { ...g, selfStatus: action.status, selfComments: action.comments, selfUpdated: action.date }
            : g
        ),
      };
    case 'UPDATE_TEAM_EVAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.rowNumber === action.rowNumber
            ? { ...g, teamStatus: action.status, teamComments: action.comments, teamUpdated: action.date }
            : g
        ),
      };
    default:
      return state;
  }
}

export function GoalProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setAuth = useCallback((user, canEditTeam) => {
    dispatch({ type: 'SET_AUTH', user, canEditTeam });
  }, []);

  const signOut = useCallback(() => {
    dispatch({ type: 'SIGN_OUT' });
  }, []);

  const fetchGoals = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    try {
      const goals = await loadGoals();
      dispatch({ type: 'SET_GOALS', goals });
    } catch (err) {
      dispatch({ type: 'ERROR', error: err.message || 'Failed to load goals' });
    }
  }, []);

  const saveSelfEval = useCallback(async (rowNumber, status, comments) => {
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    dispatch({ type: 'UPDATE_SELF_EVAL', rowNumber, status, comments, date });
    await updateSelfEval(rowNumber, status, comments);
  }, []);

  const saveTeamEval = useCallback(async (rowNumber, status, comments) => {
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    dispatch({ type: 'UPDATE_TEAM_EVAL', rowNumber, status, comments, date });
    await updateTeamEval(rowNumber, status, comments);
  }, []);

  return (
    <GoalContext.Provider value={{ state, setAuth, signOut, fetchGoals, saveSelfEval, saveTeamEval }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoals() {
  return useContext(GoalContext);
}
