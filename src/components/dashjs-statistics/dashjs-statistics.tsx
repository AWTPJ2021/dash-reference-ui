import { Component, Host, h, Prop, Watch, Element, State} from '@stencil/core';
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
	videoDisable : string = "Disable";

	@State()
	audioDisable : string = "Disable";

	chartVisibility(isVideo, title, checked) {
		let toChange = isVideo ? this.videoInstance : this.audioInstance;		
		toChange.data.datasets.forEach(function (ds, index) {
			if(ds.label == title) {
				ds.hidden = checked ? false : true;
				toChange.options.scales.yAxes[index].display = checked ? true : false;
			}
		});
		if((isVideo && this.videoDisable == "Disable") || (!isVideo && this.audioDisable == "Disable")) {
			toChange.data.datasets[0].data.shift();
			toChange.data.datasets[0].data.push(122);
		}
		toChange.update();
	}

	disableChart(isVideo) {
		if(isVideo)
			this.videoDisable = this.videoDisable == "Disable" ? "Enable" : "Disable";
		else
			this.audioDisable = this.audioDisable == "Disable" ? "Enable" : "Disable";

		console.log("video: + " + this.videoDisable);
		console.log("audio: " + this.audioDisable);
	}

	clearChart(isVideo) {
		let toChange = isVideo ? this.videoInstance : this.audioInstance;
			toChange.data.datasets.forEach(function (ds) {
			ds.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		});
		toChange.update();	
	}

	@Watch('video_data')
	video_watcher(newData: any) {
		if(this.videoDisable == "Disable") {
			for(let index in newData) {
				this.videoInstance.data.datasets[index].shift();
				this.videoInstance.data.datasets[index].push(newData[index]);
			}
			this.videoInstance.update();
		}
	}

	@Watch('audio_data')
	audio_watcher(newData: any) {
		for(let index in newData) {
			this.audioInstance.data.datasets[index].data.shift();
			this.audioInstance.data.datasets[index].data.push(newData[index]);
			}
	  	this.audioInstance.update();
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
  
	componentDidLoad() {
		// Data Example
		this.video_canvas = this.el.querySelector('#video_canvas');
		this.audio_canvas = this.el.querySelector('#audio_canvas');

		this.video_context = this.video_canvas.getContext('2d');
		this.audio_context = this.audio_canvas.getContext('2d');
		var dataExample = [{
			labels: ["00:00", "00:01", "00:02", "00:03", "00:04", "00:05", "00:06", "00:07", "00:08", "00:09"],
			datasets: [{ 
				data: [86,114,106,106,107,111,133,221,783,2478],
				label: "Buffer Length",
				borderColor: "#3e95cd",
				yAxisID: 'y0',
				fill: false
			  }, { 
				data: [282,350,411,502,635,809,947,1402,3700,5267],
				label: "Bitrate Downloading",
				borderColor: "#8e5ea2",
				yAxisID: 'y1',
				fill: false
			  }
			]
		}, {
			labels: ["00:00", "00:01", "00:02", "00:03", "00:04", "00:05", "00:06", "00:07", "00:08", "00:09"],
			datasets: [{ 
				data: [200,311,406,506,607,711,433,421,483,478],
				label: "Buffer Length",
				borderColor: "#3e95cd",
				yAxisID: 'y0',
				fill: false
				}, { 
				data: [282,350,411,502,635,809,947,1402,3700,5267],
				label: "Bitrate Downloading",
				borderColor: "#8e5ea2",
				yAxisID: 'y1',
				fill: false
				}
			]
		}];

		const videoChartOptions: any = {
		  	type: 'line',
		  	data: dataExample[0],
		  	options: {
				legend: {
					display: false
				},
				maintainAspectRatio: false,
				scales: {
					yAxes: [{
						gridLines: {
							color: "rgba(0, 0, 0, 0)",
						},
						stacked: false,
						position: 'right',
						type: 'linear',
						scaleLabel: {
							display: true,
							labelString: "Buffer Length",
							fontColor: "#3e95cd"
						},
						id: 'y0',
						ticks: {
						display: true,
						beginAtZero: false
						}
					},{
						gridLines: {
							color: "rgba(0, 0, 0, 0)",
						},
						stacked: true,
						position: 'right',
						type: 'linear',
						scaleLabel: {
						display: true,
						labelString: "Bitrate Downloading",
						fontColor: "#8e5ea2"
						},
						id: 'y1',
						ticks: {
						beginAtZero:false
						}
					}
				]
			}
		  }
		};

		const audioChartOptions: any = {
			type: 'line',
		  	data: dataExample[1],
		  	options: {
				legend: {
					display: false
				},
			maintainAspectRatio: false,
			scales: {
				yAxes: [
					{
						gridLines: {
							color: "rgba(0, 0, 0, 0)",
						},
						stacked: false,
						position: 'right',
						type: 'linear',
						scaleLabel: {
							display: true,
							labelString: "Buffer Length",
							fontColor: "#3e95cd"
						},
						id: 'y0',
						ticks: {
						display: true,
						beginAtZero: true
						}
					},{
					gridLines: {
						color: "rgba(0, 0, 0, 0)",
					},
					stacked: true,
					position: 'right',
					type: 'linear',
					scaleLabel: {
					  display: true,
					  labelString: "Bitrate Downloading",
					  fontColor: "#8e5ea2"
					},
					id: 'y1',
					ticks: {
					  beginAtZero:true
					}
				}
				]
				}
		  	}	
		};
		this.videoInstance = new Chart(this.video_context, videoChartOptions);
		this.audioInstance = new Chart(this.audio_context, audioChartOptions);
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
					<ion-card-title class="centered-header">Statistics</ion-card-title>
				</ion-card-header>
				<ion-grid>
					<ion-row class="r-border">
						<ion-col size="6">
							<ion-title>Video</ion-title>
							<ion-item class="inline-item">
								<ion-label class="rmv-b-border">Buffer Length: {v_buffer_length}</ion-label>
								<ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, "Buffer Length", ev.detail.checked)}></ion-checkbox>
							</ion-item>
							<ion-item class="inline-item">
								<ion-label class="rmv-b-border">Bitrate Downloading: {v_bitrate_downloading} kbs</ion-label>
								<ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(true, "Bitrate Downloading", ev.detail.checked)}></ion-checkbox>
							</ion-item>
						</ion-col>
					
						<ion-col size="6">
							<ion-title>Audio</ion-title>
							<ion-item class="inline-item">
								<ion-label class="rmv-b-border">Buffer Length: {a_buffer_length}</ion-label>
								<ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(false, "Buffer Length", ev.detail.checked)}></ion-checkbox>
							</ion-item>
							<ion-item class="inline-item">
								<ion-label class="rmv-b-border">Bitrate Downloading: {a_bitrate_downloading} kbs</ion-label>
								<ion-checkbox color="primary" checked slot="start" onIonChange={ev => this.chartVisibility(false, "Bitrate Downloading", ev.detail.checked)}></ion-checkbox>
							</ion-item>
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
