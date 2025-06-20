import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { ResultProvider } from './context/result_context';
import style from './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ResultProvider>
        <App />
    </ResultProvider>
);
