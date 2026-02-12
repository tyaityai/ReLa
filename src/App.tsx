import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from "./components/Loading";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import AboutPage from "./pages/AboutPage";
import "./index.css";

function App() {
  const [isFirst, setIsFirst] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsFirst(false);
    }, 2400);
  }, []);

  return (
    <>
    {isFirst ? <Loading /> : (
    <BrowserRouter>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 gap-6">
        <Header />
        <main className="w-full flex justify-center">
          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/about' element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )}
  </>
  );
}

export default App;
