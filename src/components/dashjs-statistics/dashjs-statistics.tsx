import { Component, Host, h, Element, State, Listen } from '@stencil/core';
import * as chartjs from 'chart.js';
const { Chart } = chartjs.default.Chart;
import { chartDataset, chartYAxisOptions } from '../../utils/metrics';

@Component({
  tag: 'dashjs-statistics',
  styleUrl: 'dashjs-statistics.css',
  shadow: false,
})
export class DashjsStatistics {
  @Element()
  el: HTMLDashjsStatisticsElement;
  private video_canvas: HTMLCanvasElement;
  private audio_canvas: HTMLCanvasElement;
  private video_context: CanvasRenderingContext2D;
  private audio_context: CanvasRenderingContext2D;

  private videoInstance: any;
  private audioInstance: any;

  @State() videoDisable: boolean = false;

  @State() audioDisable: boolean = false;

  // DashMetrics properties
  @State()
  chartColors = {
    'Buffer Length': '#003f5c',
    'Bitrate Downloading': '#374c80',
    'Dropped Frames': '#7a5195',
    'Frame Rate': '#bc5090',
    'Index': '#ef5675',
    'Max Index': '#ff764a',
    'Live Latency': '#570408',
    'Latency': '#28B463',
    'Download': '#E74C3C',
    'Ratio': '#117864',
  };

  @State()
  metrics = {
    video: {
      'Buffer Length': 0,
      'Bitrate Downloading': 0,
      'Dropped Frames': 0,
      'Frame Rate': 0,
      'Index': 0,
      'Max Index': 0,
      'Live Latency': 0,
      'Latency': '0|0|0',
      'Download': '0|0|0',
      'Ratio': '0|0|0',
    },
    audio: {
      'Buffer Length': 0,
      'Bitrate Downloading': 0,
      'Dropped Frames': 0,
      'Max Index': 0,
      'Latency': '0|0|0',
      'Download': '0|0|0',
      'Ratio': '0|0|0',
    },
    currentTime: '00:00',
  };

  private chartVisibility(isVideo, title, checked) {
    const toChange = isVideo ? this.videoInstance : this.audioInstance;
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

  private disableChart(isVideo) {
    if (isVideo) {
      this.videoDisable = this.videoDisable ? false : true;
    } else {
      this.audioDisable = this.audioDisable ? false : true;
    }
  }

  private clearChart(isVideo) {
    const toChange = isVideo ? this.videoInstance : this.audioInstance;
    toChange.data.datasets.forEach(function (ds) {
      ds.data = [0, 0, 0, 0, 0, 0, 0, 0];
    });
    toChange.update();
  }

  @Listen('metricsEvent', { target: 'document' })
  metricsWatch(event) {
    this.metrics = { ...event.detail };
    !this.videoDisable ? this.video_watcher(true, event.detail.video, event.detail.currentTime) : null;
    !this.audioDisable ? this.video_watcher(false, event.detail.audio, event.detail.currentTime) : null;
  }

  componentDidLoad() {
    // Data Example
    // @ts-ignore
    this.video_canvas = this.el.querySelector('#video_canvas');
    // @ts-ignore
    this.audio_canvas = this.el.querySelector('#audio_canvas');

    // @ts-ignore
    this.video_context = this.video_canvas.getContext('2d');
    // @ts-ignore
    this.audio_context = this.audio_canvas.getContext('2d');
    const dataExample = [
      {
        labels: ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'],
        datasets: chartDataset(this.metrics.video, this.chartColors),
      },
      {
        labels: ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'],
        datasets: chartDataset(this.metrics.audio, this.chartColors),
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
          yAxes: chartYAxisOptions(this.metrics.video, this.chartColors),
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
          yAxes: chartYAxisOptions(this.metrics.audio, this.chartColors),
        },
      },
    };
    this.videoInstance = new Chart(this.video_context, videoChartOptions);
    this.audioInstance = new Chart(this.audio_context, audioChartOptions);
  }

  private video_watcher(isVideo: boolean, newData: any, newLabels: any) {
    const toChange = isVideo ? this.videoInstance : this.audioInstance;
    Object.keys(newData).map((metric, index) => {
      toChange.data.datasets[index].data.shift();
      if (metric === 'Download' || metric === 'Latency' || metric === 'Ratio') {
        toChange.data.datasets[index].data.push(newData[metric].split('|')[1]);
      } else {
        toChange.data.datasets[index].data.push(newData[metric]);
      }
    });
    toChange.data.labels.shift();
    toChange.data.labels.push(newLabels);
    toChange.update();
  }

  private currentMetric(metrics: any, type: string, isVideo: boolean, disable: boolean) {
    return (
      <div>
        <ion-row>
          <ion-col size="12">
            <ion-title>{type.charAt(0).toUpperCase() + type.slice(1)}</ion-title>
            {Object.keys(metrics[type]).map(metric => (
              <ion-item class="inline-item">
                <ion-label class="rmv-b-border">
                  {metric}: {metrics[type][metric]}
                </ion-label>
                <ion-checkbox checked color="primary" slot="start" onIonChange={ev => this.chartVisibility(isVideo, [metric], ev.detail.checked)}></ion-checkbox>
              </ion-item>
            ))}
          </ion-col>
        </ion-row>
        <ion-card-content>
          <ion-button onClick={() => this.clearChart(isVideo)}>Clear</ion-button>
          <ion-button onClick={() => this.disableChart(isVideo)}>{disable ? 'Disabled' : 'Enabled'}</ion-button>
          <ion-row>
            <div class="display">
              <canvas id={`${type}_canvas`}>{`${type} chart`}</canvas>
            </div>
          </ion-row>
        </ion-card-content>
      </div>
    );
  }

  protected render() {
    return (
      <Host>
        <ion-accordion titleText="Statistics">
          <ion-grid>
            {this.currentMetric(this.metrics, 'video', true, this.videoDisable)}
            <ion-item-divider></ion-item-divider>
            {this.currentMetric(this.metrics, 'audio', false, this.audioDisable)}
            <ion-item-divider></ion-item-divider>
          </ion-grid>
        </ion-accordion>
      </Host>
    );
  }
}
