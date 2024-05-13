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
export default function GraphAll(props) {
  const dayInMs = 1000 * 60 * 60 * 24;
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
  const getDataset = (data, dateNow, color) => {
    const parsedData = parseData(filterData(data.body, dateNow), dateNow);
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
  const getDatasets = (data, dateNow) => {
    const res = [];
    if (data.description.length < 7) {
      var colorPool = [130, 300, 240, 350, 30, 55]
        .slice(0, data.description.length)
        .sort((a, b) => {
          return a - b;
        });
    }
    for (let i = 0; i < data.description.length; i++) {
      const color =
        data.description.length > 6
          ? 260 + (310 / data.description.length) * i
          : colorPool[i];
      res.push(
        getDataset(
          {
            description: [data.description[i]],
            body: data.body.map((elm) => {
              return {
                date: new Date(elm.date),
                value: elm.value[i] * 100,
              };
            }),
          },
          dateNow,
          color
        )
      );
    }
    return res;
  };
  const getParsedAverageData = (data, dateNow) => {
    return parseData(
      filterData(
        data.body.map((elm) => {
          return {
            date: elm.date,
            value: Math.floor(
              (elm.value.reduce((a, b) => a + b) / elm.value.length) * 100
            ),
          };
        }),
        dateNow
      ),
      dateNow
    );
  };
  const getData = (data, dateNow) => {
    const parsedData = getParsedAverageData(props.data, dateNow);
    const finalData =
      props.timeRange === "year" ? parseWeekData(parsedData) : parsedData;
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
