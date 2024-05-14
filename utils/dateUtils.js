const DAY_IN_MS = 1000 * 60 * 60 * 24;

const addToday = (data, dateNow) => {
  if (data.at(-1).date.toLocaleDateString() !== dateNow.toLocaleDateString())
    data.push({
      date: new Date(dateNow.toISOString().slice(0, 10)),
      value: 0,
    });
  return data;
};

const getDiffernce = (firstDate, secondDate) => {
  return (firstDate.getTime() - secondDate.getTime()) / DAY_IN_MS;
};
const filterDataByDate = (data, dateNow, days) => {
  return data.filter((elm) => {
    return (
      elm.date.getTime() > dateNow.getTime() - DAY_IN_MS * days &&
      elm.date.getTime() < dateNow
    );
  });
};

const parseData = (data, dateNow, days) => {
  if (data.length === 0) {
    return Array(days)
      .fill(null)
      .map((elm, index) => {
        return {
          date: new Date(dateNow.getTime() - DAY_IN_MS * index),
          value: 0,
        };
      });
  }

  return addToday(data, dateNow).reduce((newArray, elm, index) => {
    if (index !== 0) {
      const lastElm = newArray.at(-1);
      const difference = getDiffernce(elm.date, lastElm.date);
      for (let i = 1; i < difference; i++) {
        newArray.push({
          date: new Date(lastElm.date.getTime() + DAY_IN_MS * i),
          value: 0,
        });
      }
    }
    newArray.push(elm);
    return newArray;
  }, []);
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

export { filterDataByDate, parseData, parseWeekData };
