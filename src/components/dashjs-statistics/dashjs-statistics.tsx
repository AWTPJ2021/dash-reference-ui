import { Component, Host, h, Prop, Watch, Element, State, Listen } from '@stencil/core';
import * as chartjs from 'chart.js';
const { Chart } = chartjs.default.Chart;

@Component({
  tag: 'dashjs-statistics',
  styleUrl: 'dashjs-statistics.css',
  shadow: false,
})
export class DashjsStatistics {
  @Prop()
  video_data: any;
  @Prop()
  audio_data: any;

  @State()
  videoDisable: boolean = false;

  @State()
  audioDisable: boolean = false;

  @State()
  chartInterval: any;

  // DashMetrics properties

  // @State()
  // metricsMap = {
  //   videoBufferLength: 10,
  //   videoBitrate: 10,
  //   videoDroppedFrames: 10,
  //   videoFrameRate: 10,
  //   videoIndex: 10,
  //   maxVideoIndex: 10,
  //   audioBufferLevel: 10,
  //   audioBitrate: 10,
  //   audioDroppedFrames: 10,
  //   maxAudioIndex: 10,
  //   latency: 10,
  // };

  @State()
  metricsDataMap = {
    'v_Buffer Length': [],
    'v_Bitrate Downloading': [],
    'v_Dropped Frames': [],
    'v_Frame Rate': [],
    'v_Index': [],
    'v_Max Index': [],
    'a_Buffer Level': [],
    'a_Bitrate': [],
    'a_Dropped Frames': [],
    'a_Max Index': [],
    'latency': [],
  };

