/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Link, useParams } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import Image_1 from "../assets/Image (1).png";
import Thermometer from "../assets/thermometer 1.png";
import Featured_Icon from "../assets/Featured icon.png";
import MaskGroup from "../assets/Mask Group.png";
import SuccessFullIcon from "../assets/Successful icon.png";
import StopIcon from "../assets/Stop icon.png";
import Gen_Image from "../assets/Gen_Image_new.png";
import Run_Time from "../assets/run_time.png";
import Run_Frequency from "../assets/run_freqency.png";
import Run_Engine from "../assets/run_engine.png";
import Run_Coolant from "../assets/run_coolant.png";
import Run_Lube from "../assets/run_lube.png";
import Logout from "../assets/Logout-Icon.png";
import TriangleIcon from "../assets/Icon-triangle.png";
import OrangeDot from "../assets/orange_dot.png";
import Annotation from "../assets/annotation-info.png";
import PhoneCall from "../assets/phone_call.png";

const Generator_A = ({
  datas,
  BASEURL,
  status,
  SERVERURL,
  setId,
  fetchStatus,
}) => {
  const [isOn, setIsOn] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [deviceInfoOpen, setDeviceInfoOpen] = useState(false);

  // cooldown & warmup state variables
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [isInWarmup, setIsInWarmup] = useState(false);
  const [warmupTimeLeft, setWarmupTimeLeft] = useState(0);

  const myDatavizRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    setId(id || 1);
  }, [id]);

  useEffect(() => {
    if (status) {
      setIsOn(status.genset1Status);

      // Handle cooldown information
      if (status.genset1Cooldown > 0) {
        setIsInCooldown(true);
        const timeLeft = Math.ceil(status.genset1Cooldown / 60000);
        setCooldownTimeLeft(timeLeft);
      } else {
        setIsInCooldown(false);
        setCooldownTimeLeft(0);
      }

      // Handle warmup information
      if (status.genset1Warmup > 0) {
        setIsInWarmup(true);
        const timeLeft = Math.ceil(status.genset1Warmup / 60000);
        setWarmupTimeLeft(timeLeft);
      } else {
        setIsInWarmup(false);
        setWarmupTimeLeft(0);
      }
    }
  }, [status]);

  const showErrorAlert = (message) => {
    setErrorMessage(message);
    setErrorAlertOpen(true);
    setTimeout(() => {
      setErrorAlertOpen(false);
    }, 5000);
  };

  const fetchStatusLocal = async () => {
    try {
      const response = await fetch(`${BASEURL}/status/${id}`);
      const status = await response.json();
      return status;
    } catch (error) {
      console.error("Error fetching status:", error);
      showErrorAlert("Failed to fetch latest status.");
      return null;
    }
  };

  const updateStatusON = async () => {
    try {
      const response = await fetch(`${BASEURL}/status/${id}`);
      const latestStatus = await response.json();

      if (latestStatus.genset1Cooldown > 0) {
        const timeLeft = Math.ceil(latestStatus.genset1Cooldown / 60000);
        showErrorAlert(
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
          showErrorAlert(localData.message);
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
      showErrorAlert(`Failed to turn on Generator A: ${error.message}`);
      return false;
    }
  };

  const updateStatusOFF = async () => {
    try {
      const response = await fetch(`${BASEURL}/status/${id}`);
      const latestStatus = await response.json();

      if (latestStatus.genset1Warmup > 0) {
        const timeLeft = Math.ceil(latestStatus.genset1Warmup / 60000);
        showErrorAlert(
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
          showErrorAlert(localData.message);
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
      showErrorAlert(`Failed to turn off Generator A: ${error.message}`);
      return false;
    }
  };

  const toggleSwitch = async () => {
    const newIsOn = !isOn;
    setShowDialog(false);

    // Fetch the latest status before toggling
    const latestStatus = await fetchStatusLocal();
    if (!latestStatus) return;

    if (newIsOn) {
      if (isInCooldown) {
        showErrorAlert(
          `Genset 1 cannot be turned on yet. Please wait ${cooldownTimeLeft} minutes.`
        );
        return;
      }
      const success = await updateStatusON();
      if (success) {
        setIsOn(true);
        setShowSuccessDialog(true);
      }
    } else {
      if (isInWarmup) {
        showErrorAlert(
          `Genset 1 cannot be turned off yet. Please wait ${warmupTimeLeft} minutes.`
        );
        return;
      }
      const success = await updateStatusOFF();
      if (success) {
        setIsOn(false);
        setShowStopDialog(true);
      }
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  const closeStopDialog = () => {
    setShowStopDialog(false);
  };

  const openDialog = () => {
    if (isInCooldown && !isOn) {
      showErrorAlert(
        `Genset 1 cannot be turned on yet. Please wait ${cooldownTimeLeft} more minutes.`
      );
      return;
    }
    if (isInWarmup && isOn) {
      showErrorAlert(
        `Genset 1 cannot be turned off yet. Please wait ${warmupTimeLeft} more minutes.`
      );
      return;
    }
    setShowDialog(true);
  };

  const data = [
    { time: "JAN", value: 3 },
    { time: "FEB", value: 4 },
    { time: "MAR", value: 3.5 },
    { time: "APR", value: 2 },
    { time: "MAY", value: 1 },
    { time: "JUN", value: 2 },
    { time: "JUL", value: 3 },
    { time: "AUG", value: 4 },
    { time: "SEP", value: 2 },
    { time: "OCT", value: 1 },
    { time: "NOV", value: 2 },
    { time: "DEC", value: 3 },
  ];

  useEffect(() => {
    function fetchDataGraph() {
      // fetch('http://3.6.183.111:5070/device/genset-graph', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({})
      // })
      //     .then(response => response.json())
      //     .then(data => {
      //         displayDataCurveGraph(data);
      //     })
      //     .catch(error => {
      //         console.error('Error fetching data:', error);
      //     });
      displayDataCurveGraph(data);
    }

    fetchDataGraph();
  }, [data]);

  function displayDataCurveGraph(data) {
    const margin = { top: 40, right: 10, bottom: 30, left: 10 },
      width =
        myDatavizRef.current.parentElement.offsetWidth -
        margin.left -
        margin.right -
        70,
      height =
        myDatavizRef.current.parentElement.offsetHeight -
        margin.top -
        margin.bottom -
        30;

    d3.select(myDatavizRef.current).select("svg").remove();

    const svg = d3
      .select(myDatavizRef.current) // Attach to ref
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    //Read the data

    // Add X axis
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.time))
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .style("fill", "white");

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height, 0]);
    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(4)
          // eslint-disable-next-line no-unused-vars
          .tickFormat((d) => "")
      )
      .selectAll("text")
      .style("fill", "white"); // Set y-axis text color to white

    // Add the curve
    svg
      .append("path")
      .datum(data)
      .attr("clip-path", "url(#clip)")
      .attr("class", "curve")
      .attr("fill", "none")
      .attr("stroke", "#19988B")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.time) + x.bandwidth() / 2)
          .y((d) => y(d.value))
          .curve(d3.curveBasis) // Apply curve interpolation
      );

    // Define gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "shadowGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0F5416")
      .attr("stop-opacity", 0.9);

    gradient
      .append("stop")
      .attr("offset", "80%")
      .attr("stop-color", "#0F5416")
      .attr("stop-opacity", 0);

    // Add shadow line beneath the curve
    svg
      .append("path")
      .datum(data)
      .attr("clip-path", "url(#clip)")
      .attr("class", "shadow")
      .attr("fill", "url(#shadowGradient)") // Apply gradient
      .attr("stroke-width", 0) // Set stroke width to 0 to hide the outline
      .attr(
        "d",
        d3
          .area()
          .x((d) => x(d.time) + x.bandwidth() / 2)
          .y0(height) // Set baseline for the area
          .y1((d) => y(d.value)) // Set top line of the area
          .curve(d3.curveBasis) // Apply curve interpolation
      );

    // Add tooltip
    // Add tooltip
    // const tooltip = d3.select("body").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);

    // svg.selectAll('.curve, .shadow')
    //     .on('mousemove', function (event) {
    //         const [mouseX] = d3.pointer(event); // Get mouse position relative to the graph
    //         const domainValues = x.domain(); // Get time values from x-axis
    //         const bandwidth = x.bandwidth(); // Get bar width for approximation

    //         // Find the closest time value manually
    //         const index = Math.round(mouseX / bandwidth);
    //         const dClosest = data[index];

    //         if (dClosest) {
    //             tooltip
    //                 .style('opacity', 0.9)
    //                 .html(`Hour: ${dClosest.time}, Value: ${dClosest.value}`)
    //                 .style('left', `${event.pageX + 10}px`)
    //                 .style('top', `${event.pageY - 28}px`);
    //         }
    //     })
    //     .on('mouseout', function () {
    //         tooltip.style('opacity', 0);
    //     });
  }

  return (
    <div className="relative flex justify-between max-w-[100%] gap-5 p-5 h-auto">
      <div className="flex-col w-[70%] p-2">
        <div className="inline-flex items-center">
          <Link to="/">
            <button
              id="dashboardGeneratorBtn"
              className="bg-transparent text-sm text-[#DDDDDD] font-medium"
            >
              Dashboard
            </button>
          </Link>
          <p
            id="dashboardGeneratorBtn"
            className="text-sm text-[#DDDDDD] ml-1 font-medium"
          >
            &gt; Generator
          </p>
        </div>
        <div className="flex justify-between flex-[50] mt-5">
          <div className="whitespace-nowrap">
            <h3 className="font-semibold tracking-wider text-lg text-[#DDDDDD]">
              GENERATOR IRC231GHX
            </h3>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center">
              <img src={Thermometer} alt="temp" className="w-5 h-5 mt-1" />
              <h3 className="text-[#DDDDDD] ml-1 mr-5 whitespace-nowrap text-sm font-normal">
                32°C
              </h3>
            </div>

            <div className="flex items-center justify-center">
              <img src={Image_1} alt="battery" className="w-5 h-5 mt-1" />
              <h3 className="text-[#DDDDDD] ml-1 mr-5 whitespace-nowrap text-sm font-normal">
                32%
              </h3>
            </div>

            <div className="mt-1">
              {/* Cooldown indicator */}
              {isInCooldown && !isOn && (
                <div className="mb-2 p-2 bg-yellow-500 text-white rounded text-sm">
                  Cooldown: {cooldownTimeLeft} minute(s) remaining
                </div>
              )}

              {/* Warmup indicator */}
              {isInWarmup && isOn && (
                <div className="mb-2 p-2 bg-blue-500 text-white rounded text-sm">
                  Warmup: {warmupTimeLeft} minute(s) remaining
                </div>
              )}

              {/* Toggle switch with disabled styling during cooldown or warmup */}
              <div
                className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                  isOn ? "bg-green-500" : "bg-gray-400"
                } ${
                  (isInCooldown && !isOn) || (isInWarmup && isOn)
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={
                  (isInCooldown && !isOn) || (isInWarmup && isOn)
                    ? () => {
                        if (isInCooldown && !isOn) {
                          showErrorAlert(
                            `Genset 1 cannot be turned on yet. Please wait ${cooldownTimeLeft} more minutes.`
                          );
                        } else if (isInWarmup && isOn) {
                          showErrorAlert(
                            `Genset 1 cannot be turned off yet. Please wait ${warmupTimeLeft} more minutes.`
                          );
                        }
                      }
                    : openDialog
                }
              >
                <div
                  className={`w-7 h-7 bg-white rounded-full absolute top-0 transition-all duration-300 ${
                    isOn ? "translate-x-7" : "translate-x-0"
                  }`}
                ></div>
              </div>

              {/* Error Alert */}
              {errorAlertOpen && (
                <div className="fixed top-5 right-5 bg-red-500 text-white p-3 rounded shadow-lg z-50 max-w-md">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Dialog Alert */}
            {showDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#0A3D38] p-6 rounded-md shadow-lg w-auto">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10">
                      <img
                        src={Featured_Icon}
                        alt="Icon"
                        className="w-full h-full"
                      />
                    </div>
                    <button
                      className="text-white w-8 h-8"
                      onClick={closeDialog}
                    >
                      x
                    </button>
                  </div>
                  <div className="flex my-5 gap-5 justify-center items-center">
                    <img
                      src={MaskGroup}
                      alt="Mask Group"
                      className="w-36 h-28 xl:w-40 xl:h-32"
                    />
                    <div>
                      <p className="text-white text-xl font-semibold mt-4">
                        Are you sure?
                      </p>
                      {isOn ? (
                        <p className="text-[#CACCCC] text-base xl:text-lg font-normal mt-1 text-nowrap">
                          Do you really want to Stop the genset?
                        </p>
                      ) : (
                        <p className="text-[#CACCCC] text-base xl:text-lg font-normal mt-1 text-nowrap">
                          Do you really want to Start the genset?
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-7">
                    <button
                      className="bg-[#CACCCC] text-[#7A7F7F] px-3 py-1 rounded-md text-base font-semibold w-full"
                      onClick={closeDialog}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-[#19988B] text-white px-3 py-1 rounded-md text-base font-semibold w-full"
                      onClick={toggleSwitch}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showSuccessDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#0A3D38] p-6 rounded-md shadow-lg w-1/3">
                  <div className="flex justify-end">
                    <button
                      className="text-white w-8 h-8"
                      onClick={closeSuccessDialog}
                    >
                      x
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={MaskGroup}
                      alt="Mask Group"
                      className="w-36 h-28 xl:w-40 xl:h-32"
                    />
                    <div className="w-10 h-10">
                      <img
                        src={SuccessFullIcon}
                        alt="Icon"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="font-semibold text-xl text-white">
                      Genset Started Succesfully!
                    </div>
                    <div className="font-normal text-[#CACCCC] text-base text-center">
                      You can switch off anytime by clicking the power control
                      in dashboard
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showStopDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#0A3D38] p-6 rounded-md shadow-lg w-1/3">
                  <div className="flex justify-end">
                    <button
                      className="text-white w-8 h-8"
                      onClick={closeStopDialog}
                    >
                      x
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={MaskGroup}
                      alt="Mask Group"
                      className="w-36 h-28 xl:w-40 xl:h-32"
                    />
                    <div className="w-10 h-10">
                      <img
                        src={StopIcon}
                        alt="Icon"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="font-semibold text-xl text-white">
                      Genset Stopped Succesfully!
                    </div>
                    <div className="font-normal text-[#CACCCC] text-base text-center">
                      You can switch on anytime by clicking the power control in
                      dashboard
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full mt-5 bg-gradient-to-tr from-[#0A1517] via-[#0A1517] to-[#204d4c] rounded-lg p-3">
          {/* Generator Details */}
          <div className="flex flex-col md:flex-row w-full ">
            {/* Left Side: Image */}
            <div className="w-full md:w-1/2 flex justify-start m-5">
              <img src={Gen_Image} alt="Gen Details" className="w-96 h-64" />
            </div>

            {/* Right Side: Generator Stats */}
            <div className="w-full md:w-1/2 bg-[#062A30] rounded-lg p-5 m-5">
              {[
                {
                  label: "Voltage (V)",
                  id: "voltageGenset1",
                  value: datas && datas.genset1.voltage,
                },
                {
                  label: "Power (kW)",
                  id: "kwGenset1",
                  value: datas && datas.genset1.kw,
                },
                {
                  label: "Power (kVA)",
                  id: "kvaGenset1",
                  value: datas && datas.genset1.kva,
                },
                {
                  label: "Power Factor (V)",
                  id: "pfGenset1",
                  value: datas && datas.genset1.pf,
                },
                {
                  label: "Current (A)",
                  id: "currentGenset1",
                  value: datas && datas.genset1.current,
                },
                {
                  label: "Engine running hours (Hr)",
                  id: "engineRunGenset1",
                  value: datas && datas.genset1.enginerun,
                },
              ].map((item, index) => (
                <div key={index} className="flex justify-between py-2">
                  <p className="text-[#DDDDDD] font-medium text-sm opacity-60">
                    {item.label}
                  </p>
                  <p
                    className="text-[#DDDDDD] font-medium text-sm"
                    id={item.id}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Running Time Stats */}
          <div className="flex items-center p-4 mr-7">
            {/* Running Time */}
            <div className="flex flex-col items-start space-y-1 border-r border-[#204D4C] pr-10 pl-5">
              <img src={Run_Time} alt="Running Time" className="w-5 h-5" />
              <p className="text-[#C37C5A] text-sm font-medium">Running Time</p>
              <p
                className="text-[#DDDDDD] text-2xl font-semibold"
                id="runningTimeGenset1"
              >
                {datas && datas.genset1.batteryVoltage} mins
              </p>
            </div>

            {/* Frequency */}
            <div className="flex flex-col items-start space-y-1 border-r border-[#204D4C] px-10">
              <img src={Run_Frequency} alt="Frequency" className="w-5 h-5" />
              <p className="text-[#C37C5A] text-sm font-medium">Frequency</p>
              <p
                className="text-[#DDDDDD] text-2xl font-semibold"
                id="frequencyGenset1"
              >
                {datas && datas.genset1.freq} Hz
              </p>
            </div>

            {/* Engine RPM */}
            <div className="flex flex-col items-start space-y-1 border-r border-[#204D4C] px-10">
              <img src={Run_Engine} alt="Engine RPM" className="w-5 h-5" />
              <p className="text-[#C37C5A] text-sm font-medium">Engine RPM</p>
              <p
                className="text-[#DDDDDD] text-2xl font-semibold"
                id="engineRpmGenset1"
              >
                {datas && datas.genset1.engineRpm}
              </p>
            </div>

            {/* Coolant Temp */}
            <div className="flex flex-col items-start space-y-1 border-r border-[#204D4C] px-10">
              <img src={Run_Coolant} alt="Coolant Temp" className="w-5 h-5" />
              <p className="text-[#C37C5A] text-sm font-medium">Coolant Temp</p>
              <p
                className="text-[#DDDDDD] text-2xl font-semibold"
                id="coolantTempGenset1"
              >
                {datas && datas.genset1.coolerTemp}°C
              </p>
            </div>

            {/* Lube Oil Pressure */}
            <div className="flex flex-col items-start space-y-1 px-10">
              <img src={Run_Lube} alt="Lube Oil Pressure" className="w-5 h-5" />
              <p className="text-[#C37C5A] text-sm font-medium">
                Lube Oil Pressure
              </p>
              <p
                className="text-[#DDDDDD] text-2xl font-semibold"
                id="lubeOilGenset1"
              >
                {datas && datas.genset1.oilPressure} Psi
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-12 w-full">
          <p className="text-lg font-semibold text-[#DDDDDD] tracking-wider">
            Power consumption
          </p>
          <div className="inline-flex text-xs items-center">
            <div className="flex text-[#DDDDDD] items-center">
              <span className="bg-[#062A30] px-2 py-2 rounded-l-[4px] text-xs font-normal border-r-2 border-[#0A1517]">
                Today
              </span>
              <span className="bg-[#062A30] px-2 py-2 text-xs font-normal">
                Last 60 days
              </span>
            </div>
          </div>
        </div>

        <div className="bg-black flex justify-center mb-5 rounded-lg mt-5 w-full p-4 h-[240px]">
          <div
            id="my_dataviz"
            ref={myDatavizRef}
            className="w-full h-full"
          ></div>
        </div>
      </div>
      <div>
        <div className="absolute flex items-center justify-end cursor-pointer -end-2 -top-20 bg-[#172629] w-[30%] h-28">
          <div className="absolute mr-3 w-7 h-7 bg-[#062A30] rounded-full flex items-center justify-center top-5 end-12">
            <IoNotificationsOutline color="white" />
          </div>
          <div className="relative inline-block cursor-pointer group">
            <div className=" absolute end-5 -top-9 w-7 h-7 bg-[#062A30] rounded-full flex items-center justify-center">
              <CiUser color="white" className="transform scale-125" />
            </div>
            <div className="absolute right-0 hidden p-5 bg-[#0a3d38] rounded-md z-10 group-hover:block">
              <h1 className="text-white text-base whitespace-nowrap font-bold">
                Account Settings
              </h1>
              <div className="inline-flex items-center mt-2">
                <img src={Logout} alt="" width="15" height="15" />
                <button className="ml-2 text-white font-medium text-base">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute bg-[#172629] -end-2 w-[30%] h-[119vh] xl:h-[93vh] overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="w-full mt-10">
          {/* ALERT DROPDOWN */}
          <div className="inline-block w-full">
            <div
              className="flex items-center justify-between p-3 rounded-md cursor-pointer"
              onClick={() => setAlertOpen(!alertOpen)}
            >
              <div className="flex items-center">
                <img src={TriangleIcon} alt="Box 5" className="w-6 h-6" />
                <h4 className="text-[#DDDDDD] ml-2 text-base font-semibold tracking-wider">
                  ALERTS (12)
                </h4>
              </div>
              <div
                className={`transition-transform ${
                  alertOpen ? "rotate-180" : ""
                } text-white`}
              >
                <RiArrowDropDownLine className="w-8 h-8" />
              </div>
            </div>

            {alertOpen && (
              <div className="left-0 right-0 mt-2 bg-[#0A1517] w-auto m-3 text-white p-4 rounded-md z-50">
                <div className="flex-col items-center pb-4 border-b-2 border-[#062A30]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={OrangeDot} alt="" className="w-2 h-2" />
                      <p className="ml-2 text-base font-semibold text-[#187E6C]">
                        Start alert
                      </p>
                    </div>
                    <div className="text-[#DDDDDD] text-xs">10:32 am</div>
                  </div>
                  <p className="text-[#DDDDDD] text-sm mt-2 ml-4">
                    Optiprime started with 2 generator
                    <br /> configuration
                  </p>
                </div>
                <div className="flex-col items-center pt-4 pb-4 border-b-2 border-[#062A30]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={OrangeDot} alt="" className="w-2 h-2" />
                      <p className="ml-2 text-base font-semibold text-[#187E6C]">
                        Start alert
                      </p>
                    </div>
                    <div className="text-[#DDDDDD] text-xs">10:32 am</div>
                  </div>
                  <p className="text-[#DDDDDD] text-sm mt-2 ml-4">
                    Optiprime started with 2 generator
                    <br /> configuration
                  </p>
                </div>
                <div className="flex-col items-center pt-4 pb-4 border-b-2 border-[#062A30]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={OrangeDot} alt="" className="w-2 h-2" />
                      <p className="ml-2 text-base font-semibold text-[#187E6C]">
                        Start alert
                      </p>
                    </div>
                    <div className="text-[#DDDDDD] text-xs">10:32 am</div>
                  </div>
                  <p className="text-[#DDDDDD] text-sm mt-2 ml-4">
                    Optiprime started with 2 generator
                    <br /> configuration
                  </p>
                </div>
                <div className="flex-col items-center pt-4 pb-4 border-b-2 border-[#062A30]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={OrangeDot} alt="" className="w-2 h-2" />
                      <p className="ml-2 text-base font-semibold text-[#187E6C]">
                        Start alert
                      </p>
                    </div>
                    <div className="text-[#DDDDDD] text-xs">10:32 am</div>
                  </div>
                  <p className="text-[#DDDDDD] text-sm mt-2 ml-4">
                    Optiprime started with 2 generator
                    <br /> configuration
                  </p>
                </div>
                <div className="flex-col items-center pt-4 pb-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={OrangeDot} alt="" className="w-2 h-2" />
                      <p className="ml-2 text-base font-semibold text-[#187E6C]">
                        Start alert
                      </p>
                    </div>
                    <div className="text-[#DDDDDD] text-xs">10:32 am</div>
                  </div>
                  <p className="text-[#DDDDDD] text-sm mt-2 ml-4">
                    Optiprime started with 2 generator
                    <br /> configuration
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DEVICE INFO DROPDOWN */}
          <div className="inline-block w-full">
            <div
              className="flex items-center justify-between p-3 rounded-md cursor-pointer"
              onClick={() => setDeviceInfoOpen(!deviceInfoOpen)}
            >
              <div className="flex items-center">
                <img src={Annotation} alt="Box 5" className="w-6 h-6" />
                <h4 className="text-[#DDDDDD] ml-2 text-base font-semibold tracking-wider">
                  DEVICE INFO
                </h4>
              </div>
              <div
                className={`transition-transform ${
                  deviceInfoOpen ? "rotate-180" : ""
                } text-white`}
              >
                <RiArrowDropDownLine className="w-8 h-8" />
              </div>
            </div>

            {deviceInfoOpen && (
              <div className="w-full text-white px-3 rounded-md z-50">
                <div className="bg-[#0000004D] rounded-lg my-5">
                  <p className="font-semibold text-[#DDDDDD] text-base p-2">
                    Specifications
                  </p>
                </div>
                <div className="grid grid-cols-2 m-2 ml-3">
                  <div className="flex flex-col justify-start gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-medium text-sm opacity-50">
                        Location
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.deviceInfo.location}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-medium text-sm opacity-50">
                        Sys Voltage
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.deviceInfo.sysVoltage}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-medium text-sm opacity-50">
                        Cylinder
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.deviceInfo.cylinder}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                        Battery Alternator
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.deviceInfo.batteryAlternator}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                        Intake air method
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.deviceInfo.intakeAir}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                        Type
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.deviceInfo.type}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0000004D] rounded-lg my-5">
                  <p className="font-semibold text-[#DDDDDD] text-base p-2">
                    Detailed Info
                  </p>
                </div>
                <div className="grid grid-cols-2 m-2 ml-3">
                  <div className="flex flex-col justify-start gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                        Model & Make
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.systemInfo["mode&make"]}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                        Upcoming Maintanence
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.systemInfo.upcoming}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                        Intake air method
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.systemInfo.intakeAir}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                        Date of Purchase
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.systemInfo.date}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                        Last Maintanence Date
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.systemInfo.lastmaintanence}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                        Type
                      </p>
                      <p className="font-medium capitalize text-sm">
                        {datas && datas.genset1.systemInfo.type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/*Contact Information */}
        <div className="mt-5 p-3">
          <div className=" border-[#58595B] border-t-2 mb-5"></div>
          <div className="flex items-center justify-between p-3 rounded-md">
            <div className="flex items-center">
              <img src={PhoneCall} alt="Box 5" className="w-6 h-6" />
              <h4 className="text-[#DDDDDD] ml-2 text-base font-semibold tracking-wider">
                Contact Information
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-2 m-2 ml-3">
            <div className="flex flex-col justify-start gap-5 text-white">
              <div className="flex flex-col gap-1">
                <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                  Email ID
                </p>
                <p className="font-medium text-sm">admin@kirloskar.com</p>
              </div>
            </div>
            <div className="flex flex-col justify-start gap-5 text-white">
              <div className="flex flex-col gap-1">
                <p className="text-[#DDDDDD] font-normal text-sm opacity-50">
                  Mobile Number
                </p>
                <p className="font-medium text-sm">+91 9923 45678</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator_A;
