// src/App.tsx
// import { useState } from "react";
import "./index.css"; // Tailwind v4 を読み込む

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-8 gap-6">
      {/* header */}
      <header className="fixed flex top-4 z-50 w-[90%] items-center justify-between">
      
        {/* logo */}
        <div className="relative w-24 h-16">
          <div className="absolute"></div>
          <img src="../src/assets/ReLa.svg" alt="Logo" className="relative w-full h-full" />
        </div>

        {/* menu */}
        <nav className="flex gap-6 font-bold text-[#333333]">
          <a href="#collection" className=" hover:text-black transition">Collection</a>
          <a href="#record" className=" hover:text-black transition">Record</a>
          <a href="#about" className=" hover:text-black transition">About</a>
        </nav>

      </header>
  {/* <main className="mt-28 w-full max-w-[90%]">
    <p className="text-5xl wrap-break-word">
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    </p>
  </main>       */}
      
      
      
      
      {/* <button
        className="btn-primary"
        onClick={() => setCount((count) => count + 1)}
      >
        Click me: {count}
      </button> */}
    </div>
    
  );
}

export default App;
