import React from "react";
import { StyledEngineProvider } from '@mui/material/styles';
import './App.css';
import TaskContainer from './components/TaskContainer';

function App() {
  return (
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <TaskContainer/>
      </StyledEngineProvider>
    </React.StrictMode>
  );
}

export default App;
