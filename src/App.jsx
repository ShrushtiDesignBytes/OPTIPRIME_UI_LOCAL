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


  const [isOn_A, setIsOn_A] = useState(false);
  const [showDialog_A, setShowDialog_A] = useState(false);
  const [showSuccessDialog_A, setShowSuccessDialog_A] = useState(false);
  const [showStopDialog_A, setShowStopDialog_A] = useState(false);
  const [errorAlertOpen_A, setErrorAlertOpen_A] = useState(false);
  const [errorMessage_A, setErrorMessage_A] = useState("");
  const [isInCooldown_A, setIsInCooldown_A] = useState(false);
  const [cooldownTimeLeft_A, setCooldownTimeLeft_A] = useState(0);
  const [isInWarmup_A, setIsInWarmup_A] = useState(false);
  const [warmupTimeLeft_A, setWarmupTimeLeft_A] = useState(0);
  // console.log(id);

  
  const [isOn_B, setIsOn_B] = useState(false);
  const [showDialog_B, setShowDialog_B] = useState(false);
  const [showSuccessDialog_B, setShowSuccessDialog_B] = useState(false);
  const [showStopDialog_B, setShowStopDialog_B] = useState(false);
  const [errorAlertOpen_B, setErrorAlertOpen_B] = useState(false);
  const [errorMessage_B, setErrorMessage_B] = useState("");
  const [isInCooldown_B, setIsInCooldown_B] = useState(false);
  const [cooldownTimeLeft_B, setCooldownTimeLeft_B] = useState(0);
  const [isInWarmup_B, setIsInWarmup_B] = useState(false);
  const [warmupTimeLeft_B, setWarmupTimeLeft_B] = useState(0);

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

  useEffect(() => {
    setId(id || 1);
  }, [id]);

  useEffect(() => {
    if (status) {
      setIsOn_A(status.genset1Status);

      // Handle cooldown information
      if (status.genset1Cooldown > 0) {
        setIsInCooldown_A(true);
        const timeLeft = Math.ceil(status.genset1Cooldown / 60000);
        setCooldownTimeLeft_A(timeLeft);
      } else {
        setIsInCooldown_A(false);
        setCooldownTimeLeft_A(0);
      }

      // Handle warmup information
      if (status.genset1Warmup > 0) {
        setIsInWarmup_A(true);
        const timeLeft = Math.ceil(status.genset1Warmup / 60000);
        setWarmupTimeLeft_A(timeLeft);
      } else {
        setIsInWarmup_A(false);
        setWarmupTimeLeft_A(0);
      }
    }
  }, [status]);

  const showErrorAlert_A = (message) => {
    setErrorMessage_A(message);
    setErrorAlertOpen_A(true);
    setTimeout(() => {
      setErrorAlertOpen_A(false);
    }, 5000);
  };

  const fetchStatusLocal_A = async () => {
    try {
      const response = await fetch(`${BASEURL}/status/${id}`);
      const status = await response.json();
      return status;
    } catch (error) {
      console.error("Error fetching status:", error);
      showErrorAlert_A("Failed to fetch latest status.");
      return null;
    }
  };

  const updateStatusON_A = async () => {
    try {
      const response = await fetch(`${BASEURL}/status/${id}`);
      const latestStatus = await response.json();

      if (latestStatus.genset1Cooldown > 0) {
        const timeLeft = Math.ceil(latestStatus.genset1Cooldown / 60000);
        showErrorAlert_A(
          `Genset 1 cannot be turned on yet. Please wait ${timeLeft} minutes.`
        );
        return false;
      }

      const optimisticData = {
        genset1Status: true,
        genset12Status: true, // At least one genset is on, so genset12Status is true
        flag: "HMI",
      };

      console.log("Updating status to ON:", optimisticData);

      const fetchOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(optimisticData),
      };

      // Perform both fetch requests in parallel
      const [localResponse, serverResponse] = await Promise.all([
        fetch(`${BASEURL}/status/${id}`, fetchOptions),
        fetch(`${SERVERURL}/status/${id}`, fetchOptions).catch(
          (serverError) => {
            return { ok: false, error: serverError };
          }
        ),
      ]);

      // Handle local response
      const localData = await localResponse.json();
      if (!localResponse.ok) {
        if (
          localData.message &&
          (localData.source === "genset1" || localData.source === "genset12")
        ) {
          showErrorAlert_A(localData.message);
          return false;
        }
        throw new Error(
          `Local update failed: ${localData.message || "Unknown error"}`
        );
      }
      console.log("Local update data:", localData);

      // Handle server response
      if (serverResponse.ok) {
        const serverData = await serverResponse.json();
        console.log("Server update data:", serverData);
      } else {
        console.error(
          "Server update failed:",
          serverResponse.error || "Unknown error"
        );
      }

      await fetchStatus();
      return true;
    } catch (error) {
      console.error("Error updating status:", error);
      showErrorAlert_A(`Failed to turn on Generator A: ${error.message}`);
      return false;
    }
  };

  const updateStatusOFF_A = async () => {
    try {
      const response = await fetch(`${BASEURL}/status/${id}`);
      const latestStatus = await response.json();

      if (latestStatus.genset1Warmup > 0) {
        const timeLeft = Math.ceil(latestStatus.genset1Warmup / 60000);
        showErrorAlert_A(
          `Genset 1 cannot be turned off yet. Please wait ${timeLeft} minutes.`
        );
        return false;
      }

      const optimisticData = {
        genset1Status: false,
        genset12Status: latestStatus.genset2Status, // True if genset2 is on, false if both are off
        flag: "HMI",
      };

      console.log("Updating status to OFF:", optimisticData);

      const fetchOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(optimisticData),
      };

      // Perform both fetch requests in parallel
      const [localResponse, serverResponse] = await Promise.all([
        fetch(`${BASEURL}/status/${id}`, fetchOptions),
        fetch(`${SERVERURL}/status/${id}`, fetchOptions).catch(
          (serverError) => {
            return { ok: false, error: serverError };
          }
        ),
      ]);

      // Handle local response
      const localData = await localResponse.json();
      if (!localResponse.ok) {
        if (
          localData.message &&
          (localData.source === "genset1" || localData.source === "genset12")
        ) {
          showErrorAlert_A(localData.message);
          return false;
        }
        throw new Error(
          `Local update failed: ${localData.message || "Unknown error"}`
        );
      }
      console.log("Local update data:", localData);

      // Handle server response
      if (serverResponse.ok) {
        const serverData = await serverResponse.json();
        console.log("Server update data:", serverData);
      } else {
        console.error(
          "Server update failed:",
          serverResponse.error || "Unknown error"
        );
      }

      await fetchStatus();
      return true;
    } catch (error) {
      console.error("Error updating status:", error);
      showErrorAlert_A(`Failed to turn off Generator A: ${error.message}`);
      return false;
    }
  };

  const toggleSwitch_A = async () => {
    const newIsOn = !isOn_A;
    setShowDialog_A(false);

    // Fetch the latest status before toggling
    const latestStatus = await fetchStatusLocal_A();
    if (!latestStatus) return;

    if (newIsOn) {
      if (isInCooldown_A) {
        showErrorAlert_A(
          `Genset 1 cannot be turned on yet. Please wait ${cooldownTimeLeft_A} minutes.`
        );
        return;
      }
      const success = await updateStatusON_A();
      if (success) {
        setIsOn_A(true);
        setShowSuccessDialog_A(true);
      }
    } else {
      if (isInWarmup_A) {
        showErrorAlert_A(
          `Genset 1 cannot be turned off yet. Please wait ${warmupTimeLeft_A} minutes.`
        );
        return;
      }
      const success = await updateStatusOFF_A();
      if (success) {
        setIsOn_A(false);
        setShowStopDialog_A(true);
      }
    }
  };

  const closeDialog_A = () => {
    setShowDialog_A(false);
  };

  const closeSuccessDialog_A = () => {
    setShowSuccessDialog_A(false);
  };

  const closeStopDialog_A = () => {
    setShowStopDialog_A(false);
  };

  const openDialog_A = () => {
    if (isInCooldown_A && !isOn_A) {
      showErrorAlert_A(
        `Genset 1 cannot be turned on yet. Please wait ${cooldownTimeLeft_A} more minutes.`
      );
      return;
    }
    if (isInWarmup_A && isOn_A) {
      showErrorAlert_A(
        `Genset 1 cannot be turned off yet. Please wait ${warmupTimeLeft_A} more minutes.`
      );
      return;
    }
    setShowDialog_A(true);
  };


    useEffect(() => {
      if (status) {
        setIsOn_B(status.genset2Status);
  
        // Use cooldown information from backend
        if (status.genset2Cooldown > 0) {
          setIsInCooldown_B(true);
          const timeLeft = Math.ceil(status.genset2Cooldown / 60000);
          setCooldownTimeLeft_B(timeLeft);
        } else {
          setIsInCooldown_B(false);
          setCooldownTimeLeft_B(0);
        }
  
        // Handle warmup information
        if (status.genset2Warmup > 0) {
          setIsInWarmup_B(true);
          const timeLeft = Math.ceil(status.genset2Warmup / 60000);
          setWarmupTimeLeft_B(timeLeft);
        } else {
          setIsInWarmup_B(false);
          setWarmupTimeLeft_B(0);
        }
      }
    }, [status]);
  
    const showErrorAlert_B = (message) => {
      setErrorMessage_B(message);
      setErrorAlertOpen_B(true);
      setTimeout(() => {
        setErrorAlertOpen_B(false);
      }, 5000);
    };
  
    const fetchStatusLocal_B = async () => {
      try {
        const response = await fetch(`${BASEURL}/status/${id}`);
        const status = await response.json();
        return status;
      } catch (error) {
        //console.error("Error fetching status:", error);
        showErrorAlert_B("Failed to fetch latest status.");
        return null;
      }
    };
  
    const updateStatusON_B = async () => {
      try {
        const response = await fetch(`${BASEURL}/status/${id}`);
        const latestStatus = await response.json();
  
        if (latestStatus.genset2Cooldown > 0) {
          const timeLeft = Math.ceil(latestStatus.genset2Cooldown / 60000);
          showErrorAlert_B(
            `Genset 2 cannot be turned on yet. Please wait ${timeLeft} minutes.`
          );
          return false;
        }
  
        const optimisticData = {
          genset2Status: true,
          genset12Status: true, // At least one genset is on, so genset12Status is true
          flag: "HMI",
        };
  
        console.log("Updating status to ON:", optimisticData);
  
        const fetchOptions = {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(optimisticData),
        };
  
        // Perform both fetch requests in parallel
        const [localResponse, serverResponse] = await Promise.all([
          fetch(`${BASEURL}/status/${id}`, fetchOptions),
          fetch(`${SERVERURL}/status/${id}`, fetchOptions).catch(
            (serverError) => {
              return { ok: false, error: serverError };
            }
          ),
        ]);
  
        // Handle local response
        const localData = await localResponse.json();
        if (!localResponse.ok) {
          if (
            localData.message &&
            (localData.source === "genset2" || localData.source === "genset12")
          ) {
            showErrorAlert_B(localData.message);
            return false;
          }
          throw new Error(
            `Local update failed: ${localData.message || "Unknown error"}`
          );
        }
        console.log("Local update data:", localData);
  
        // Handle server response
        if (serverResponse.ok) {
          const serverData = await serverResponse.json();
          console.log("Server update data:", serverData);
        } else {
          console.error(
            "Server update failed:",
            serverResponse.error || "Unknown error"
          );
        }
  
        await fetchStatus();
        return true;
      } catch (error) {
        console.error("Error updating status:", error);
        showErrorAlert_B(`Failed to turn on Generator B: ${error.message}`);
        return false;
      }
    };
  
    const updateStatusOFF_B = async () => {
      try {
        const response = await fetch(`${BASEURL}/status/${id}`);
        const latestStatus = await response.json();
  
        if (latestStatus.genset2Warmup > 0) {
          const timeLeft = Math.ceil(latestStatus.genset2Warmup / 60000);
          showErrorAlert_B(
            `Genset 2 cannot be turned off yet. Please wait ${timeLeft} minutes.`
          );
          return false;
        }
  
        const optimisticData = {
          genset2Status: false,
          genset12Status: latestStatus.genset1Status, // True if genset2 is on, false if both are off
          flag: "HMI",
        };
  
        console.log("Updating status to OFF:", optimisticData);
  
        const fetchOptions = {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(optimisticData),
        };
  
        // Perform both fetch requests in parallel
        const [localResponse, serverResponse] = await Promise.all([
          fetch(`${BASEURL}/status/${id}`, fetchOptions),
          fetch(`${SERVERURL}/status/${id}`, fetchOptions).catch(
            (serverError) => {
              return { ok: false, error: serverError };
            }
          ),
        ]);
  
        // Handle local response
        const localData = await localResponse.json();
        if (!localResponse.ok) {
          if (
            localData.message &&
            (localData.source === "genset2" || localData.source === "genset12")
          ) {
            showErrorAlert_B(localData.message);
            return false;
          }
          throw new Error(
            `Local update failed: ${localData.message || "Unknown error"}`
          );
        }
        console.log("Local update data:", localData);
  
        // Handle server response
        if (serverResponse.ok) {
          const serverData = await serverResponse.json();
          console.log("Server update data:", serverData);
        } else {
          console.error(
            "Server update failed:",
            serverResponse.error || "Unknown error"
          );
        }
  
        await fetchStatus();
        return true;
      } catch (error) {
        console.error("Error updating status:", error);
        showErrorAlert_B(`Failed to turn off Generator B: ${error.message}`);
        return false;
      }
    };
  
    const toggleSwitch_B = async () => {
      const newIsOn = !isOn_B;
      setShowDialog_B(false);
  
      // Fetch the latest status before toggling
      const latestStatus = await fetchStatusLocal_B();
      if (!latestStatus) return;
  
      if (newIsOn) {
        if (isInCooldown_B) {
          showErrorAlert_B(
            `Genset 2 cannot be turned on yet. Please wait ${cooldownTimeLeft_B} minutes.`
          );
          return;
        }
        const success = await updateStatusON_B();
        if (success) {
          setIsOn_B(true);
          setShowSuccessDialog_B(true);
        }
      } else {
        if (isInWarmup_B) {
          showErrorAlert_B(
            `Genset 2 cannot be turned off yet. Please wait ${warmupTimeLeft_B} minutes.`
          );
          return;
        }
        const success = await updateStatusOFF_B();
        if (success) {
          setIsOn_B(false);
          setShowStopDialog_B(true);
        }
      }
    };
  
    const closeDialog_B = () => {
      setShowDialog_B(false);
    };
  
    const closeSuccessDialog_B = () => {
      setShowSuccessDialog_B(false);
    };
  
    const closeStopDialog_B = () => {
      setShowStopDialog_B(false);
    };
  
    const openDialog_B = () => {
      if (isInCooldown_B && !isOn_B) {
        showErrorAlert_B(
          `Genset 2 cannot be turned on yet. Please wait ${cooldownTimeLeft_B} more minutes.`
        );
        return;
      }
      if (isInWarmup_B && isOn_B) {
        showErrorAlert_B(
          `Genset 2 cannot be turned off yet. Please wait ${warmupTimeLeft_B} more minutes.`
        );
        return;
      }
      setShowDialog_B(true);
    };

  return (
    <div className="flex h-screen custom-body overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-grow h-full w-full ml-12 transition-all duration-300">
        {/* <Navbar /> */}
        <div className="content flex-grow h-full">
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
                  isOn_A={isOn_A}
                  setIsOn_A={setIsOn_A}
                  showDialog_A={showDialog_A}
                  setShowDialog_A={setShowDialog_A}
                  showSuccessDialog_A={showSuccessDialog_A}
                  setShowSuccessDialog_A={setShowSuccessDialog_A}
                  showStopDialog_A={showStopDialog_A}
                  setShowStopDialog_A={setShowStopDialog_A}
                  errorAlertOpen_A={errorAlertOpen_A}
                  setErrorAlertOpen_A={setErrorAlertOpen_A}
                  errorMessage_A={errorMessage_A}
                  setErrorMessage_A={setErrorMessage_A}
                  isInCooldown_A={isInCooldown_A}
                  setIsInCooldown_A={setIsInCooldown_A}
                  cooldownTimeLeft_A={cooldownTimeLeft_A}
                  setCooldownTimeLeft_A={setCooldownTimeLeft_A}
                  isInWarmup_A={isInWarmup_A}
                  setIsInWarmup_A={setIsInWarmup_A}
                  warmupTimeLeft_A={warmupTimeLeft_A}
                  setWarmupTimeLeft_A={setWarmupTimeLeft_A}
                  toggleSwitch_A={toggleSwitch_A}
                  closeDialog_A={closeDialog_A}
                  openDialog_A={openDialog_A}
                  closeSuccessDialog_A={closeSuccessDialog_A}
                  closeStopDialog_A={closeStopDialog_A}
                  showErrorAlert_A={showErrorAlert_A}
                  isOn_B={isOn_B}
                  setIsOn_B={setIsOn_B}
                  showDialog_B={showDialog_B}
                  setShowDialog_B={setShowDialog_B}
                  showSuccessDialog_B={showSuccessDialog_B}
                  setShowSuccessDialog_B={setShowSuccessDialog_B}
                  showStopDialog_B={showStopDialog_B}
                  setShowStopDialog_B={setShowStopDialog_B}
                  errorAlertOpen_B={errorAlertOpen_B}
                  setErrorAlertOpen_B={setErrorAlertOpen_B}
                  errorMessage_B={errorMessage_B}
                  setErrorMessage_B={setErrorMessage_B}
                  isInCooldown_B={isInCooldown_B}
                  setIsInCooldown_B={setIsInCooldown_B}
                  cooldownTimeLeft_B={cooldownTimeLeft_B}
                  setCooldownTimeLeft_B={setCooldownTimeLeft_B}
                  isInWarmup_B={isInWarmup_B}
                  setIsInWarmup_B={setIsInWarmup_B}
                  warmupTimeLeft_B={warmupTimeLeft_B}
                  setWarmupTimeLeft_B={setWarmupTimeLeft_B}
                  toggleSwitch_B={toggleSwitch_B}
                  closeDialog_B={closeDialog_B}
                  openDialog_B={openDialog_B}
                  closeSuccessDialog_B={closeSuccessDialog_B}
                  closeStopDialog_B={closeStopDialog_B}
                  showErrorAlert_B={showErrorAlert_B}
                  
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
                  isOn_A={isOn_A}
                  setIsOn_A={setIsOn_A}
                  showDialog_A={showDialog_A}
                  setShowDialog_A={setShowDialog_A}
                  showSuccessDialog_A={showSuccessDialog_A}
                  setShowSuccessDialog_A={setShowSuccessDialog_A}
                  showStopDialog_A={showStopDialog_A}
                  setShowStopDialog_A={setShowStopDialog_A}
                  errorAlertOpen_A={errorAlertOpen_A}
                  setErrorAlertOpen_A={setErrorAlertOpen_A}
                  errorMessage_A={errorMessage_A}
                  setErrorMessage_A={setErrorMessage_A}
                  isInCooldown_A={isInCooldown_A}
                  setIsInCooldown_A={setIsInCooldown_A}
                  cooldownTimeLeft_A={cooldownTimeLeft_A}
                  setCooldownTimeLeft_A={setCooldownTimeLeft_A}
                  isInWarmup_A={isInWarmup_A}
                  setIsInWarmup_A={setIsInWarmup_A}
                  warmupTimeLeft_A={warmupTimeLeft_A}
                  setWarmupTimeLeft_A={setWarmupTimeLeft_A}
                  toggleSwitch_A={toggleSwitch_A}
                  closeDialog_A={closeDialog_A}
                  openDialog_A={openDialog_A}
                  closeSuccessDialog_A={closeSuccessDialog_A}
                  closeStopDialog_A={closeStopDialog_A}
                  showErrorAlert_A={showErrorAlert_A}
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
                  isOn_B={isOn_B}
                  setIsOn_B={setIsOn_B}
                  showDialog_B={showDialog_B}
                  setShowDialog_B={setShowDialog_B}
                  showSuccessDialog_B={showSuccessDialog_B}
                  setShowSuccessDialog_B={setShowSuccessDialog_B}
                  showStopDialog_B={showStopDialog_B}
                  setShowStopDialog_B={setShowStopDialog_B}
                  errorAlertOpen_B={errorAlertOpen_B}
                  setErrorAlertOpen_B={setErrorAlertOpen_B}
                  errorMessage_B={errorMessage_B}
                  setErrorMessage_B={setErrorMessage_B}
                  isInCooldown_B={isInCooldown_B}
                  setIsInCooldown_B={setIsInCooldown_B}
                  cooldownTimeLeft_B={cooldownTimeLeft_B}
                  setCooldownTimeLeft_B={setCooldownTimeLeft_B}
                  isInWarmup_B={isInWarmup_B}
                  setIsInWarmup_B={setIsInWarmup_B}
                  warmupTimeLeft_B={warmupTimeLeft_B}
                  setWarmupTimeLeft_B={setWarmupTimeLeft_B}
                  toggleSwitch_B={toggleSwitch_B}
                  closeDialog_B={closeDialog_B}
                  openDialog_B={openDialog_B}
                  closeSuccessDialog_B={closeSuccessDialog_B}
                  closeStopDialog_B={closeStopDialog_B}
                  showErrorAlert_B={showErrorAlert_B}
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
