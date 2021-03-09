export function calculateHTTPMetrics(type: string, requests: any[]) {
  const latency = {},
    download = {},
    ratio = {};

  const requestWindow = requests
    .slice(-20)
    .filter(function (req) {
      return req.responsecode >= 200 && req.responsecode < 300 && req.type === 'MediaSegment' && req._stream === type && !!req._mediaduration;
    })
    .slice(-4);

  if (requestWindow.length > 0) {
    const latencyTimes = requestWindow.map(function (req) {
      return Math.abs(req.tresponse.getTime() - req.trequest.getTime()) / 1000;
    });

    latency[type] = {
      average:
        latencyTimes.reduce(function (l, r) {
          return l + r;
        }) / latencyTimes.length,
      high: latencyTimes.reduce(function (l, r) {
        return l < r ? r : l;
      }),
      low: latencyTimes.reduce(function (l, r) {
        return l < r ? l : r;
      }),
      count: latencyTimes.length,
    };

    const downloadTimes = requestWindow.map(function (req) {
      return Math.abs(req._tfinish.getTime() - req.tresponse.getTime()) / 1000;
    });

    download[type] = {
      average:
        downloadTimes.reduce(function (l, r) {
          return l + r;
        }) / downloadTimes.length,
      high: downloadTimes.reduce(function (l, r) {
        return l < r ? r : l;
      }),
      low: downloadTimes.reduce(function (l, r) {
        return l < r ? l : r;
      }),
      count: downloadTimes.length,
    };

    const durationTimes = requestWindow.map(function (req) {
      return req._mediaduration;
    });

    ratio[type] = {
      average:
        durationTimes.reduce(function (l, r) {
          return l + r;
        }) /
        downloadTimes.length /
        download[type].average,
      high:
        durationTimes.reduce(function (l, r) {
          return l < r ? r : l;
        }) / download[type].low,
      low:
        durationTimes.reduce(function (l, r) {
          return l < r ? l : r;
        }) / download[type].high,
      count: durationTimes.length,
    };

    return {
      latency: latency,
      download: download,
      ratio: ratio,
    };
  }
  return null;
}

export function chartYAxisOptions(metricsData: any, colors: any) {
  const yAxesArray = [];
  Object.keys(metricsData).map((metric, index) => {
    const newEntry = {
      gridLines: {
        color: 'rgba(0, 0, 0, 0)',
      },
      stacked: false,
      position: 'right',
      type: 'linear',
      display: true,
      scaleLabel: {
        display: true,
        labelString: metric,
        fontColor: colors[metric],
      },
      id: 'y' + index,
      ticks: {
        display: true,
        beginAtZero: true,
      },
    };
    // @ts-ignore
    yAxesArray.push(newEntry);
  });
  return yAxesArray;
}

export function chartDataset(metricsData: any, colors: any) {
  const dataset = [];
  Object.keys(metricsData).map((metric, index) => {
    const newEntry = {
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      label: metric,
      lineTension: 0,
      hidden: false,
      borderColor: colors[metric],
      yAxisID: 'y' + index,
      fill: false,
    };
    // @ts-ignore
    dataset.push(newEntry);
  });
  return dataset;
}
