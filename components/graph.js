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
const dayInMs = 1000 * 60 * 60 * 24;

export default function Graph(props) {
  const days = { year: 365, month: 30, week: 7 }[props.timeRange];
  const filterData = (data, dateNow) => {
    return data.filter((elm) => {
      return (
        elm.date.getTime() > dateNow.getTime() - dayInMs * days &&
        elm.date.getTime() < dateNow
      );
    });
  };
  const addLastElm = (data, dateNow) => {
    if (data.at(-1).date.toLocaleDateString() !== dateNow.toLocaleDateString())
      data.push({
        date: new Date(dateNow.toISOString().slice(0, 10)),
        value: 0,
      });
    return data;
  };
  const getDiffernce = (firstDate, secondDate) => {
    return (firstDate.getTime() - secondDate.getTime()) / dayInMs;
  };
  const parseData = (data, dateNow) => {
    if (data.length === 0) {
      return Array(days)
        .fill(null)
        .map((elm, index) => {
          return {
            date: new Date(dateNow.getTime() - dayInMs * index),
            value: 0,
          };
        });
    } else {
      return addLastElm(data, dateNow).reduce((newArray, elm, index) => {
        if (index !== 0) {
          const lastElm = newArray.at(-1);
          const difference = getDiffernce(elm.date, lastElm.date);
          for (let i = 1; i < difference; i++) {
            newArray.push({
              date: new Date(lastElm.date.getTime() + dayInMs * i),
              value: 0,
            });
          }
        }
        newArray.push(elm);
        return newArray;
      }, []);
    }
  };
  const parseWeekData = (data) => {
    const weekParsedDate = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].date.getDay() === 0) {
        let sum = 0;
        let y = 0;
        for (; y < 7 && y + i < data.length; y++) {
          sum += data[i + y].value;
        }
        weekParsedDate.push({
          date: data[i].date,
          value: sum / (y + 1),
        });
        i += 6;
      }
    }
    return weekParsedDate;
  };
  const dateNow = new Date();
  const filteredData = filterData(props.data.body, dateNow);
  const parsedData = parseData(filteredData, dateNow);
  const finalData =
    props.timeRange === "year" ? parseWeekData(parsedData) : parsedData;
  const options = {
    responsive: true,
    data: {},
    options: {},
    plugins: [],
  };
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
