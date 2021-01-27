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
  @Prop()
  audio_data: any;

  @State()
  videoDisable: string = 'Disable';

  @State()
  audioDisable: string = 'Disable';

  @State()
  chartInterval: any;

  // DashMetrics properties
  @State()
  chartColors = {
    'Buffer Length': '#003f5c',
    'Bitrate Downloading': '#374c80',
    'Dropped Frames': '#7a5195',
    'Frame Rate': '#bc5090',
    'Index': '#ef5675',
    'Max Index': '#ff764a',
    'latency': '#570408',
  };

  @State()
  metricsDataMap = {
    'v_Buffer Length': [],
    'v_Bitrate Downloading': [],
    'v_Dropped Frames': [],
    'v_Frame Rate': [],
    'v_Index': [],
    'v_Max Index': [],
    'v_latency': [],
    'a_Buffer Length': [],
    'a_Bitrate Downloading': [],
    'a_Dropped Frames': [],
    'a_Max Index': [],
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
    if ((isVideo && this.videoDisable == 'Disable') || (!isVideo && this.audioDisable == 'Disable')) {
      toChange.data.datasets[0].data.shift();
      toChange.data.datasets[0].data.push(122);
    }
    toChange.update();
  }

  disableChart(isVideo) {
    clearInterval(this.chartInterval);
    if (isVideo) this.videoDisable = this.videoDisable == 'Disable' ? 'Enable' : 'Disable';
    else this.audioDisable = this.audioDisable == 'Disable' ? 'Enable' : 'Disable';

    console.log('video: + ' + this.videoDisable);
    console.log('audio: ' + this.audioDisable);
  }

  clearChart(isVideo) {
    clearInterval(this.chartInterval);
    let toChange = isVideo ? this.videoInstance : this.audioInstance;
    toChange.data.datasets.forEach(function (ds) {
      ds.data = [0, 0, 0, 0, 0, 0];
    });
    toChange.update();
  }

  @Listen('streamMetricsEvent', { target: 'document' })
  streamMetricsEventHandler(event) {
    this.streamMetrics(event.detail);
  }

  chartYAxisOptions(metricsData: any, category: string) {
    const yAxesArray = [];
    Object.keys(metricsData).map((metric, index) => {
      let first = metric.charAt(0);
      let newEntry = {
        gridLines: {
          color: 'rgba(0, 0, 0, 0)',
        },
        stacked: false,
        position: 'right',
        type: 'linear',
        // display: false,
        scaleLabel: {
          display: true,
          labelString: metric,
          fontColor: this.chartColors[metric.substring(2)],
        },
        id: 'y' + index,
        ticks: {
          display: true,
          beginAtZero: false,
        },
      };
      first === category ? yAxesArray.push(newEntry) : null;
    });
    return yAxesArray;
  }

  chartDataset(metricsData: any, category: string) {
    const dataset = [];
    Object.keys(metricsData).map((metric, index) => {
      let first = metric.charAt(0);
      let newEntry = {
        data: [0, 0, 0, 0, 0, 0],
        label: metric,
        lineTension: 0,
        borderColor: this.chartColors[metric.substring(2)],
        yAxisID: 'y' + index,
        fill: false,
      };
      first === category ? dataset.push(newEntry) : null;
    });
    return dataset;
  }

  streamMetrics(player: any) {
    const streamInfo = player && player.getActiveStream().getStreamInfo();
    const dashMetrics = player && player.getDashMetrics();
    const dashAdapter = player && player.getDashAdapter();

    if (dashMetrics && streamInfo) {
      const periodIdx = streamInfo.index;
      let currentTimeInSec = player.time().toFixed(0);
      this.currentTime = new Date(currentTimeInSec * 1000).toISOString().substr(11, 8);
      this.currentTimeArr.push(this.currentTime);
      this.metricsDataMap.v_latency.push(
        Number(
          setTimeout(() => {
            player.getCurrentLiveLatency();
          }, 1000),
        ),
      );

      // Video Metrics
      let videoRepSwitch = dashMetrics.getCurrentRepresentationSwitch('video');
      let videoAdaptation = dashAdapter.getAdaptationForType(periodIdx, 'video', streamInfo);

      this.metricsDataMap['v_Buffer Length'].push(dashMetrics.getCurrentBufferLevel('video'));
      this.metricsDataMap['v_Dropped Frames'].push(dashMetrics.getCurrentDroppedFrames('video').droppedFrames);
      this.metricsDataMap['v_Bitrate Downloading'].push(videoRepSwitch ? Math.round(dashAdapter.getBandwidthForRepresentation(videoRepSwitch.to, periodIdx) / 1000) : NaN);
      this.metricsDataMap['v_Index'].push(dashAdapter.getIndexForRepresentation(videoRepSwitch.to, periodIdx));
      this.metricsDataMap['v_Max Index'].push(dashAdapter.getMaxIndexForBufferType('video', periodIdx));
      this.metricsDataMap['v_Frame Rate'].push(
        videoAdaptation.Representation_asArray.find(function (rep) {
          return rep.id === videoRepSwitch.to;
        }).frameRate,
      );

      // Audio Metrics
      let audioRepSwitch = dashMetrics.getCurrentRepresentationSwitch('audio');

      this.metricsDataMap['a_Buffer Length'].push(dashMetrics.getCurrentBufferLevel('audio'));
      this.metricsDataMap['a_Dropped Frames'].push(dashMetrics.getCurrentDroppedFrames('audio').droppedFrames);
      this.metricsDataMap['a_Bitrate Downloading'].push(audioRepSwitch ? Math.round(dashAdapter.getBandwidthForRepresentation(audioRepSwitch.to, periodIdx) / 1000) : NaN);
      this.metricsDataMap['a_Max Index'].push(dashAdapter.getMaxIndexForBufferType('audio', periodIdx));
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
        labels: ['00:00', '00:01', '00:02', '00:03', '00:04', '00:05'],
        datasets: this.chartDataset(this.metricsDataMap, 'v'),
      },
      {
        labels: ['00:00', '00:01', '00:02', '00:03', '00:04', '00:05'],
        datasets: this.chartDataset(this.metricsDataMap, 'a'),
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
          yAxes: this.chartYAxisOptions(this.metricsDataMap, 'v'),
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
          yAxes: this.chartYAxisOptions(this.metricsDataMap, 'a'),
        },
      },
    };
    this.videoInstance = new Chart(this.video_context, videoChartOptions);
    this.audioInstance = new Chart(this.audio_context, audioChartOptions);
  }

  @Watch('video_data')
  video_watcher(isVideo: boolean, newData: any, newLabels: any, category: string) {
    let toChange = isVideo ? this.videoInstance : this.audioInstance;
    Object.keys(newData).map((metric, index) => {
      let first = metric.charAt(0);
      if (first === category) {
        toChange.data.datasets[index].data = newData[metric].slice(1).slice(-6);
        toChange.data.labels = newLabels.slice(1).slice(-6);
        toChange.update();
      }
    });
  }

  // @Watch('audio_data')
  // audio_watcher(newData: any) {
  //   for (let index in newData) {
  //     this.audioInstance.data.datasets[index].data.shift();
  //     this.audioInstance.data.datasets[index].data.push(newData[index]);
  //   }
  //   this.audioInstance.update();
  // }

  componentWillLoad() {
    // this.chartInterval = setInterval(() => {
    //   this.video_watcher(false, this.metricsDataMap, this.currentTimeArr, 'a');
    // }, 1000);
    this.chartInterval = setInterval(() => {
      this.video_watcher(true, this.metricsDataMap, this.currentTimeArr, 'v');
    }, 1000);
  }

  protected render() {
    return (
      <Host>
        <ion-card>
          <ion-card-header>
            <ion-card-title class="centered-header">Statistics</ion-card-title>
          </ion-card-header>
          <ion-grid>
            <ion-row class="r-border">
              <ion-col size="6">
                <ion-title>Video</ion-title>
                {Object.keys(this.metricsDataMap).map(metric =>
                  metric.charAt(0) === 'v' ? (
                    <ion-item class="inline-item">
                      <ion-label class="rmv-b-border">
                        {metric.substring(2)}: {this.metricsDataMap[metric].slice(-1)[0]}
                      </ion-label>
                      <ion-checkbox color="primary" slot="start" onIonChange={ev => this.chartVisibility(true, [metric], ev.detail.checked)}></ion-checkbox>
                    </ion-item>
                  ) : null,
                )}
              </ion-col>
              <ion-col size="6">
                <ion-title>Audio</ion-title>
                {Object.keys(this.metricsDataMap).map(metric =>
                  metric.charAt(0) === 'a' ? (
                    <ion-item class="inline-item">
                      <ion-label class="rmv-b-border">
                        {metric.substring(2)}: {this.metricsDataMap[metric].slice(-1)[0]}
                      </ion-label>
                      <ion-checkbox color="primary" slot="start" onIonChange={ev => this.chartVisibility(false, [metric], ev.detail.checked)}></ion-checkbox>
                    </ion-item>
                  ) : null,
                )}
              </ion-col>
            </ion-row>

            <ion-item-divider></ion-item-divider>

            <ion-card-content>
              <ion-button onClick={() => this.clearChart(true)}>Clear</ion-button>
              <ion-button onClick={() => this.disableChart(true)}>{this.videoDisable}</ion-button>
              <ion-row>
                <div class="display">
                  <canvas id="video_canvas">a chart</canvas>
                </div>
              </ion-row>
            </ion-card-content>

            <ion-item-divider></ion-item-divider>

            <ion-card-content>
              <ion-button onClick={() => this.clearChart(false)}>Clear</ion-button>
              <ion-button onClick={() => this.disableChart(false)}>{this.audioDisable}</ion-button>
              <ion-row>
                <div class="display">
                  <canvas id="audio_canvas">another chart</canvas>
                </div>
              </ion-row>
            </ion-card-content>
          </ion-grid>
        </ion-card>
      </Host>
    );
  }
}
