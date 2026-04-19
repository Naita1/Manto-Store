import { Toaster } from 'react-hot-toast';

export const Toast = () => {
  return (
    <Toaster 
  position="top-center"
  toastOptions={{
    style: {
      width: '95%',          
      maxWidth: '450px',   
      fontSize: '1rem',        
      padding: '16px 24px',   
      background: '#1E1E1E',  
      color: '#fff',           
      borderRadius: '12px',    
      border: '2px solid #333',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)', 
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    success: {
      duration: 4000,
      iconTheme: {
        primary: '#B22222', 
        secondary: '#fff',
      },
    },
    error: {
      duration: 5000,
      iconTheme: {
        primary: '#ff4b4b',
        secondary: '#fff',
      },
    },
  }}
/>
  );
};