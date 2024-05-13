import { useEffect, useState, useRef } from "react";
import style from "../styles/E.module.css";
import * as d3 from "d3";

function getCalendar(
  data,
  {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    title, // given d in data, returns the title text
    width = 690, // width of the chart, in pixels
    cellSize = 12, // width and height of an individual day, in pixels
    weekday = "sunday", // either: weekday, sunday, or monday
    formatDay = (i) => ["", "Mon", "", "Wed", "", "Fri", ""][i], // given a day number in [0, 6], the day-of-week label
    formatMonth = "%b", // format specifier string for months (above the chart)
    yFormat, // format specifier string for values (in the title)
    colors = d3.interpolateRdBu, //interpolateBrBG,interpolateRdBu, interpolateRdYlBu, interpolateSpectral
  } = {},
  yearCalendar
) {
  // Compute values.
  let startingDate = new Date();
  if (yearCalendar !== "default") {
    startingDate = new Date(parseInt(yearCalendar), 0, 1);
  } else {
    startingDate.setFullYear(startingDate.getFullYear() - 1);
  }
  let endingDate = new Date(startingDate.getTime());
  endingDate.setFullYear(endingDate.getFullYear() + 1);

  endingDate = endingDate.getTime();
  startingDate = startingDate.getTime();

  const X = d3.map(data, x).filter((e) => {
    return startingDate <= e.getTime() && e.getTime() < endingDate;
  });
  const Y = d3.map(data, y);
  const I = d3.range(X.length);
  const countDay = weekday === "sunday" ? (i) => i : (i) => (i + 6) % 7;
  const timeWeek = weekday === "sunday" ? d3.utcSunday : d3.utcMonday;
  const weekDays = weekday === "weekday" ? 5 : 7;
  const height = cellSize * (weekDays + 2);

  // Compute a color scale. This assumes a diverging color scheme where the pivot
  // is zero, and we want symmetric difference around zero.
  const max = d3.quantile(Y, 0.9975, Math.abs);
  const color = d3.scaleSequential([-max, +max], colors).unknown("none");

  // Construct formats.
  formatMonth = d3.utcFormat(formatMonth);

  // Compute titles.
  /* if (title === undefined) {
    const formatDate = d3.utcFormat("%B %-d, %Y");
    const formatValue = color.tickFormat(100, yFormat);
    title = (i) => `${formatDate(X[i])}\n${formatValue(Y[i])}`;
  } else if (title !== null) {
    const T = d3.map(data, title);
    title = (i) => T[i];
  } */

  // Group the index by year, in reverse input order. (Assuming that the input is
  // chronological, this will show years in reverse chronological order.)
  if (yearCalendar === "default") {
    var years = d3.groups(I, (i) => X[X.length - 1].getUTCFullYear()).reverse();
  } else {
    var years = d3.groups(I, (i) => X[i].getUTCFullYear()).reverse();
  }
  function pathMonth(t) {
    const d = Math.max(0, Math.min(weekDays, countDay(t.getUTCDay())));
    const w = timeWeek.count(d3.utcYear(t), t);
    return `${
      d === 0
        ? `M${w * cellSize},0`
        : d === weekDays
        ? `M${(w + 1) * cellSize},0`
        : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`
    }V${weekDays * cellSize}`;
  }

  const svg = d3
    .create("svg")
    /* .attr("width", width)
    .attr("height", height * years.length) */
    .attr("viewBox", [0, 0, width, height * years.length])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("font-size", 14);

  const year = svg
    .selectAll("g")
    .data(years)
    .join("g")
    .attr(
      "transform",
      (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`
    );

  year
    .append("text")
    .attr("x", -5)
    .attr("y", -5)
    .attr("font-weight", "bold")
    .attr("text-anchor", "end")
    .text(([key]) => key);

  year
    .append("g")
    .attr("text-anchor", "end")
    .selectAll("text")
    .data(weekday === "weekday" ? d3.range(1, 6) : d3.range(7))
    .join("text")
    .attr("x", -5)
    .attr("y", (i) => (countDay(i) + 0.5) * cellSize)
    .attr("dy", "0.31em")
    .text(formatDay);

  const cell = year
    .append("g")
    .selectAll("rect")
    .data(
      weekday === "weekday"
        ? ([, I]) => I.filter((i) => ![0, 6].includes(X[i].getUTCDay()))
        : ([, I]) => I
    )
    .join("rect")
    .attr("width", cellSize - 2)
    .attr("height", cellSize - 2)
    .attr("x", (i) => {
      if (yearCalendar === "default") {
        return (
          timeWeek.count(d3.utcYear(new Date()), X[i]) * cellSize +
          0.5 +
          (52 - timeWeek.count(d3.utcYear(new Date()), new Date())) * cellSize
        );
      } else {
        return timeWeek.count(d3.utcYear(X[i]), X[i]) * cellSize + 0.5;
      }
    })
    .attr("y", (i) => {
      return countDay(X[i].getUTCDay()) * cellSize + 0.5;
    })
    .attr("fill", (i) => color(Y[i]))
    .attr("ry", 2);

  //if (title) cell.append("title").text(title);

  const month = year
    .append("g")
    .selectAll("g")
    .data(([, I]) => d3.utcMonths(d3.utcMonth(X[I[0]]), X[I[I.length - 1]]))
    .join("g");

  month
    .filter((d, i) => i)
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("d", pathMonth);

  month
    .append("text")
    .attr("x", (d) => {
      if (yearCalendar === "default") {
        return (
          timeWeek.count(d3.utcYear(new Date()), timeWeek.ceil(d)) * cellSize +
          2 +
          (52 - timeWeek.count(d3.utcYear(new Date()), new Date())) * cellSize
        );
      } else {
        return timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2;
      }
    })
    .attr("y", -5)
    .text(formatMonth);

  cell
    .on("mouseover", function (d, i) {
      // d3.select(this).transition().duration("100").attr("r", 7); //Makes div appear

      d3.select("#tooltip").transition().duration(100).style("opacity", 1);
      const targetBoudries = d.target.getBoundingClientRect();

      d3.select("#tooltip")
        .html(
          `<b>${Y[i]}%</b> on ${X[i].toLocaleDateString("en-us", {
            year: "numeric",
            day: "numeric",
            month: "short",
          })}`
        )

        .style(
          "left",
          (targetBoudries.left + targetBoudries.right) / 2 -
            document.querySelector("#tooltip").offsetWidth / 2 +
            "px"
        )
        .style("top", targetBoudries.top - 25 + "px");
    })
    .on("mouseout", function (d, i) {
      d3.select("#tooltip").transition().duration("200").style("opacity", 0);
    });

  return Object.assign(svg.node(), { scales: { color } });
}

