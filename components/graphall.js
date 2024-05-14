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
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  filterDataByDate,
  parseData,
  parseWeekData,
} from "../utils/dateUtils.js";

/*
Mainly parsing notion data format to chart.js format
=> Unit tests would be ideal here, also to provide a simple overview of input and output
*/

export default function GraphAll(props) {
  const days = { year: 365, month: 30, week: 7 }[props.timeRange];

  const getDataset = (data, dateNow, color) => {
    const filteredData = filterDataByDate(data.body, dateNow, days);
    const parsedData = parseData(filteredData, dateNow);
    const resData =
      props.timeRange === "year" ? parseWeekData(parsedData) : parsedData;
    return {
      label: data.description[0].name,
      data: resData.map((elm) => elm.value),
      backgroundColor: [`hsla(${color}, 80%, 40%, 0.2)`],
      borderColor: [`hsla(${color}, 80%, 40%, 0.5)`],
      borderWidth: 1,
    };
  };

  const getSetOfColors = (num) => {
    if (num <= 6) {
      return [130, 300, 240, 350, 30, 55].slice(0, num).sort((a, b) => {
        return a - b;
      });
    }
    return Array(num)
      .fill(null)
      .map((_, i) => {
        return 260 + (310 / num) * i;
      });
  };

  const getDatasets = (data, dateNow) => {
    const colorSet = getSetOfColors(data.description.length);
    return data.description.map((description, i) =>
      getDataset(
        {
          description: [description],
          body: data.body.map((elm) => {
            return {
              date: new Date(elm.date),
              value: elm.value[i] * 100,
            };
          }),
        },
        dateNow,
        colorSet[i]
      )
    );
  };

  const getParsedAverageData = (data, dateNow) => {
    return parseData(
      filterDataByDate(
        data.body.map((elm) => {
          return {
            date: elm.date,
            value: Math.floor(
              (elm.value.reduce((a, b) => a + b) / elm.value.length) * 100
            ),
          };
        }),
        dateNow,
        days
      ),
      dateNow
    );
  };

  const getData = (data, dateNow) => {
    const parsedAvgData = getParsedAverageData(props.data, dateNow);
    const finalData =
      props.timeRange === "year" ? parseWeekData(parsedAvgData) : parsedAvgData;
    return {
      labels: finalData.map((elm) => {
        return elm.date.toLocaleDateString("en-us", {
          year: "numeric",
          day: "numeric",
          month: "short",
        });
      }),
      datasets: [
        {
          label: "average",
          data: finalData.map((elm) => elm.value),
          backgroundColor: ["rgba(46, 170, 220, 0.2)"],
          borderColor: ["rgba(46, 170, 220, 1)"],
          borderWidth: 1,
        },
        ...getDatasets(data, dateNow),
      ],
    };
  };

  const options = {
    responsive: true,
  };
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  return (
    <Line
      className={props.className}
      options={options}
      data={getData(props.data, new Date())}
    />
  );
}
