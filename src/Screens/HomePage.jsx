/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { RiCalendarTodoLine } from "react-icons/ri";
import { IoFilter } from "react-icons/io5";
import { Link } from "react-router-dom";
import Current from "../assets/current.png";
import Voltage from "../assets/voltage.png";
import MaskGroup from "../assets/Mask Group.png";
import Power from "../assets/power.png";
import KVA from "../assets/kva.png";
import Frequency from "../assets/frequency.png";
import FeaturedIcon from "../assets/Featured icon.png";
import SuccessfullIcon from "../assets/Successful icon.png";
import StopIcon from "../assets/Stop icon.png";
import Wave from "../assets/wave.gif";
import Static_Wave from "../assets/static_wave.png";
import Gen_Image from "../assets/Gen_Image.png";
import Time from "../assets/Time.png";
import Antenna from "../assets/Antenna.png";
import Guage from "../assets/Gauge.png";
import Cold from "../assets/Cold.png";
import Development from "../assets/Development.png";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import BreakerOpen from '../assets/breakeropen.png';
import BreakerClose from '../assets/breakerclose.png';
import Featured_Icon from "../assets/Featured icon.png";
import SuccessFullIcon from "../assets/Successful icon.png";
import { useNavigate } from "react-router-dom";

const HomePage = ({
  datas,
  BASEURL,
  SERVERURL,
  status,
  setId,
  fetchStatus,
  isOn_A,
  showDialog_A,
  showSuccessDialog_A,
  showStopDialog_A,
  errorAlertOpen_A,
  errorMessage_A,
  isInCooldown_A,
  cooldownTimeLeft_A,
  isInWarmup_A,
  warmupTimeLeft_A,
  toggleSwitch_A,
  openDialog_A,
  closeDialog_A,
  closeStopDialog_A,
  closeSuccessDialog_A,
  showErrorAlert_A,
  isOn_B,
  showDialog_B,
  showSuccessDialog_B,
  showStopDialog_B,
  errorAlertOpen_B,
  errorMessage_B,
  isInCooldown_B,
  cooldownTimeLeft_B,
  isInWarmup_B,
  warmupTimeLeft_B,
  toggleSwitch_B,
  openDialog_B,
  closeDialog_B,
  closeStopDialog_B,
  closeSuccessDialog_B,
  showErrorAlert_B
}) => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [isOn, setIsOn] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);

  // cooldown & warmup state variables
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [isInWarmup, setIsInWarmup] = useState(false);
  const [warmupTimeLeft, setWarmupTimeLeft] = useState(0);

  //const [isToggleClicked_A, setisToggleClicked_A] = useState(false);
  const [isToggleClicked_B, setisToggleClicked_B] = useState(false);
  const myDatavizRef = useRef(null);
  const location = useLocation();

  // useEffect(() => {
  //   setIsOn(status ? status.genset12Status : false);
  // }, [status]);

  useEffect(() => {
    setIsOn(status ? status.genset12Status : false);

    if (status) {
      // Handle cooldown for both gensets
      if (status.genset1Cooldown > 0 || status.genset2Cooldown > 0) {
        setIsInCooldown(true);
        const timeLeft = Math.max(
          Math.ceil(status.genset1Cooldown / 60000),
          Math.ceil(status.genset2Cooldown / 60000)
        );
        setCooldownTimeLeft(timeLeft);
      } else {
        setIsInCooldown(false);
        setCooldownTimeLeft(0);
      }

      // Handle warmup for both gensets
      if (status.genset1Warmup > 0 || status.genset2Warmup > 0) {
        setIsInWarmup(true);
        const timeLeft = Math.max(
          Math.ceil(status.genset1Warmup / 60000),
          Math.ceil(status.genset2Warmup / 60000)
        );
        setWarmupTimeLeft(timeLeft);
      } else {
        setIsInWarmup(false);
        setWarmupTimeLeft(0);
      }
    }
  }, [status]);

  useEffect(() => {
    setId(id || 1);
  }, [id]);

  const showErrorAlert = (message) => {
    setErrorMessage(message);
    setErrorAlertOpen(true);
    setTimeout(() => {
      setErrorAlertOpen(false);
    }, 5000);
  };

  const data = [
    { hour: 1, voltage: 12.27 },
    { hour: 2, voltage: 12.3 },
    { hour: 3, voltage: 12.32 },
    { hour: 4, voltage: 12.32 },
    { hour: 5, voltage: 12.29 },
    { hour: 6, voltage: 12.27 },
    { hour: 7, voltage: 12.26 },
    { hour: 8, voltage: 12.32 },
    { hour: 9, voltage: 12.32 },
    { hour: 10, voltage: 12.29 },
    { hour: 11, voltage: 12.3 },
    { hour: 12, voltage: 12.24 },
  ];

  /*
  const updateStausON = () => {
    // Optimistic UI Update (optional)
    const optimisticData = {
      genset12Status: true,
      genset1Status: true,
      genset2Status: true,
      flag: "HMI",
    };
    console.log("UI updated optimistically:", optimisticData);

    // Define fetch options
    const fetchOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(optimisticData),
    };

    // Perform both fetches in parallel using Promise.all
    Promise.all([
      fetch(`${BASEURL}/status/${id}`, fetchOptions)
        .then((response) => response.json())
        .catch((error) => console.error("Local update failed:", error)),

      fetch(`${SERVERURL}/status/${id}`, fetchOptions)
        .then((response) => response.json())
        .catch((error) => console.error("Server update failed:", error)),
    ])
      .then(([localData, serverData]) => {
        if (localData) console.log("Local update data:", localData);
        if (serverData) console.log("Server update data:", serverData);
      })
      .catch((error) => {
        console.error("Error in parallel fetch:", error);
      });
  };
  */

  /*
  const updateStausOFF = () => {
    const optimisticData = {
      genset12Status: false,
      genset1Status: false,
      genset2Status: false,
      flag: "HMI",
    };
    console.log("UI updated optimistically:", optimisticData);

    // Define fetch options
    const fetchOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(optimisticData),
    };

    // Perform both fetches in parallel using Promise.all
    Promise.all([
      fetch(`${BASEURL}/status/${id}`, fetchOptions)
        .then((response) => response.json())
        .catch((error) => console.error("Local update failed:", error)),

      fetch(`${SERVERURL}/status/${id}`, fetchOptions)
        .then((response) => response.json())
        .catch((error) => console.error("Server update failed:", error)),
    ])
      .then(([localData, serverData]) => {
        if (localData) console.log("Local update data:", localData);
        if (serverData) console.log("Server update data:", serverData);
      })
      .catch((error) => {
        console.error("Error in parallel fetch:", error);
      });
  };
  */

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

      if (
        latestStatus.genset1Cooldown > 0 ||
        latestStatus.genset2Cooldown > 0
      ) {
        const timeLeft = Math.max(
          Math.ceil(latestStatus.genset1Cooldown / 60000),
          Math.ceil(latestStatus.genset2Cooldown / 60000)
        );
        showErrorAlert(
          `Gensets cannot be turned on yet. Please wait ${timeLeft} more minutes.`
        );
        return false;
      }

      const optimisticData = {
        genset12Status: true,
        genset1Status: true,
        genset2Status: true,
        flag: "HMI",
      };

      console.log("Updating status to ON:", optimisticData);

      const fetchOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(optimisticData),
      };

      const localResponse = await fetch(
        `${BASEURL}/status/${id}`,
        fetchOptions
      );
      const localData = await localResponse.json();

      if (!localResponse.ok) {
        if (
          localData.message &&
          (localData.source === "genset1" ||
            localData.source === "genset2" ||
            localData.source === "genset12")
        ) {
          showErrorAlert(localData.message);
          return false;
        }
        throw new Error(
          `Local update failed: ${localData.message || "Unknown error"}`
        );
      }

      console.log("Local update data:", localData);

      try {
        const serverResponse = await fetch(
          `${SERVERURL}/status/${id}`,
          fetchOptions
        );
        if (serverResponse.ok) {
          const serverData = await serverResponse.json();
          console.log("Server update data:", serverData);
        } else {
          console.error(
            "Server update failed with status:",
            serverResponse.status
          );
        }
      } catch (serverError) {
        console.error("Server update failed:", serverError);
      }

      await fetchStatus();
      return true;
    } catch (error) {
      console.error("Error updating status:", error);
      showErrorAlert(`Failed to turn on Gensets: ${error.message}`);
      return false;
    }
  };

  const updateStatusOFF = async () => {
    try {
      const response = await fetch(`${BASEURL}/status/${id}`);
      const latestStatus = await response.json();

      // Check warmup period
      if (latestStatus.genset1Warmup > 0 || latestStatus.genset2Warmup > 0) {
        const timeLeft = Math.max(
          Math.ceil(latestStatus.genset1Warmup / 60000),
          Math.ceil(latestStatus.genset2Warmup / 60000)
        );
        showErrorAlert(
          `Gensets cannot be turned off yet. Please wait ${timeLeft} more minutes.`
        );
        return false;
      }

      const optimisticData = {
        genset12Status: false,
        genset1Status: false,
        genset2Status: false,
        flag: "HMI",
      };

      console.log("Updating status to OFF:", optimisticData);

      const fetchOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(optimisticData),
      };

      const localResponse = await fetch(
        `${BASEURL}/status/${id}`,
        fetchOptions
      );
      const localData = await localResponse.json();

      if (!localResponse.ok) {
        if (
          localData.message &&
          (localData.source === "genset1" ||
            localData.source === "genset2" ||
            localData.source === "genset12")
        ) {
          showErrorAlert(localData.message);
          return false;
        }
        throw new Error(
          `Local update failed: ${localData.message || "Unknown error"}`
        );
      }

      console.log("Local update data:", localData);

      try {
        const serverResponse = await fetch(
          `${SERVERURL}/status/${id}`,
          fetchOptions
        );
        if (serverResponse.ok) {
          const serverData = await serverResponse.json();
          console.log("Server update data:", serverData);
        } else {
          console.error(
            "Server update failed with status:",
            serverResponse.status
          );
        }
      } catch (serverError) {
        console.error("Server update failed:", serverError);
      }

      await fetchStatus();
      return true;
    } catch (error) {
      console.error("Error updating status:", error);
      showErrorAlert(`Failed to turn off Gensets: ${error.message}`);
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
          `Gensets cannot be turned on yet. Please wait ${cooldownTimeLeft} more minutes.`
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
          `Gensets cannot be turned off yet. Please wait ${warmupTimeLeft} more minutes.`
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
        `Gensets cannot be turned on yet. Please wait ${cooldownTimeLeft} more minutes.`
      );
      return;
    }
    if (isInWarmup && isOn) {
      showErrorAlert(
        `Gensets cannot be turned off yet. Please wait ${warmupTimeLeft} more minutes.`
      );
      return;
    }
    setShowDialog(true);
  };

  useEffect(() => {
    function fetchDataGraph() {
      // fetch(`${BASEURL}/device/dashboard-graph`, {
      //     method: "POST",
      //     headers: {
      //         "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({}),
      // })
      //     .then((response) => response.json())
      //     .then((data) => {
      //         displayDataGraph(data);

      //     })
      //     .catch((error) => {
      //         console.error("Error fetching data:", error);
      //     });
      displayDataGraph(data);
    }
    // if (data.length > 0) {
    //     displayDataGraph(data);
    // }

    fetchDataGraph();
  }, [data]);

  function displayDataGraph(data) {
    const margin = { top: 40, right: 50, bottom: 50, left: 60 },
      width =
        myDatavizRef.current.parentElement.offsetWidth -
        margin.left -
        margin.right -
        70,
      height =
        myDatavizRef.current.parentElement.offsetHeight -
        margin.top -
        margin.bottom;

    d3.select(myDatavizRef.current).select("svg").remove();

    const svg = d3
      .select(myDatavizRef.current) // Attach to ref
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Dynamic X and Y axis range
    const xMin = d3.min(data, (d) => d.hour);
    const xMax = d3.max(data, (d) => d.hour);
    const yMin = d3.min(data, (d) => d.voltage);
    const yMax = d3.max(data, (d) => d.voltage);

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "lineGradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "34%")
      .attr("stop-color", "#9E6B5257")
      .attr("stop-opacity", 1);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#5D3B2B00")
      .attr("stop-opacity", 0);

    //X axis
    const x = d3
      .scaleLinear()
      .domain([xMin - 1, xMax]) // Extend domain to start from 00
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(d3.range(xMin - 1, xMax + 1))
          .tickFormat((d) =>
            d === xMin - 1 ? "" : d.toString().padStart(2, "0")
          )
      )
      .selectAll("text")
      .style("fill", "white");

    // Y axis
    const y = d3
      .scaleLinear()
      .domain([Math.floor(yMin * 100) / 100, Math.ceil(yMax * 100) / 100])
      .range([height, 0]);
    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickValues(
            d3.range(
              Math.floor(yMin * 100) / 100,
              Math.ceil(yMax * 100) / 100 + 0.02,
              0.02
            )
          )
          .tickFormat(d3.format(".2f"))
      )
      .selectAll("text")
      .style("fill", "white");

    // Grid lines
    // svg.append("g")
    //     .attr("class", "grid")
    //     .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
    //     .selectAll("line")
    //     .style("stroke", "#58595B")
    //     .style("opacity", 0.5);

    const yTickValues = d3.range(
      Math.floor(yMin * 100) / 100,
      Math.ceil(yMax * 100) / 100 + 0.02,
      0.02
    );
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(y).tickValues(yTickValues).tickSize(-width).tickFormat("")
      )
      .selectAll("line")
      .style("stroke", "#58595B")
      .style("opacity", 0.5);

    //shadow
    const area = d3
      .area()
      .x((d) => x(d.hour))
      .y0(height)
      .y1((d) => y(d.voltage));

    svg
      .append("path")
      .datum(data)
      .attr("clip-path", "url(#clip)")
      .attr("class", "shadow")
      .attr("d", area)
      .attr("fill", "url(#lineGradient)");

    // Line chart
    svg
      .append("path")
      .datum(data)
      .attr("clip-path", "url(#clip)")
      .attr("class", "curve")
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.hour))
          .y((d) => y(d.voltage))
      )
      .attr("stroke", "orange")
      .style("stroke-width", 1)
      .style("fill", "none");

    // const tooltip = d3.select("body").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);

    // svg.selectAll('.curve, .shadow')
    //     .on('mousemove', function (event) {
    //         const [mouseX] = d3.pointer(event);
    //         const stepSize = width / (xMax - xMin);
    //         const index = Math.round((mouseX / stepSize) + xMin);
    //         const dClosest = data.find(d => d.hour === index);

    //         if (dClosest) {
    //             tooltip
    //                 .style('opacity', 0.9)
    //                 .html(`Hour: ${dClosest.hour}, Voltage: ${dClosest.voltage}`)
    //                 .style('left', `${event.pageX + 10}px`)
    //                 .style('top', `${event.pageY - 28}px`);
    //         }
    //     })
    //     .on('mouseout', function () {
    //         tooltip.style('opacity', 0);
    //     });
  }

  return (
    <div className="p-4">
      <div className="flex-col gap-3">
        <div className="flex gap-3">
          <div className="inline-flex gap-8 items-center p-4 rounded-md w-full">
            <div className="bg-[#051E1C] h-64 w-64 xl:h-72 xl:w-96 rounded-lg flex items-center justify-center">
              <img
                src={MaskGroup}
                alt="Mask Group"
                className="w-44 h-36 xl:w-60 xl:h-48"
                key={location.pathname}
              />
            </div>
            <div className="flex flex-col text-left gap-5">
              <p className="text-lg xl:text-xl font-semibold text-[#DDDDDD] ml-4 tracking-wider">
                OPTIPRIME PARAMETERS
              </p>
              <div className="grid grid-cols-3 mt-4 w-full">
                <div className="flex flex-col border-r border-[#204D4C] pr-5">
                  <div className="flex justify-start items-center">
                    <img src={Voltage} alt="Voltage" className="w-14 h-14" />
                    <p className="text-[#C37C5A] text-sm xl:text-base xl:text-base font-medium -ml-2">
                      Voltage
                    </p>
                  </div>
                  <p
                    className="text-[#DDDDDD] font-semibold text-[28px] xl:text-[32px] ml-4 -mt-3"
                    id="voltageCommon"
                  >
                    {datas && datas.common.voltage} V
                  </p>
                </div>
                <div className="flex flex-col border-r border-[#204D4C] pl-8 pr-8 xl:pl-14 xl:pr-16">
                  <div className="flex justify-start items-center">
                    <img src={Current} alt="Current" className="w-14 h-14" />
                    <p className="text-[#C37C5A] text-sm xl:text-base xl:text-base font-medium -ml-2">
                      Current
                    </p>
                  </div>
                  <p
                    className="text-[#DDDDDD] font-semibold text-[28px] xl:text-[32px] ml-4 -mt-3"
                    id="currentACommon"
                  >
                    {datas && datas.common.current} Amp
                  </p>
                </div>
                <div className="flex flex-col pl-8 xl:pl-16">
                  <div className="flex justify-start items-center">
                    <img src={Power} alt="Power" className="w-14 h-14" />
                    <p className="text-[#C37C5A] text-sm xl:text-base xl:text-base font-medium -ml-2">
                      Power
                    </p>
                  </div>
                  <p
                    className="text-[#DDDDDD] font-semibold text-[28px] xl:text-[32px]  ml-4 -mt-3"
                    id="powerCommon"
                  >
                    {datas && datas.common.power} Kw
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 mt-4 w-full">
                <div className="flex flex-col border-r border-[#204D4C] pr-5">
                  <div className="flex justify-start items-center">
                    <img src={KVA} alt="KVA" className="w-14 h-14" />
                    <p className="text-[#C37C5A] text-sm xl:text-base xl:text-base font-medium -ml-2">
                      KVA
                    </p>
                  </div>
                  <p
                    className="text-[#DDDDDD] font-semibold text-[28px] xl:text-[32px] ml-4 -mt-3"
                    id="kvaCommon"
                  >
                    {datas && datas.common.kva}
                  </p>
                </div>
                <div className="flex flex-col pl-8 xl:pl-12">
                  <div className="flex justify-start items-center">
                    <img
                      src={Frequency}
                      alt="Frequency"
                      className="w-14 h-14"
                    />
                    <p className="text-[#C37C5A] text-sm xl:text-base xl:text-base font-medium -ml-2">
                      Frequency
                    </p>
                  </div>
                  <p
                    className="text-[#DDDDDD] font-semibold text-[28px] xl:text-[32px] ml-4 -mt-3"
                    id="frequencyCommon"
                  >
                    {datas && datas.common.freq} Hz
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black rounded-md w-[30%]">
            <div className="pt-5 px-5">
              <p className="text-[#DDDDDD] text-nowrap font-semibold text-lg xl:text-xl tracking-wide">
                POWERGEN CONTROLS
              </p>

              {/* Cooldown indicator */}
              {isInCooldown && !isOn && (
                <div className="mt-6 p-2 xl:p-4 bg-yellow-500 text-white rounded text-sm xl:text-base">
                  Cooldown: {cooldownTimeLeft} minute(s) remaining
                </div>
              )}

              {/* Warmup indicator */}
              {isInWarmup && isOn && (
                <div className="mt-6 p-2 xl:p-4 bg-blue-500 text-white rounded text-sm xl:text-base">
                  Warmup: {warmupTimeLeft} minute(s) remaining
                </div>
              )}

              <div className="flex justify-between mt-10 items-center">
                <span className="grid">
                  <p className="text-[#C37C5A] text-sm xl:text-base">Running Time</p>
                  <p className="text-[#DDDDDD] font-semibold text-[28px] xl:text-[32px]">
                    30 mins
                  </p>
                </span>
                <div className="mt-1">
                  {/* Toggle switch with disabled styling during cooldown or warmup */}
                  <div
                    className={`w-14 h-7 rounded-full relative transition-all duration-300 ${isOn ? "bg-green-500" : "bg-gray-400"
                      } ${(isInCooldown && !isOn) || (isInWarmup && isOn)
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                      }`}
                    onClick={
                      (isInCooldown && !isOn) || (isInWarmup && isOn)
                        ? () => {
                          if (isInCooldown && !isOn) {
                            showErrorAlert(
                              `Gensets cannot be turned on yet. Please wait ${cooldownTimeLeft} more minutes.`
                            );
                          } else if (isInWarmup && isOn) {
                            showErrorAlert(
                              `Gensets cannot be turned off yet. Please wait ${warmupTimeLeft} more minutes.`
                            );
                          }
                        }
                        : openDialog
                    }
                  >
                    <div
                      className={`w-7 h-7 bg-white rounded-full absolute top-0 transition-all duration-300 ${isOn ? "translate-x-7" : "translate-x-0"
                        }`}
                    ></div>
                  </div>
                </div>
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
                        src={FeaturedIcon}
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
                  <div className="flex gap-2 xl:p-4 mt-7">
                    <button
                      className="bg-[#CACCCC] text-[#7A7F7F] px-3 py-1 xl:py-3 rounded-md text-base font-semibold w-full"
                      onClick={closeDialog}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-[#19988B] text-white px-3 py-1 xl:py-3 rounded-md text-base font-semibold w-full"
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
                        src={SuccessfullIcon}
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
            {isOn ? (
              <img
                src={Wave}
                alt="Background Animation"
                className="rounded-md w-full h-[120px] mt-8"
              />
            ) : (
              <img
                src={Static_Wave}
                alt="Background"
                className="rounded-md w-full h-[120px] mt-8"
              />
            )}
          </div>
        </div>
        <div className="flex justify-between mt-5 w-full">
          <p className="text-[#DDDDDD] text-lg xl:text-xl font-semibold tracking-wider">
            ELECTRICAL QUALITY PARAMETERS
          </p>
          <div className="inline-flex text-xs xl:text-sm pr-1">
            <div className="flex text-[#DDDDDD] items-center">
              <span className="bg-[#0A3D38] px-2 py-2 rounded-l-[4px] text-xs xl:text-sm font-normal border-r-2 border-[#0F5B53]">
                Today
              </span>
              <span className="bg-[#0A3D38] px-2 py-2 text-xs xl:text-sm font-normal border-r-2 border-[#0F5B53]">
                Last 10 days
              </span>
              <span className="bg-[#0A3D38] px-2 py-2 text-xs xl:text-sm font-normal border-r-2 border-[#0F5B53]">
                Last 30 days
              </span>
              <span className="bg-[#0A3D38] px-2 py-2 rounded-r-[4px] text-xs xl:text-sm font-normal">
                Last 60 days
              </span>
            </div>
            <div className="flex items-center mx-2 bg-[#0A3D38] px-2 py-1 rounded-[4px] text-[#DDDDDD]">
              <RiCalendarTodoLine
                color="#DDDDDD"
                className="w-3 h-3 font-bold mr-1"
              />
              <span className="text-xs xl:text-sm font-normal">Select Dates</span>
            </div>
            <span className="bg-[#0A3D38] px-2 py-2 rounded-[4px] text-[#DDDDDD] text-xs xl:text-sm font-normal flex items-center">
              {" "}
              <IoFilter
                color="#DDDDDD"
                className="w-3 h-3 font-bold mr-1"
              />{" "}
              Filter
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* <Link to={`/generator_a/${id}`} className="text-decoration-none"> */}
          <div oonClick={(e) => {
            // Prevent navigate if click was on toggle or its children
            const isInsideToggle = e.target.closest(".genset-toggle");
            if (isInsideToggle) {
              console.log("Toggle clicked, prevent navigation");
              return;
            }

            console.log("Card clicked, navigating");
            navigate(`/generator_a/${id}`);
          }} className="mt-8 p-4 xl:p-6 rounded-lg bg-[#030F0E] w-full transition-all duration-200 hover:shadow-[#204D4C] hover:shadow-2xl hover:bg-gradient-to-tl hover:from-[#030F0E] hover:via-[#030F0E] hover:via-60% hover:to-[#204D4C]">
            <div className="text-[#DDDDDD] text-base font-semibold pb-2">
              Genset-1
            </div>
            <div className="relative grid grid-cols-3 gap-4 text-xs xl:text-sm text-[#C37C5A] pb-4">
              <div className="flex items-start">
                <img src={Gen_Image} alt="" className="w-36 h-24 xl:w-40 xl:h-28" />
              </div>
              <div className="flex items-end justify-start gap-3">
                <img src={Time} alt="" className="w-10 h-10 mb-1.5" />
                <div className="flex flex-col">
                  <div className="text-xs xl:text-sm">Running Time</div>
                  <div className="text-[#DDDDDD] text-lg xl:text-xl font-semibold">
                    {datas && datas.genset1.batteryVoltage} mins
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="flex items-center justify-end gap-4">
                  {isOn_A ? <div className="flex items-center justify-center">
                    <div className="flex items-center justify-center gap-2">
                      <img src={BreakerClose} alt="battery" className="w-2 h-5 xl:w-3 xl:h-6" />
                      <h3 className="text-[#DDDDDD] ml-1 mr-5 whitespace-nowrap text-sm xl:text-base font-normal">
                        Close
                      </h3>
                    </div>
                  </div>

                    : <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center gap-2">
                        <img src={BreakerOpen} alt="battery" className="w-2 h-5 xl:w-3 xl:h-6" />
                        <h3 className="text-[#DDDDDD] ml-1 mr-5 whitespace-nowrap text-sm xl:text-base font-normal">
                          Open
                        </h3>
                      </div>
                    </div>}


                  <div className="flex items-center gap-3">
                    {/* Cooldown indicator */}
                    {isInCooldown_A && !isOn_A && (
                      <div className="absolute right-48 mb-2 px-4 py-2 bg-yellow-500 text-white rounded text-sm xl:text-base w-fit whitespace-nowrap">
                        Cooldown: {cooldownTimeLeft_A} minute(s) remaining
                      </div>
                    )}


                    {/* Warmup indicator */}
                    {isInWarmup_A && isOn_A && (
                      <div className="absolute right-48 w-fit whitespace-nowrap mb-2 px-4 py-2 bg-blue-500 text-white rounded text-sm xl:text-base">
                        Warmup: {warmupTimeLeft} minute(s) remaining
                      </div>
                    )}

                    {/* Toggle switch with disabled styling during cooldown or warmup */}
                    <div
                      className={`genset-toggle w-14 h-7 rounded-full relative transition-all duration-300 ${isOn_A ? "bg-green-500" : "bg-gray-400"
                        } ${(isInCooldown_A && !isOn_A) || (isInWarmup_A && isOn_A)
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                        }`}
                      onClick={(e) => {
                        //setisToggleClicked_A(true)
                        e.stopPropagation();
                        e.preventDefault();

                        if ((isInCooldown_A && !isOn_A) || (isInWarmup_A && isOn_A)) {
                          if (isInCooldown_A && !isOn_A) {
                            showErrorAlert_A(`Genset 1 cannot be turned on yet. Please wait ${cooldownTimeLeft_A} more minutes.`);
                          } else if (isInWarmup_A && isOn_A) {
                            showErrorAlert_A(`Genset 1 cannot be turned off yet. Please wait ${warmupTimeLeft_A} more minutes.`);
                          }
                        } else {
                          openDialog_A();
                        }
                      }}
                    >
                      <div
                        className={`genset-toggle w-7 h-7 bg-white rounded-full absolute top-0 transition-all duration-300 ${isOn_A ? "translate-x-7" : "translate-x-0"
                          }`}
                      ></div>
                    </div>


                    {/* Error Alert */}
                    {errorAlertOpen_A && (
                      <div className="fixed top-5 right-5 bg-red-500 text-white p-3 rounded shadow-lg z-50 max-w-md">
                        {errorMessage_A}
                      </div>
                    )}
                  </div>

                  {/* Dialog Alert */}
                  {showDialog_A && (
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
                            onClick={closeDialog_A}
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
                            {isOn_A ? (
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
                            className="bg-[#CACCCC] text-[#7A7F7F] px-3 py-1 xl:py-3 rounded-md text-base font-semibold w-full"
                            onClick={closeDialog_A}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-[#19988B] text-white px-3 py-1 xl:py-3 rounded-md text-base font-semibold w-full"
                            onClick={toggleSwitch_A}
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {showSuccessDialog_A && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-[#0A3D38] p-6 rounded-md shadow-lg w-1/3">
                        <div className="flex justify-end">
                          <button
                            className="text-white w-8 h-8"
                            onClick={closeSuccessDialog_A}
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
                  {showStopDialog_A && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-[#0A3D38] p-6 rounded-md shadow-lg w-1/3">
                        <div className="flex justify-end">
                          <button
                            className="text-white w-8 h-8"
                            onClick={closeStopDialog_A}
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
                <div className="flex items-end justify-start gap-3 ">
                  <img src={Antenna} alt="" className="w-10 h-10 mb-1.5" />
                  <div className="flex flex-col">
                    <span>Frequency</span>
                    <span className="text-[#DDDDDD] text-lg xl:text-xl font-semibold">
                      {datas && datas.genset1.freq} Hz
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5 text-xs xl:text-sm text-[#C37C5A]">
              <div className="flex items-end justify-start gap-3">
                <img src={Guage} alt="" className="w-10 h-10 mb-1.5" />
                <div className="flex flex-col">
                  <span>Engine RPM</span>
                  <span className="text-[#DDDDDD] text-lg xl:text-xl font-semibold">
                    {datas && datas.genset1.engineRpm}
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-start gap-3">
                <img src={Cold} alt="" className="w-10 h-10 mb-1.5" />
                <div className="flex flex-col">
                  <span>Coolant Temp</span>
                  <span className="text-[#DDDDDD] text-lg xl:text-xl font-semibold">
                    {datas && datas.genset1.coolerTemp}°C
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-start gap-3">
                <img src={Development} alt="" className="w-10 h-10 mb-1.5" />
                <div className="flex flex-col">
                  <span>Lube Oil Pressure</span>
                  <span className="text-[#DDDDDD] text-lg xl:text-xl font-semibold">
                    {datas && datas.genset1.oilPressure} Psi
                  </span>
                </div>
              </div>
            </div>
            <div className="flex text-sm xl:text-base mt-4">
              <div className="w-1/2 bg-[#0A3D38] p-2 xl:p-4 rounded-l-lg gap-5">
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Voltage (V)</span>
                  <span>{datas && datas.genset1.voltage}</span>
                </div>
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Power (kW)</span>
                  <span>{datas && datas.genset1.kw}</span>
                </div>
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Power (kVA)</span>
                  <span>{datas && datas.genset1.kva}</span>
                </div>
              </div>
              <div className="w-1/2 bg-[#0F5B53] p-2 xl:p-4 rounded-r-lg gap-5">
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Power Factor</span>
                  <span>{datas && datas.genset1.pf}</span>
                </div>
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Current (A)</span>
                  <span>{datas && datas.genset1.current}</span>
                </div>
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Engine running hours (Hr)</span>
                  <span>{datas && datas.genset1.enginerun}</span>
                </div>
              </div>
            </div>
          </div>
          {/* </Link> */}
          {/* <Link to={`/generator_b/${id}`} className="text-decoration-none"> */}
          {/* <div className="mt-8 p-4 rounded-lg bg-[#030F0E] w-full transition-all duration-200 hover:shadow-[#204D4C] hover:shadow-2xl opacity-50 hover:bg-gradient-to-tl hover:from-[#030F0E] hover:via-[#030F0E] hover:via-60% hover:to-[#204D4C]"> */}
          <div onClick={() => {

            if (isToggleClicked_B) {
              console.log("Toggle clicked, prevent navigation");
              return;
            }

            console.log("Card clicked, navigating");
            navigate(`/generator_b/${id}`);
          }} className="mt-8 p-4 xl:p-6 rounded-lg bg-[#030F0E] w-full transition-all duration-200 hover:shadow-[#204D4C] hover:shadow-2xl hover:bg-gradient-to-tl hover:from-[#030F0E] hover:via-[#030F0E] hover:via-60% hover:to-[#204D4C]">
            <div className="text-[#DDDDDD] text-base font-semibold pb-2">
              Genset-2
            </div>
            <div className="relative grid grid-cols-3 gap-4 text-xs xl:text-sm text-[#C37C5A] pb-4">
              <div className="flex flex-col justify-between">
                <div className="flex items-end justify-start gap-6">

                  <div className="">
                    {/* Cooldown indicator */}
                    {isInCooldown_B && !isOn_B && (
                      <div className="absolute left-44 mb-2 px-4 py-2 bg-yellow-500 text-white rounded text-sm xl:text-base w-fit whitespace-nowrap">
                        Cooldown: {cooldownTimeLeft_B} minute(s) remaining
                      </div>
                    )}


                    {/* Warmup indicator */}
                    {isInWarmup_B && isOn_B && (
                      <div className="absolute left-44 w-fit whitespace-nowrap mb-2 px-4 py-2 bg-blue-500 text-white rounded text-sm xl:text-base">
                        Warmup: {warmupTimeLeft_B} minute(s) remaining
                      </div>
                    )}

                    {/* Toggle switch with disabled styling during cooldown or warmup */}
                    <div
                      className={`w-14 h-7 rounded-full relative transition-all duration-300 ${isOn_B ? "bg-green-500" : "bg-gray-400"
                        } ${(isInCooldown_B && !isOn_B) || (isInWarmup_B && isOn_B)
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                        }`}
                      onClick={(e) => {
                        setisToggleClicked_B(true)
                        e.stopPropagation();
                        e.preventDefault();

                        if ((isInCooldown_B && !isOn_B) || (isInWarmup_B && isOn_B)) {
                          if (isInCooldown_B && !isOn_B) {
                            showErrorAlert_B(`Genset 1 cannot be turned on yet. Please wait ${cooldownTimeLeft_B} more minutes.`);
                          } else if (isInWarmup_B && isOn_B) {
                            showErrorAlert_B(`Genset 1 cannot be turned off yet. Please wait ${warmupTimeLeft_B} more minutes.`);
                          }
                        } else {
                          openDialog_B();
                        }
                      }}
                    >
                      <div
                        className={`w-7 h-7 bg-white rounded-full absolute top-0 transition-all duration-300 ${isOn_B ? "translate-x-7" : "translate-x-0"
                          }`}
                      ></div>
                    </div>

                    {/* Error Alert */}
                    {errorAlertOpen_B && (
                      <div className="fixed top-5 right-5 bg-red-500 text-white p-3 rounded shadow-lg z-50 max-w-md">
                        {errorMessage_B}
                      </div>
                    )}
                  </div>

                  {isOn_B ? <div className="flex items-center justify-cente">
                    <div className="flex items-center justify-center gap-2">
                      <img src={BreakerClose} alt="battery" className="w-2 h-5 xl:w-3 xl:h-6" />
                      <h3 className="text-[#DDDDDD] ml-1 mr-5 whitespace-nowrap text-sm xl:text-base font-normal">
                        Close
                      </h3>
                    </div>
                  </div>

                    : <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center gap-2">
                        <img src={BreakerOpen} alt="battery" className="w-2 h-5 xl:w-3 xl:h-6" />
                        <h3 className="text-[#DDDDDD] ml-1 mr-5 whitespace-nowrap text-sm xl:text-base font-normal">
                          Open
                        </h3>
                      </div>
                    </div>}


                  {/* Dialog Alert */}
                  {showDialog_B && (
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
                            onClick={closeDialog_B}
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
                            {isOn_B ? (
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
                            className="bg-[#CACCCC] text-[#7A7F7F] px-3 py-1 xl:py-3 rounded-md text-base font-semibold w-full"
                            onClick={closeDialog_B}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-[#19988B] text-white px-3 py-1 xl:py-3 rounded-md text-base font-semibold w-full"
                            onClick={toggleSwitch_B}
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {showSuccessDialog_B && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-[#0A3D38] p-6 rounded-md shadow-lg w-1/3">
                        <div className="flex justify-end">
                          <button
                            className="text-white w-8 h-8"
                            onClick={closeSuccessDialog_B}
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
                  {showStopDialog_B && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-[#0A3D38] p-6 rounded-md shadow-lg w-1/3">
                        <div className="flex justify-end">
                          <button
                            className="text-white w-8 h-8"
                            onClick={closeStopDialog_B}
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
                <div className="flex items-end justify-start gap-3">
                  <img src={Time} alt="" className="w-10 h-10 mb-1.5" />
                  <div className="flex flex-col">
                    <div className="text-xs xl:text-sm">Running Time</div>
                    <div className="text-[#DDDDDD] text-lg xl:text-xl font-semibold">
                      {datas && datas.genset2.batteryVoltage} mins
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-start gap-3">
                <img src={Antenna} alt="" className="w-10 h-10 mb-1.5" />
                <div className="flex flex-col">
                  <span>Frequency</span>
                  <span className="text-[#DDDDDD] text-lg xl:text-xl font-semibold">
                    {datas && datas.genset2.freq} Hz
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <img
                  src={Gen_Image}
                  alt=""
                  className="w-36 h-24 xl:w-40 xl:h-28 transform -scale-x-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5 text-xs xl:text-sm text-[#C37C5A]">
              <div className="flex items-end justify-start gap-3">
                <img src={Guage} alt="" className="w-10 h-10 mb-1.5" />
                <div className="flex flex-col">
                  <span>Engine RPM</span>
                  <span className="text-[#DDDDDD] text-lg xl:text-xl font-semibold">
                    {datas && datas.genset2.engineRpm}
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-start gap-3">
                <img src={Cold} alt="" className="w-10 h-10 mb-1.5" />
                <div className="flex flex-col">
                  <span>Coolant Temp</span>
                  <span className="text-[#DDDDDD] text-lg xl:text-xl font-semibold">
                    {datas && datas.genset2.coolerTemp}°C
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-start gap-3">
                <img src={Development} alt="" className="w-10 h-10 mb-1.5" />
                <div className="flex flex-col">
                  <span>Lube Oil Pressure</span>
                  <span className="text-[#DDDDDD] text-lg xl:text-xl font-semibold">
                    {datas && datas.genset2.oilPressure} Psi
                  </span>
                </div>
              </div>
            </div>
            <div className="flex text-sm xl:text-base mt-4">
              <div className="w-1/2 bg-[#0A3D38] p-2 xl:p-4 rounded-l-lg gap-5">
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Voltage (V)</span>
                  <span>{datas && datas.genset2.voltage} </span>
                </div>
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Power (kW)</span>
                  <span>{datas && datas.genset2.kw}</span>
                </div>
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Power (kVA)</span>
                  <span>{datas && datas.genset2.kva}</span>
                </div>
              </div>
              <div className="w-1/2 bg-[#0F5B53] p-2 xl:p-4 rounded-r-lg gap-5">
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Power Factor</span>
                  <span>{datas && datas.genset2.pf}</span>
                </div>
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Current (A)</span>
                  <span>{datas && datas.genset2.current}</span>
                </div>
                <div className="flex justify-between p-2 xl:p-3 text-[#CACCCC] font-medium text-sm xl:text-base">
                  <span>Engine running hours (Hr)</span>
                  <span>{datas && datas.genset2.enginerun}</span>
                </div>
              </div>
            </div>
          </div>
          {/* </Link> */}
        </div>
        <div className="flex justify-between mt-10 w-full">
          <p className="text-lg xl:text-xl font-semibold text-[#DDDDDD] tracking-wider">
            GENSET PARAMETERS VIEW
          </p>
          <div className="inline-flex text-xs xl:text-sm items-center">
            <span className="text-[#9F9E9E] px-2">
              Last Updated on 29-07-2023 | 10:20 A.M
            </span>
            <div className="flex text-[#DDDDDD] items-center">
              <span className="bg-[#0A3D38] px-2 py-2 rounded-l-[4px] text-xs xl:text-sm font-normal border-r-2 border-[#0F5B53]">
                Today
              </span>
              <span className="bg-[#0A3D38] px-2 py-2 text-xs xl:text-sm font-normal">
                Last 60 days
              </span>
            </div>
          </div>
        </div>
        <div className="bg-black rounded-md mt-5 flex justify-center w-full p-4 h-[310px]">
          <div
            id="my_dataviz"
            ref={myDatavizRef}
            className="w-full h-full"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