export default function Calender(props) {
  const [year, setYear] = useState("default");
  //   const [graph, setGraph] = useState("");
  /* useEffect(() => {
    setGraph(
      getCalendar(
        props.data.body,
        { x: (d) => d.date, y: (d) => d.value },
        year
      )
    );
  }, [props.data, year]); */
  const svg = useRef(null);
  useEffect(() => {
    svg.current.innerHTML = "";
    if (svg.current) {
      svg.current.appendChild(
        getCalendar(
          props.data.body,
          { x: (d) => d.date, y: (d) => d.value },
          year
        )
      );
    }
  }, [year, props.data.body]);
  return (
    <div className={style.calender} id="calender">
      {/* <label htmlFor="year">year</label>
      <select
        name="year"
        id="year"
        onChange={(e) => {
          setYear(e.target.value);
        }}
      >
        {props.data.body
          .reduce(
            (newArray, e) => {
              if (newArray[newArray.length - 1] !== e.date.getUTCFullYear()) {
                newArray.push(e.date.getUTCFullYear());
              }
              return newArray;
            },
            ["default"]
          )
          .map((e, index) => (
            <option key={index} value={e}>
              {e === "default" ? "last year" : e}
            </option>
          ))}
      </select> */}
      <div ref={svg} />
    </div>
  );
}
