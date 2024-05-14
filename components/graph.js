import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  filterDataByDate as filterDataByDate,
  parseData,
  parseWeekData,
} from "../utils/dateUtils.js";

export default function Graph(props) {
  const days = { year: 365, month: 30, week: 7 }[props.timeRange];
  const dateNow = new Date();

  const filteredData = filterDataByDate(props.data.body, dateNow, days);
  const parsedData = parseData(filteredData, dateNow, days);
  const finalData =
    props.timeRange === "year" ? parseWeekData(parsedData) : parsedData;

  const data = {
    labels: finalData.map((elm) => {
      return elm.date.toLocaleDateString("en-us", {
        year: "numeric",
        day: "numeric",
        month: "short",
      });
    }),
    datasets: [
      {
        label: props.data.description[0].name,
        data: finalData.map((elm) => elm.value),
        backgroundColor: ["rgba(46, 170, 220, 0.2)"],
        borderColor: ["rgba(46, 170, 220, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    data: {},
    options: {},
    plugins: [],
  };

  if (props.timeRange === "year") {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend
    );
    return <Line className={props.className} options={options} data={data} />;
  } else {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend
    );
    return <Bar className={props.className} options={options} data={data} />;
  }
}
