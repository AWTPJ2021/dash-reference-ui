import { Component, Host, h, Prop, Watch, Element, State, Listen } from '@stencil/core';
import * as chartjs from 'chart.js';
const { Chart } = chartjs.default.Chart;

@Component({
  tag: 'dashjs-statistics',
  styleUrl: 'dashjs-statistics.css',
  shadow: false,
})
export class DashjsStatistics {
  @Element()
  el: HTMLElement;
  video_canvas: HTMLCanvasElement;
  audio_canvas: HTMLCanvasElement;
  video_context: CanvasRenderingContext2D;
  audio_context: CanvasRenderingContext2D;

  @Prop()
  videoInstance: any;
  audioInstance: any;

  @Prop()
  video_data: any;

  @State()
  videoDisable: boolean = false;

  @State()
  audioDisable: boolean = false;

  @State()
  audioChartInterval: any;
  videoChartInterval: any;

  // DashMetrics properties
  @State()
  chartColors = {
    'Buffer Length': '#003f5c',
    'Bitrate Downloading': '#374c80',
    'Dropped Frames': '#7a5195',
    'Frame Rate': '#bc5090',
    'Index': '#ef5675',
    'Max Index': '#ff764a',
    'Latency': '#570408',
  };

  @State()
  videoMetricsDataMap = {
    'Buffer Length': [0],
    'Bitrate Downloading': [0],
    'Dropped Frames': [0],
    'Frame Rate': [0],
    'Index': [0],
    'Max Index': [0],
    'Latency': [0],
  };

  @State()
  audioMetricsDataMap = {
    'Buffer Length': [0],
    'Bitrate Downloading': [0],
    'Dropped Frames': [0],
    'Max Index': [0],
  };

  @State()
  currentTime: any;
  currentTimeArr: string[] = new Array();

  chartVisibility(isVideo, title, checked) {
    let toChange = isVideo ? this.videoInstance : this.audioInstance;
    toChange.data.datasets.forEach(function (ds, index) {
      if (ds.label == title) {
        ds.hidden = checked ? false : true;
        toChange.options.scales.yAxes[index].display = checked ? true : false;
      }
    });
    if ((isVideo && !this.videoDisable) || (!isVideo && !this.audioDisable)) {
      toChange.data.datasets[0].data.shift();
      toChange.data.datasets[0].data.push(122);
      toChange.update();
    }
  }

  disableChart(isVideo) {
    if (isVideo) {
      this.videoDisable = this.videoDisable ? false : true;
      !this.videoDisable
        ? (this.videoChartInterval = setInterval(() => {
            this.video_watcher(true, this.videoMetricsDataMap, this.currentTimeArr);
          }, 1000))
        : clearInterval(this.videoChartInterval);
    } else {
      this.audioDisable = this.audioDisable ? false : true;
      !this.audioDisable
        ? (this.audioChartInterval = setInterval(() => {
            this.video_watcher(false, this.audioMetricsDataMap, this.currentTimeArr);
          }, 1000))
        : clearInterval(this.audioChartInterval);
    }
    console.log('video: ' + this.videoDisable);
    console.log('audio: ' + this.audioDisable);
  }

  clearChart(isVideo) {
    let toChange = isVideo ? this.videoInstance : this.audioInstance;
    toChange.data.datasets.forEach(function (ds) {
      ds.data = [0, 0, 0, 0, 0, 0, 0, 0];
    });
    toChange.update();
  }

  @Listen('streamMetricsEvent', { target: 'document' })
  streamMetricsEventHandler(event) {
    this.streamMetrics(event.detail);
  }

