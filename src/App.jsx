/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import "./App.css";
import HomePage from "./Screens/HomePage";
import Generator_A from "./Screens/Generator_A";
import Generator_B from "./Screens/Generator_B";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const BASEURL = "http://localhost:5070";
  const SERVERURL = "http://13.233.155.239:5070";

  const [datas, setDatas] = useState(null);
  const [status, setStatus] = useState();
  const [id, setId] = useState(1);
  // console.log(id);

  const fetchdata = () => {
    fetch(`${BASEURL}/device/${id || 1}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        const sortedData = data.device.sort((a, b) => a.id - b.id);
        setDatas(sortedData[sortedData.length - 1]);
        //console.log(datas)
      })
      .catch((error) => {
        //console.error("Error fetching data:", error);
      });
  };

  const fetchStatus = () => {
    fetch(`${BASEURL}/status/${id || 1}`)
      .then((response) => response.json())
      .then((data) => {
        setStatus(data);
        // console.log(status);
      })
      .catch((error) => {
        //console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchdata();
    fetchStatus();

    const intervalS = setInterval(fetchStatus, 20000); // Fetch data every second
    const interval = setInterval(fetchdata, 20000); // Fetch data every second

    return () => {
      clearInterval(interval);
      clearInterval(intervalS);
    };
  }, [id]);

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/1");
    }
  }, [navigate]);

  return (
    <div className="flex h-screen custom-body">
      <Sidebar />
      <div className="flex flex-col flex-grow h-full w-full ml-12 transition-all duration-300">
        {/* <Navbar /> */}
        <div className="content flex-grow p-2 h-full">
          <Routes>
            <Route
              path="/:id"
              element={
                <HomePage
                  datas={datas}
                  BASEURL={BASEURL}
                  status={status}
                  SERVERURL={SERVERURL}
                  setId={setId}
                  fetchStatus={fetchStatus}
                />
              }
            />
            <Route
              path="/generator_a/:id"
              element={
                <Generator_A
                  datas={datas}
                  BASEURL={BASEURL}
                  status={status}
                  SERVERURL={SERVERURL}
                  setId={setId}
                  fetchStatus={fetchStatus}
                />
              }
            />
            <Route
              path="/generator_b/:id"
              element={
                <Generator_B
                  datas={datas}
                  BASEURL={BASEURL}
                  status={status}
                  SERVERURL={SERVERURL}
                  setId={setId}
                  fetchStatus={fetchStatus}
                />
              }
            />
          </Routes>
          <div className="flex items-end justify-end">
            <img src="assets/DB_logo.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
