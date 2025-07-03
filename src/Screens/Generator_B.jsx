/* eslint-disable no-unused-vars */
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
import BreakerOpen from '../assets/breakeropen.png';
import BreakerClose from '../assets/breakerclose.png';

const Generator_B = ({
  datas,
  BASEURL,
  status,
  SERVERURL,
  setId,
  fetchStatus,
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
  const [isOn, setIsOn] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [deviceInfoOpen, setDeviceInfoOpen] = useState(false);

  const myDatavizRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    setId(id || 1);
  }, [id]);


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
      .style("fill", "white")
      .style("font-size", window.innerWidth >= 1920 ? "14px" : "10px");

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
    <div className="grid grid-cols-[69%_30%] gap-5 h-auto ">
      <div className="flex-col p-5">
        <div className="inline-flex items-center">
          <Link to="/">
            <button
              id="dashboardGeneratorBtn"
              className="bg-transparent text-sm xl:text-base text-[#DDDDDD] font-medium"
            >
              Dashboard
            </button>
          </Link>
          <p
            id="dashboardGeneratorBtn"
            className="text-sm xl:text-base text-[#DDDDDD] ml-1 font-medium"
          >
            &gt; Generator
          </p>
        </div>
        <div className="flex justify-between flex-[50] mt-5">
          <div className="whitespace-nowrap">
            <h3 className="font-semibold tracking-wider text-lg xl:text-xl text-[#DDDDDD]">
              GENERATOR IRC231GHX
            </h3>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="flex items-center justify-center gap-2">
              <img src={Thermometer} alt="temp" className="w-5 h-5 xl:w-6 xl:h-6" />
              <h3 className="text-[#DDDDDD] ml-1 mr-5 whitespace-nowrap text-sm xl:text-base font-normal">
                32°C
              </h3>
            </div>


            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <img src={Image_1} alt="battery" className="w-5 h-5 xl:w-6 xl:h-6" />
                <h3 className="text-[#DDDDDD] ml-1 mr-5 whitespace-nowrap text-sm xl:text-base font-normal">
                  32%
                </h3>
              </div>
            </div>

            {isOn_B ? <div className="flex items-center justify-center">
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


            <div className="mt-1">
              {/* Cooldown indicator */}
              {isInCooldown_B && !isOn_B && (
                <div className="absolute bottom-7 right-2 mb-2 px-4 py-2 bg-yellow-500 text-white rounded text-sm xl:text-base w-fit whitespace-nowrap">
                  Cooldown: {cooldownTimeLeft_B} minute(s) remaining
                </div>
              )}


              {/* Warmup indicator */}
              {isInWarmup_B && isOn_B && (
                <div className="absolute bottom-7 right-2 w-fit whitespace-nowrap mb-2 px-4 py-2 bg-blue-500 text-white rounded text-sm xl:text-base">
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
                onClick={
                  (isInCooldown_B && !isOn_B) || (isInWarmup_B && isOn_B)
                    ? () => {
                      if (isInCooldown_B && !isOn_B) {
                        showErrorAlert_B(
                          `Genset 2 cannot be turned on yet. Please wait ${cooldownTimeLeft_B} more minutes.`
                        );
                      } else if (isInWarmup_B && isOn_B) {
                        showErrorAlert_B(
                          `Genset 2 cannot be turned off yet. Please wait ${warmupTimeLeft_B} more minutes.`
                        );
                      }
                    }
                    : openDialog_B
                }
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
                      className="bg-[#CACCCC] text-[#7A7F7F] px-3 py-1 rounded-md text-base font-semibold w-full"
                      onClick={closeDialog_B}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-[#19988B] text-white px-3 py-1 rounded-md text-base font-semibold w-full"
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
        </div>
        <div className="flex flex-col gap-4 w-full mt-5 bg-gradient-to-tr from-[#0A1517] via-[#0A1517] to-[#204d4c] rounded-lg p-3">
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
                  value: datas && datas.genset2.voltage,
                },
                {
                  label: "Power (kW)",
                  id: "kwGenset1",
                  value: datas && datas.genset2.kw,
                },
                {
                  label: "Power (kVA)",
                  id: "kvaGenset1",
                  value: datas && datas.genset2.kva,
                },
                {
                  label: "Power Factor (V)",
                  id: "pfGenset1",
                  value: datas && datas.genset2.pf,
                },
                {
                  label: "Current (A)",
                  id: "currentGenset1",
                  value: datas && datas.genset2.current,
                },
                {
                  label: "Engine running hours (Hr)",
                  id: "engineRunGenset1",
                  value: datas && datas.genset2.enginerun,
                },
              ].map((item, index) => (
                <div key={index} className="flex justify-between py-2">
                  <p className="text-[#DDDDDD] font-medium text-sm xl:text-base opacity-60">
                    {item.label}
                  </p>
                  <p
                    className="text-[#DDDDDD] font-medium text-sm xl:text-base"
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
              <img src={Run_Time} alt="Running Time" className="w-5 h-5 xl:w-8 xl:h-8" />
              <p className="text-[#C37C5A] text-sm xl:text-lg font-medium">Running Time</p>
              <p
                className="text-[#DDDDDD] text-2xl font-semibold"
                id="runningTimeGenset1"
              >
                {datas && datas.genset2.batteryVoltage} mins
              </p>
            </div>

            {/* Frequency */}
            <div className="flex flex-col items-start space-y-1 border-r border-[#204D4C] px-10">
              <img src={Run_Frequency} alt="Frequency" className="w-5 h-5 xl:w-8 xl:h-8" />
              <p className="text-[#C37C5A] text-sm xl:text-lg font-medium">Frequency</p>
              <p
                className="text-[#DDDDDD] text-2xl font-semibold"
                id="frequencyGenset1"
              >
                {datas && datas.genset2.freq} Hz
              </p>
            </div>

            {/* Engine RPM */}
            <div className="flex flex-col items-start space-y-1 border-r border-[#204D4C] px-10">
              <img src={Run_Engine} alt="Engine RPM" className="w-5 h-5 xl:w-8 xl:h-8" />
              <p className="text-[#C37C5A] text-sm xl:text-lg font-medium">Engine RPM</p>
              <p
                className="text-[#DDDDDD] text-2xl font-semibold"
                id="engineRpmGenset1"
              >
                {datas && datas.genset2.engineRpm}
              </p>
            </div>

            {/* Coolant Temp */}
            <div className="flex flex-col items-start space-y-1 border-r border-[#204D4C] px-10">
              <img src={Run_Coolant} alt="Coolant Temp" className="w-5 h-5 xl:w-8 xl:h-8" />
              <p className="text-[#C37C5A] text-sm xl:text-lg font-medium">Coolant Temp</p>
              <p
                className="text-[#DDDDDD] text-2xl font-semibold"
                id="coolantTempGenset1"
              >
                {datas && datas.genset2.coolerTemp}°C
              </p>
            </div>

            {/* Lube Oil Pressure */}
            <div className="flex flex-col items-start space-y-1 px-10">
              <img src={Run_Lube} alt="Lube Oil Pressure" className="w-5 h-5 xl:w-8 xl:h-8" />
              <p className="text-[#C37C5A] text-sm xl:text-lg font-medium">
                Lube Oil Pressure
              </p>
              <p
                className="text-[#DDDDDD] text-2xl font-semibold"
                id="lubeOilGenset1"
              >
                {datas && datas.genset2.oilPressure} Psi
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-12 w-full">
          <p className="text-lg xl:text-xl font-semibold text-[#DDDDDD] tracking-wider">
            POWER CONSUMPTION
          </p>
          <div className="inline-flex text-xs xl:text-sm items-center">
            <div className="flex text-[#DDDDDD] items-center">
              <span className="bg-[#062A30] px-2 py-2 rounded-l-[4px] text-xs xl:text-sm font-normal border-r-2 border-[#0A1517]">
                Today
              </span>
              <span className="bg-[#062A30] px-2 py-2 text-xs xl:text-sm font-normal">
                Last 60 days
              </span>
            </div>
          </div>
        </div>

        <div className="bg-black flex justify-center mb-5 rounded-lg mt-5 w-full p-4 h-[240px] xl:h-[350px]">
          <div
            id="my_dataviz"
            ref={myDatavizRef}
            className="w-full h-full"
          ></div>
        </div>
      </div>
      {/* <div>
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
      </div> */}
      <div
        className=" bg-[#172629] h-full overflow-y-auto"
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
                <h4 className="text-[#DDDDDD] ml-2 text-base xl:text-lg font-semibold tracking-wider">
                  ALERTS (12)
                </h4>
              </div>
              <div
                className={`transition-transform ${alertOpen ? "rotate-180" : ""
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
                    <div className="text-[#DDDDDD] text-xs xl:text-sm">10:32 am</div>
                  </div>
                  <p className="text-[#DDDDDD] text-sm xl:text-base mt-2 ml-4">
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
                    <div className="text-[#DDDDDD] text-xs xl:text-sm">10:32 am</div>
                  </div>
                  <p className="text-[#DDDDDD] text-sm xl:text-base mt-2 ml-4">
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
                    <div className="text-[#DDDDDD] text-xs xl:text-sm">10:32 am</div>
                  </div>
                  <p className="text-[#DDDDDD] text-sm xl:text-base mt-2 ml-4">
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
                    <div className="text-[#DDDDDD] text-xs xl:text-sm">10:32 am</div>
                  </div>
                  <p className="text-[#DDDDDD] text-sm xl:text-base mt-2 ml-4">
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
                    <div className="text-[#DDDDDD] text-xs xl:text-sm">10:32 am</div>
                  </div>
                  <p className="text-[#DDDDDD] text-sm xl:text-base mt-2 ml-4">
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
                <h4 className="text-[#DDDDDD] ml-2 text-base xl:text-lg font-semibold tracking-wider">
                  DEVICE INFO
                </h4>
              </div>
              <div
                className={`transition-transform ${deviceInfoOpen ? "rotate-180" : ""
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
                      <p className="text-[#DDDDDD] font-medium text-sm xl:text-base opacity-50">
                        Location
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.deviceInfo.location}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-medium text-sm xl:text-base opacity-50">
                        Sys Voltage
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.deviceInfo.sysVoltage}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-medium text-sm xl:text-base opacity-50">
                        Cylinder
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.deviceInfo.cylinder}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                        Battery Alternator
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.deviceInfo.batteryAlternator}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                        Intake air method
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.deviceInfo.intakeAir}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                        Type
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.deviceInfo.type}
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
                      <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                        Model & Make
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.systemInfo["mode&make"]}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                        Upcoming Maintanence
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.systemInfo.upcoming}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                        Intake air method
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.systemInfo.intakeAir}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                        Date of Purchase
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.systemInfo.date}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                        Last Maintanence Date
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.systemInfo.lastmaintanence}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                        Type
                      </p>
                      <p className="font-medium capitalize text-sm xl:text-base">
                        {datas && datas.genset2.systemInfo.type}
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
              <h4 className="text-[#DDDDDD] ml-2 text-base xl:text-lg font-semibold tracking-wider">
                CONTACT INFORMATION
              </h4>
            </div>
          </div>
          <div className="grid grid-cols-2 m-2 ml-3">
            <div className="flex flex-col justify-start gap-5 text-white">
              <div className="flex flex-col gap-1">
                <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                  Email ID
                </p>
                <p className="font-medium text-sm xl:text-base">admin@kirloskar.com</p>
              </div>
            </div>
            <div className="flex flex-col justify-start gap-5 text-white">
              <div className="flex flex-col gap-1">
                <p className="text-[#DDDDDD] font-normal text-sm xl:text-base opacity-50">
                  Mobile Number
                </p>
                <p className="font-medium text-sm xl:text-base">+91 9923 45678</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator_B;
