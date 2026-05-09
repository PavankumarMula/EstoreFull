import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner";
import {AuthProvider} from "./contexts/authContext";

const queryClient = new QueryClient();



createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
      <Toaster
        richColors
        position="top-right"
      />
    </QueryClientProvider>
  </BrowserRouter>

)
