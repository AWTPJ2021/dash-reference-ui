import { Setting, DashFunction, Tree } from '../types/types';
import * as objectPath from 'object-path';

export function generateSettingsMapFromList(list: Setting[]): Map<string, any> {
  const map = new Map();
  list.forEach(element => {
    map.set(element.id, undefined);
  });
  return map;
}

export function generateSettingsObjectFromListAndMap(list: Setting[], map: Map<string, boolean>): { [key: string]: any } {
  const object = {
    settings: undefined,
  };
  list.forEach(element => {
    objectPath.set(object, element.id, map.get(element.id));
  });
  return object.settings;
}

export function generateFunctionsMapFromList(list: DashFunction[]): Map<string, any> {
  const map = new Map();
  list.forEach(element => {
    map.set(element.name, undefined);
  });
  return map;
}

export function generateFunctionsObjectFromListAndMap(list: DashFunction[], map: Map<string, boolean>): { [key: string]: any } {
  const object = {
    functions: undefined,
  };
  list.forEach(element => {
    objectPath.set(object, element.name, map.get(element.name));
  });
  return object.functions;
}
export function settingsListToTree(list: Setting[]): Tree {
  // Ignore first element in path as this is the root
  const root: Tree = {
    name: list[0].path[0],
    // child: {},
    elements: [],
  };
  list.forEach(element => {
    let nav = root;
    element.path.slice(1).forEach(subPath => {
      if (root.child == undefined) {
        root.child = {};
      }
      if (root.child[subPath] == undefined) {
        root.child[subPath] = {
          name: subPath,
          elements: [],
        };
      }
      nav = root.child[subPath];
    });
    nav.elements.push(element.id);
  });
  return root;
}

export function calculateHTTPMetrics(type, requests) {
  var latency = {},
    download = {},
    ratio = {};

  var requestWindow = requests
    .slice(-20)
    .filter(function (req) {
      return req.responsecode >= 200 && req.responsecode < 300 && req.type === 'MediaSegment' && req._stream === type && !!req._mediaduration;
    })
    .slice(-4);

  if (requestWindow.length > 0) {
    var latencyTimes = requestWindow.map(function (req) {
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

    var downloadTimes = requestWindow.map(function (req) {
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

    var durationTimes = requestWindow.map(function (req) {
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

export function chartYAxisOptions(metricsData: any, colors: Object) {
  const yAxesArray = [];
  Object.keys(metricsData).map((metric, index) => {
    let newEntry = {
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
    yAxesArray.push(newEntry);
  });
  return yAxesArray;
}

export function chartDataset(metricsData: any, colors: Object) {
  const dataset = [];
  Object.keys(metricsData).map((metric, index) => {
    let newEntry = {
      data: [0, 0, 0, 0, 0, 0, 0, 0],
      label: metric,
      lineTension: 0,
      hidden: false,
      borderColor: colors[metric],
      yAxisID: 'y' + index,
      fill: false,
    };
    dataset.push(newEntry);
  });
  return dataset;
}