  chartYAxisOptions(metricsData: any) {
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
          fontColor: this.chartColors[metric],
        },
        id: 'y' + index,
        ticks: {
          display: true,
          beginAtZero: false,
        },
      };
      yAxesArray.push(newEntry);
    });
    return yAxesArray;
  }

  chartDataset(metricsData: any) {
    const dataset = [];
    Object.keys(metricsData).map((metric, index) => {
      let newEntry = {
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        label: metric,
        lineTension: 0,
        hidden: false,
        borderColor: this.chartColors[metric],
        yAxisID: 'y' + index,
        fill: false,
      };
      dataset.push(newEntry);
    });
    return dataset;
  }

  streamMetrics(player: any) {
    const streamInfo = player?.getActiveStream()?.getStreamInfo();
    const dashMetrics = player?.getDashMetrics();
    const dashAdapter = player?.getDashAdapter();

    if (dashMetrics && streamInfo) {
      const periodIdx = streamInfo?.index;
      let currentTimeInSec = player?.time().toFixed(0);
      this.currentTime = new Date(currentTimeInSec * 1000).toISOString().substr(11, 8);
      this.currentTimeArr.push(this.currentTime);
      this.videoMetricsDataMap.Latency.push(
        Number(
          setTimeout(() => {
            player?.getCurrentLiveLatency();
          }, 1000),
        ),
      );

      // Video Metrics
      let videoRepSwitch = dashMetrics?.getCurrentRepresentationSwitch('video');
      let videoAdaptation = dashAdapter?.getAdaptationForType(periodIdx, 'video', streamInfo);

      this.videoMetricsDataMap['Buffer Length'].push(dashMetrics?.getCurrentBufferLevel('video'));
      this.videoMetricsDataMap['Dropped Frames'].push(dashMetrics?.getCurrentDroppedFrames('video')?.droppedFrames);
      this.videoMetricsDataMap['Bitrate Downloading'].push(videoRepSwitch ? Math.round(dashAdapter?.getBandwidthForRepresentation(videoRepSwitch.to, periodIdx) / 1000) : NaN);
      this.videoMetricsDataMap['Index'].push(dashAdapter?.getIndexForRepresentation(videoRepSwitch?.to, periodIdx));
      this.videoMetricsDataMap['Max Index'].push(dashAdapter?.getMaxIndexForBufferType('video', periodIdx));
      this.videoMetricsDataMap['Frame Rate'].push(
        videoAdaptation?.Representation_asArray?.find(function (rep) {
          return rep.id === videoRepSwitch.to;
        })?.frameRate,
      );

      // Audio Metrics
      let audioRepSwitch = dashMetrics?.getCurrentRepresentationSwitch('audio');

      this.audioMetricsDataMap['Buffer Length'].push(dashMetrics?.getCurrentBufferLevel('audio'));
      this.audioMetricsDataMap['Dropped Frames'].push(dashMetrics?.getCurrentDroppedFrames('audio').droppedFrames);
      this.audioMetricsDataMap['Bitrate Downloading'].push(audioRepSwitch ? Math.round(dashAdapter?.getBandwidthForRepresentation(audioRepSwitch.to, periodIdx) / 1000) : NaN);
      this.audioMetricsDataMap['Max Index'].push(dashAdapter?.getMaxIndexForBufferType('audio', periodIdx));
    }
  }

  componentDidLoad() {
    // Data Example
    this.video_canvas = this.el.querySelector('#video_canvas');
    this.audio_canvas = this.el.querySelector('#audio_canvas');

    this.video_context = this.video_canvas.getContext('2d');
    this.audio_context = this.audio_canvas.getContext('2d');

    var dataExample = [
      {
        labels: ['00:00', '00:01', '00:02', '00:03', '00:04', '00:05', '00:06', '00:07'],
        datasets: this.chartDataset(this.videoMetricsDataMap),
      },
      {
        labels: ['00:00', '00:01', '00:02', '00:03', '00:04', '00:05', '00:06', '00:07'],
        datasets: this.chartDataset(this.audioMetricsDataMap),
      },
    ];

    const videoChartOptions: any = {
      type: 'line',
      data: dataExample[0],
      options: {
        legend: {
          display: false,
        },
        animation: false,
        maintainAspectRatio: false,
        scales: {
          yAxes: this.chartYAxisOptions(this.videoMetricsDataMap),
        },
      },
    };

    const audioChartOptions: any = {
      type: 'line',
      data: dataExample[1],
      options: {
        legend: {
          display: false,
        },
        animation: false,
        maintainAspectRatio: false,
        scales: {
          yAxes: this.chartYAxisOptions(this.audioMetricsDataMap),
        },
      },
    };
    this.videoInstance = new Chart(this.video_context, videoChartOptions);
    this.audioInstance = new Chart(this.audio_context, audioChartOptions);
  }

  @Watch('video_data')
  video_watcher(isVideo: boolean, newData: any, newLabels: any) {
    let toChange = isVideo ? this.videoInstance : this.audioInstance;
    Object.keys(newData).map((metric, index) => {
      toChange.data.datasets[index].data.shift();
      toChange.data.datasets[index].data.push(newData[metric].slice(-1)[0]);
      toChange.data.labels = newLabels.slice(1).slice(-8);
      toChange.update();
    });
  }

  @Listen('playerEvent', { target: 'document' })
  playerEventHandler(event) {
    switch (event.detail.type) {
      case 'load':
        this.audioChartInterval = setInterval(() => {
          this.video_watcher(false, this.audioMetricsDataMap, this.currentTimeArr);
        }, 1000);
        this.videoChartInterval = setInterval(() => {
          this.video_watcher(true, this.videoMetricsDataMap, this.currentTimeArr);
        }, 1000);
        break;
      case 'stop':
        clearInterval(this.audioChartInterval);
        clearInterval(this.videoChartInterval);
        break;
      default:
        break;
    }
  }

  protected render() {
    return (
      <Host>
        <ion-accordion titleText="Statistics">
          <ion-grid>
            <ion-row>
              <ion-col size="12">
                <ion-title>Video</ion-title>
                {Object.keys(this.videoMetricsDataMap).map(metric => (
                  <ion-item class="inline-item">
                    <ion-label class="rmv-b-border">
                      {metric}: {this.videoMetricsDataMap[metric].slice(-1)[0]}
                    </ion-label>
                    <ion-checkbox checked color="primary" slot="start" onIonChange={ev => this.chartVisibility(true, [metric], ev.detail.checked)}></ion-checkbox>
                  </ion-item>
                ))}
              </ion-col>
            </ion-row>
            <ion-item-divider></ion-item-divider>
            <ion-card-content>
              <ion-button onClick={() => this.clearChart(true)}>Clear</ion-button>
              <ion-button onClick={() => this.disableChart(true)}>{this.videoDisable ? 'Disabled' : 'Enabled'}</ion-button>
              <ion-row>
                <div class="display">
                  <canvas id="video_canvas">a chart</canvas>
                </div>
              </ion-row>
            </ion-card-content>
            <ion-item-divider></ion-item-divider>
            <ion-row>
              <ion-col size="12">
                <br />
                <ion-title>Audio</ion-title>
                {Object.keys(this.audioMetricsDataMap).map(metric => (
                  <ion-item class="inline-item">
                    <ion-label class="rmv-b-border">
                      {metric}: {this.audioMetricsDataMap[metric].slice(-1)[0]}
                    </ion-label>
                    <ion-checkbox checked color="primary" slot="start" onIonChange={ev => this.chartVisibility(false, [metric], ev.detail.checked)}></ion-checkbox>
                  </ion-item>
                ))}
              </ion-col>
            </ion-row>
            <ion-item-divider></ion-item-divider>
            <ion-card-content>
              <ion-button onClick={() => this.clearChart(false)}>Clear</ion-button>
              <ion-button onClick={() => this.disableChart(false)}>{this.audioDisable ? 'Disabled' : 'Enabled'}</ion-button>
              <ion-row>
                <div class="display">
                  <canvas id="audio_canvas">another chart</canvas>
                </div>
              </ion-row>
            </ion-card-content>
          </ion-grid>
        </ion-accordion>
      </Host>
    );
  }
}
