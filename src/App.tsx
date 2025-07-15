import React from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import BackgroundGrid from "./components/common/BackgroundGrid";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./router/AppRouter";

const App: React.FC = () => {
  return (
    <>
      <BackgroundGrid />
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange={false}
      >
        <div className="relative flex flex-col border bg-transparent min-h-screen">
          <AuthProvider>
            <AppRouter />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              toastClassName="text-sm"
            />
          </AuthProvider>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;