import { Component, Host, h, Prop, Watch, Element} from '@stencil/core';
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

	@Watch('video_data')
	protected video_watcher(newData: any): void {
	  console.log('chart-js::dataWatcher', newData);
  
	  this.videoInstance.data.labels = newData.labels;
  
	  this.videoInstance.data.datasets.forEach((dataset: any) => {
		dataset.data = newData.values;
	  });
  
	  this.videoInstance.update();
	}

	@Watch('audio_data')
	protected audio_watcher(newData: any): void {
	  console.log('chart-js::dataWatcher', newData);
  
	  this.audioInstance.data.labels = newData.labels;
  
	  this.audioInstance.data.datasets.forEach((dataset: any) => {
		dataset.data = newData.values;
	  });
  
	  this.audioInstance.update();
	}

	@Element()
	private el: HTMLElement;
	private video_canvas: HTMLCanvasElement;
	private audio_canvas: HTMLCanvasElement;
	private video_context: CanvasRenderingContext2D;
	private audio_context: CanvasRenderingContext2D;
  
	@Prop() 
	isServer: boolean;
	protected videoInstance: any;
	protected audioInstance: any;
  
	protected componentDidLoad(): void {
  
	  if (!this.isServer) {
		this.video_canvas = this.el.querySelector('#video_canvas');
		this.audio_canvas = this.el.querySelector('#audio_canvas');

		this.video_context = this.video_canvas.getContext('2d');
		this.audio_context = this.audio_canvas.getContext('2d');

		const chartOptions: any = {
		  type: 'line',
		  data: {
			labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
			datasets: [{ 
				data: [86,114,106,106,107,111,133,221,783,2478],
				label: "Africa",
				borderColor: "#3e95cd",
				fill: false
			  }, { 
				data: [282,350,411,502,635,809,947,1402,3700,5267],
				label: "Asia",
				borderColor: "#8e5ea2",
				fill: false
			  }, { 
				data: [168,170,178,190,203,276,408,547,675,734],
				label: "Europe",
				borderColor: "#3cba9f",
				fill: false
			  }, { 
				data: [40,20,10,16,24,38,74,167,508,784],
				label: "Latin America",
				borderColor: "#e8c3b9",
				fill: false
			  }, { 
				data: [6,3,2,2,7,26,82,172,312,433],
				label: "North America",
				borderColor: "#c45850",
				fill: false
			  }
			]
		  },
		  options: {
			animation: {
			  duration: 0
			},
			responsive: true,
			maintainAspectRatio: false,
			scales: {
			  yAxes: [{
				ticks: {
				  beginAtZero: true
				}
			  }]
			}
		  }
		};
  
		this.videoInstance = new Chart(this.video_context, chartOptions);
		console.log(this.videoInstance);
		this.audioInstance = new Chart(this.audio_context, chartOptions);
		console.log(this.audioInstance);
	  }

	}

 protected render() {	
	const a_buffer_length = 0;
	const a_bitrate_downloading = 0;
	const v_buffer_length = 0;
	const v_bitrate_downloading = 0;
    return (
      	<Host>
			<ion-card>
				<ion-card-header>
					<ion-card-title>Statistics</ion-card-title>
				</ion-card-header>
				<ion-grid>
					<ion-row>
						<ion-col size="6">
							<ion-title>Video</ion-title>
							<ion-item>
								<ion-label>Buffer Length: {v_buffer_length}</ion-label>
								<ion-checkbox color="primary" checked slot="start"></ion-checkbox>
							</ion-item>
							<ion-item>
								<ion-label>Bitrate Downloading: {v_bitrate_downloading} kbs</ion-label>
								<ion-checkbox color="primary" checked slot="start"></ion-checkbox>
							</ion-item>
						</ion-col>
					
						<ion-col size="6">
							<ion-title>Audio</ion-title>
							<ion-item>
								<ion-label>Buffer Length: {a_buffer_length}</ion-label>
								<ion-checkbox color="primary" checked slot="start"></ion-checkbox>
							</ion-item>
							<ion-item>
								<ion-label>Bitrate Downloading: {a_bitrate_downloading} kbs</ion-label>
								<ion-checkbox color="primary" checked slot="start"></ion-checkbox>
							</ion-item>
						</ion-col>
					</ion-row>
					<ion-row>
						<div class="display">
							<canvas id="video_canvas" width='1000' height='300'>a chart</canvas>
						</div>
					</ion-row>
					<ion-row>
						<div class="display">
							<canvas id="audio_canvas" width='1000' height='300'>another chart</canvas>
						</div>
					</ion-row>
				</ion-grid>
			</ion-card>
		</Host>		
    );
  }
}