  @State()
  videoBufferLength: number;
  videoBitrate: number;
  videoDroppedFrames: number;
  videoFrameRate: number;
  videoIndex: number;
  maxVideoIndex: number;
  audioBufferLevel: number;
  audioBitrate: number;
  audioDroppedFrames: number;
  maxAudioIndex: number;
  latency: any;
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
    if (isVideo) this.videoDisable = this.videoDisable? false : true;
    else this.audioDisable = this.audioDisable  ? false : true;
    console.log('video: + ' + this.videoDisable);
    console.log('audio: ' + this.audioDisable);
  }

  clearChart(isVideo) {
    let toChange = isVideo ? this.videoInstance : this.audioInstance;
    toChange.data.datasets.forEach(function (ds) {
      ds.data = [0, 0, 0, 0, 0, 0];
    });
    toChange.update();
  }

  @Watch('audio_data')
  audio_watcher(newData: any) {
    if(!this.audioDisable) {
      for (let index in newData) {
        this.audioInstance.data.datasets[index].data.shift();
        this.audioInstance.data.datasets[index].data.push(newData[index]);
      }
      this.audioInstance.update();
    }
  }

  @Element()
  el: HTMLElement;
  video_canvas: HTMLCanvasElement;
  audio_canvas: HTMLCanvasElement;
  video_context: CanvasRenderingContext2D;
  audio_context: CanvasRenderingContext2D;

  @Prop()
  videoInstance: any;
  audioInstance: any;

  @Listen('streamMetricsEvent', { target: 'document' })
  streamMetricsEventHandler(event) {
    this.streamMetrics(event.detail);
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
      this.latency = Number(
        setTimeout(() => {
          player.getCurrentLiveLatency();
        }, 1000),
      );
      this.metricsDataMap.latency.push(this.latency);

      // Video Metrics
      let videoRepSwitch = dashMetrics.getCurrentRepresentationSwitch('video');
      let videoAdaptation = dashAdapter.getAdaptationForType(periodIdx, 'video', streamInfo);

      this.videoBufferLength = dashMetrics.getCurrentBufferLevel('video');
      this.metricsDataMap['v_Buffer Length'].push(this.videoBufferLength);

      this.videoDroppedFrames = dashMetrics.getCurrentDroppedFrames('video').droppedFrames;
      this.metricsDataMap['v_Dropped Frames'].push(this.videoDroppedFrames);

      this.videoBitrate = videoRepSwitch ? Math.round(dashAdapter.getBandwidthForRepresentation(videoRepSwitch.to, periodIdx) / 1000) : NaN;
      this.metricsDataMap['v_Bitrate Downloading'].push(this.videoBitrate);

      this.videoFrameRate = videoAdaptation.Representation_asArray.find(function (rep) {
        return rep.id === videoRepSwitch.to;
      }).frameRate;
      this.metricsDataMap['v_Frame Rate'].push(this.videoFrameRate);

      this.videoIndex = dashAdapter.getIndexForRepresentation(videoRepSwitch.to, periodIdx);
      this.metricsDataMap['v_Index'].push(this.videoIndex);

      this.maxVideoIndex = dashAdapter.getMaxIndexForBufferType('video', periodIdx);
      this.metricsDataMap['v_Max Index'].push(this.maxVideoIndex);

      // Audio Metrics
      let audioRepSwitch = dashMetrics.getCurrentRepresentationSwitch('audio');

      this.audioBufferLevel = dashMetrics.getCurrentBufferLevel('audio');
      this.metricsDataMap['a_Buffer Level'].push(this.audioBufferLevel);

      this.audioDroppedFrames = dashMetrics.getCurrentDroppedFrames('audio').droppedFrames;
      this.metricsDataMap['a_Dropped Frames'].push(this.audioDroppedFrames);

      this.audioBitrate = audioRepSwitch ? Math.round(dashAdapter.getBandwidthForRepresentation(audioRepSwitch.to, periodIdx) / 1000) : NaN;
      this.metricsDataMap['a_Bitrate'].push(this.audioBitrate);

      this.maxAudioIndex = dashAdapter.getMaxIndexForBufferType('audio', periodIdx);
      this.metricsDataMap['a_Max Index'].push(this.maxAudioIndex);
    }
  }

  @Watch('video_data')
  video_watcher(isVideo: boolean, newData: any, newLabels: any) {
    if(!this.videoDisable) {
      let toChange = isVideo ? this.videoInstance : this.audioInstance;
      // for (let index in newData) {
      toChange.data.datasets[0].data = newData.slice(1).slice(-6);
      toChange.data.labels = newLabels.slice(1).slice(-6);
      // }
      toChange.update();
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
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0],
            label: 'v_Buffer Length',
            lineTension: 0,
            borderColor: '#3e95cd',
            yAxisID: 'y0',
            fill: false,
          },
          {
            data: [0, 0, 0, 0, 0, 0],
            label: 'v_Bitrate Downloading',
            lineTension: 0,
            borderColor: '#8e5ea2',
            yAxisID: 'y1',
            fill: false,
          },
        ],
      },
      {
        labels: ['00:00', '00:01', '00:02', '00:03', '00:04', '00:05'],
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0],
            label: 'a_Buffer Length',
            lineTension: 0,
            borderColor: '#3e95cd',
            yAxisID: 'y0',
            fill: false,
          },
          {
            data: [0, 0, 0, 0, 0, 0],
            label: 'a_Bitrate Downloading',
            lineTension: 0,
            borderColor: '#8e5ea2',
            yAxisID: 'y1',
            fill: false,
          },
        ],
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
          yAxes: [
            {
              gridLines: {
                color: 'rgba(0, 0, 0, 0)',
              },
              stacked: false,
              position: 'right',
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: 'Buffer Length',
                fontColor: '#3e95cd',
              },
              id: 'y0',
              ticks: {
                display: true,
                beginAtZero: false,
              },
            },
            {
              gridLines: {
                color: 'rgba(0, 0, 0, 0)',
              },
              stacked: true,
              position: 'right',
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: 'Bitrate Downloading',
                fontColor: '#8e5ea2',
              },
              id: 'y1',
              ticks: {
                beginAtZero: false,
              },
            },
          ],
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
          yAxes: [
            {
              gridLines: {
                color: 'rgba(0, 0, 0, 0)',
              },
              stacked: false,
              position: 'right',
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: 'Buffer Length',
                fontColor: '#3e95cd',
              },
              id: 'y0',
              ticks: {
                display: true,
                beginAtZero: true,
              },
            },
            {
              gridLines: {
                color: 'rgba(0, 0, 0, 0)',
              },
              stacked: true,
              position: 'right',
              type: 'linear',
              scaleLabel: {
                display: true,
                labelString: 'Bitrate Downloading',
                fontColor: '#8e5ea2',
              },
              id: 'y1',
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
    this.videoInstance = new Chart(this.video_context, videoChartOptions);
    this.audioInstance = new Chart(this.audio_context, audioChartOptions);
  }

  componentWillLoad() {
    this.chartInterval = setInterval(() => {
      this.video_watcher(true, this.metricsDataMap['v_Buffer Length'], this.currentTimeArr);
    }, 1000);
  }

  protected render() {
    return (
      <Host>
        <ion-accordion titleText="Statistics">
          <ion-grid>
            <ion-row class="r-border">
              <ion-col size="6">
                <ion-title>Video</ion-title>
                {/* {Object.fromEntries(
                  Object.entries(this.metricsMap).map(([key, value]) => (
                    <ion-item class="inline-item">
                      <ion-label class="rmv-b-border">
                        {key}: {value}
                      </ion-label>
                      <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, { key }, ev.detail.checked)}></ion-checkbox>
                    </ion-item>
                  )),
                )} */}
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Buffer Length: {this.videoBufferLength}</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, 'v_Buffer Length', ev.detail.checked)}></ion-checkbox>
                </ion-item>
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Bitrate Downloading: {this.videoBitrate} kbs</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, 'v_Bitrate Downloading', ev.detail.checked)}></ion-checkbox>
                </ion-item>
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Dropped Frames: {this.videoDroppedFrames}</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, 'v_Dropped Frames', ev.detail.checked)}></ion-checkbox>
                </ion-item>
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Frame Rate: {this.videoFrameRate}</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, 'v_Frame Rate', ev.detail.checked)}></ion-checkbox>
                </ion-item>
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Latency: {this.latency}</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, 'Latency', ev.detail.checked)}></ion-checkbox>
                </ion-item>
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Index: {this.videoIndex}</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, 'v_Index', ev.detail.checked)}></ion-checkbox>
                </ion-item>
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Max Index: {this.maxVideoIndex}</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, 'v_Max Index', ev.detail.checked)}></ion-checkbox>
                </ion-item>
              </ion-col>

              <ion-col size="6">
                <ion-title>Audio</ion-title>
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Buffer Length: {this.audioBufferLevel}</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(false, 'a_Buffer Length', ev.detail.checked)}></ion-checkbox>
                </ion-item>
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Bitrate Downloading: {this.audioBitrate} kbs</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(false, 'a_Bitrate Downloading', ev.detail.checked)}></ion-checkbox>
                </ion-item>
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Dropped Frames: {this.audioDroppedFrames}</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, 'a_Dropped Frames', ev.detail.checked)}></ion-checkbox>
                </ion-item>
                <ion-item class="inline-item">
                  <ion-label class="rmv-b-border">Max Index: {this.maxAudioIndex}</ion-label>
                  <ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(false, 'a_Max Index', ev.detail.checked)}></ion-checkbox>
                </ion-item>
              </ion-col>
            </ion-row>

            <ion-item-divider></ion-item-divider>

            <ion-card-content>
              <ion-button onClick={() => this.clearChart(true)}>Clear</ion-button>
              <ion-button onClick={() => this.disableChart(true)}>{this.videoDisable ? "Disable" : "Enable"}</ion-button>
              <ion-row>
                <div class="display">
                  <canvas id="video_canvas">a chart</canvas>
                </div>
              </ion-row>
            </ion-card-content>

            <ion-item-divider></ion-item-divider>

            <ion-card-content>
              <ion-button onClick={() => this.clearChart(false)}>Clear</ion-button>
              <ion-button onClick={() => this.disableChart(false)}>{this.audioDisable ? "Disable" : "Enable"}</ion-button>
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
