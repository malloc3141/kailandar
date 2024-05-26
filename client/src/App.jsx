import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/usercontext";
import Home from "./pages/home";
import Login from "./pages/login";
import Mycal from "./pages/mycal";
import MyPage from "./pages/mypage";
import CustomCalendar from "./pages/customcalendar";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mycal" element={<Mycal />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/calendar" element={<CustomCalendar/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
