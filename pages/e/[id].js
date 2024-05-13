import Calender from "../../components/calender";
import Graph from "../../components/graph";
import GraphAll from "../../components/graphall";
import style from "../../styles/E.module.css";
import Head from "next/head";
import { useState } from "react";

export default function E(props) {
  try {
    const getValueDescription = (data, type, pos) => {
      if (type === "solo") {
        return {
          description: [data.description[pos]],
          value: (value, pos) => {
            return value[pos] * 100;
          },
        };
      } else if (type === "average") {
        return {
          description: [{ name: "Average" }],
          value: (value) => {
            return Math.floor(
              (value.reduce((a, b) => a + b) / value.length) * 100
            );
          },
        };
      } else if (type === "all") {
        return {
          description: data.description,
          value: (value) => {
            return value;
          },
        };
      }
    };
    const getData = (data, type, pos) => {
      const valueDesciption = getValueDescription(data, type, pos);
      return (data = {
        description: valueDesciption.description,
        body: props.data.body.map((elm) => {
          return {
            date: new Date(elm.date),
            value: valueDesciption.value(elm.value, pos),
          };
        }),
      });
    };
    const [range, setRange] = useState("week"); //month //year
    const getPerformens = () => {
      const getAvg = (d) => {
        return (
          d
            .map((elm) => elm.value)
            .reduce((prev, cur) => {
              return prev + cur;
            }, 0) / 7
        );
      };
      const data = getData(props.data, "average").body;
      const sevenDaysInMs = 1000 * 60 * 60 * 24 * 7;
      const dateNow = new Date().getTime();
      const lastTwoWeeks = data.filter((elm) => {
        return (
          elm.date.getTime() > dateNow - sevenDaysInMs * 2 &&
          elm.date.getTime() < dateNow
        );
      });
      const thisWeek = getAvg(
        lastTwoWeeks.filter((elm) => {
          return elm.date.getTime() > dateNow - sevenDaysInMs;
        })
      );
      const lastWeek = getAvg(
        lastTwoWeeks.filter((elm) => {
          return !(elm.date.getTime() > dateNow - sevenDaysInMs);
        })
      );
      return Math.round((1 - thisWeek / lastWeek) * -100);
    };
    const performens = getPerformens();
    return (
      <div className={style.container}>
        <Head>
          <title>Habit tracker</title>
          <meta
            name="description"
            content="notion habits tracker with diagrams"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div
          id="tooltip"
          className={style.tooltip}
          style={{ opacity: 0 }}
        ></div>
        <main className={style.main}>
          <nav className={style.nav}>
            <select
              className={style.select}
              name="range"
              onChange={(e) => {
                setRange(e.target.value);
              }}
            >
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
            <div className={style.performens}>
              Week:
              <span
                style={{
                  color:
                    performens == 0 ? "" : performens > 0 ? "green" : "red",
                }}
              >
                {" "}
                {performens}%
              </span>
            </div>

            <button
              className={style.button}
              onClick={() => {
                location.reload(true);
              }}
            >
              Reload
            </button>
          </nav>
          <hr style={{ opacity: 0.25, marginTop: "0.25rem" }} />
          <h2 className={style.h2}>Overall average</h2>
          <hr style={{ opacity: 0.25, marginTop: "0.125rem" }} />
          <Calender data={getData(props.data, "average")} />
          <Graph
            className={style.canvas}
            timeRange={range}
            data={getData(props.data, "average")}
          />
          <GraphAll
            className={style.canvas}
            timeRange={range}
            data={getData(props.data, "all")}
          />{" "}
          <div>
            {props.data.description.map((elm, index) => {
              const data = getData(props.data, "solo", index);
              return (
                <details key={index} className={style.details}>
                  <summary className={style.summary}>{elm.name}</summary>
                  <hr style={{ opacity: 0.25, marginTop: "0" }} />
                  <Calender className={style.canvas} data={data} />
                  <Graph
                    className={style.canvas}
                    timeRange={range}
                    data={data}
                  />
                </details>
              );
            })}
          </div>
        </main>
        <footer className={style.footer}>
          <hr />
          <p>
            If you have any suggestions send them to:
            noiton-habit-tracker@protonmail.com
          </p>
        </footer>
      </div>
    );
  } catch (error) {
    alert("something went wrong :(");
  }
}

function parseData(results) {
  return {
    description: Object.keys(results[0].properties)
      .map((key) => {
        return { name: key, type: results[0].properties[key].type };
      })
      .filter((elm) => elm.type === "checkbox" || elm.type === "number"),
    body: results
      .map((page) => {
        if (page.properties.Date.date === null) {
          return null;
        } else {
          return {
            date: page.properties.Date.date.start,
            value: Object.keys(page.properties)
              .map((key) => {
                if (page.properties[key].type === "checkbox") {
                  return page.properties[key].checkbox;
                } else if (page.properties[key].type === "number") {
                  return page.properties[key].number === null
                    ? 0
                    : page.properties[key].number;
                } else {
                  return null;
                }
              })
              .filter((elm) => elm !== null),
          };
        }
      })
      .filter((elm) => elm !== null)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter(function (item, pos, ary) {
        return !pos || item.date != ary[pos - 1].date;
      }),
  };
}

export async function getServerSideProps(context) {
  const id = context.params.id;
  const { Client } = require("@notionhq/client");
  const { MongoClient } = require("mongodb");

  const client = new MongoClient(poccess.env.MONGODB_URI);
  await client.connect();
  const collection = client.db("main").collection("users");

  const data = await collection.findOne({ id: id });
  await client.close();
  if (data === undefined) {
    return {
      notFound: true,
    };
  }
  const token = data.token;
  const response = [];
  let cursor = undefined;
  try {
    while (true) {
      const notion = new Client({ auth: token });
      const { results, next_cursor } = await notion.databases.query({
        database_id: id,
        start_cursor: cursor,
      });
      response.push(...results);
      if (!next_cursor) {
        break;
      }
      cursor = next_cursor;
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/400",
        permanent: false,
      },
    };
  }
  const parsedData = parseData(response);
  return {
    props: { data: parsedData },
  };
}
