/* global Module */

/* Magic Mirror
* Module: MMM-XiaomiVacuum
* ver 1.1
* By John Kristensen
* MIT Licensed.
*/

Module.register('MMM-XiaomiVacuum', {
    defaults: {
        token: '',
        ipAddress: '',
        updateInterval: 5 * 1000, // 1 miniute
        animationSpeed: 2 * 1000, // 2 seconds
    },

    requiresVersion: '2.1.0',

    start() {
        const self = this;

        self.loaded = false;
        self.stats = {};

        self.sendSocketNotification('START', self.config);
        Log.info('Starting module: ' + self.name);
    },

    getDom() {
        const self = this;

        if (self.error) {
            return self.renderError();
        }

        if (!self.loaded) {
            return self.renderLoading();
        }

        return self.renderStats();
    },

    renderError() {
        const self = this;

        let wrapper = document.createElement('div');
        wrapper.className = 'dimmed light small';
        wrapper.innerHTML = self.error;
        return wrapper;
    },

    renderLoading() {
        const self = this;

        let wrapper = document.createElement('div');
        wrapper.className = 'dimmed light small';
        wrapper.innerHTML = self.translate('LOADING');

        return wrapper;
    },

    renderStats() {
        const self = this;

        let wrapper = document.createElement('table');
        wrapper.className = 'small';
        wrapper.innerHTML = `
			<tr>
				${self.renderName()}
				${self.renderPhase()}
				${self.renderBinStatus()}
				${self.renderBatteryStatus()}
			</tr>
			<tr>
				${self.RenderFanspeed()}
			</tr>
		<!-- <tr>
				${self.RenderFilterWorkTime()}
			</tr> -->
      <tr>
				${self.RenderSideBrushWorkTime()}
			</tr>
			<tr>
				${self.RendermainBrushWorkTime()}
			</tr>
		<!-- <tr>
				${self.RendersensorDirtyTime()}
			</tr> -->
		`;

        return wrapper;
    },

    renderName() {

        var name = this.stats.name.replace(".VACUUM", "");

        return `<td class="name">${name}</td>`;
    },

    renderPhase() {
        const self = this;

        let phaseText;
        switch (self.stats.phase) {
            case 'initiating':
                phaseText = self.translate('INITIATING');
                break;
            case 'charger-offline':
                phaseText = self.translate('CHARGER_OFFLINE');
                break;
            case 'waiting':
                phaseText = self.translate('WAITING');
                break;
            case 'cleaning':
                phaseText = self.translate('CLEANING');
                break;
            case 'returning':
                phaseText = self.translate('RETURNING');
                break;
            case 'charging':
                phaseText = self.translate('CHARGING');
                break;
            case 'charging-error':
                phaseText = self.translate('CHARGING_ERROR');
                break;
            case 'paused':
                phaseText = self.translate('PAUSED');
                break;
            case 'spot-cleaning':
                phaseText = self.translate('SPOT_CLEANING');
                break;
            case 'error':
                phaseText = self.translate('ERROR');
                break;
            case 'shutting-down':
                phaseText = self.translate('SHUTTING_DOWN');
                break;
            case 'updating':
                phaseText = self.translate('UPDATING');
                break;
            case 'docking':
                phaseText = self.translate('DOCKING');
                break;
            case 'unknown-16':
                phaseText = self.translate('GOING_TO_THE_TARGET');
                break;
            case 'zone-cleaning':
                phaseText = self.translate('ZONE_CLEANING');
                break;
            case 'full':
                phaseText = self.translate('FULL');
                break;
            default:
                phaseText = `${self.translate('UNKNOWN')}: ${self.stats.phase}`;
        }

        return `<td class="phase title bright">${phaseText}</td>`;
    },

    RendersensorDirtyTime() {
        const self = this;

        let sensorDirtyPercent = Math.floor(100 - (this.stats.sensordirtytime) / 108000 * 100);
        let sensorDirtyHours = Math.floor(this.stats.sensordirtytime / 3600);
        let sensorDirtyRemain = (30 - sensorDirtyHours); //this one is for model S50, improvement here maybe ¯\_(ツ)_/¯

        return `
	<td class="name"><i class="fas fa-sliders"></i>${self.translate('SENSOR_DIRTY_TIME')}</td>
	<td class="bin title bright">${sensorDirtyHours}${self.translate('HOURS')}</td>
	<td class="battery">${self.translate('REMAIN')} ${sensorDirtyPercent}% / ${sensorDirtyRemain}${self.translate('HOURS')}</td>`;

    },



    RendermainBrushWorkTime() {
        const self = this;

        let mainBrushWTPercent = Math.floor(100 - (this.stats.mainBrush) / 1080000 * 100);
        let mainBrushWTHours = Math.floor(this.stats.mainBrush / 3600);
        let mainBrushHoursRemain = (300 - mainBrushWTHours); //this one is for model S50, improvement here maybe ¯\_(ツ)_/¯

        return `
	<td class="name"><i class="fas fa-sliders"></i>${self.translate('MAINBRUSH_WORK_TIME')}</td>
	<td class="bin title bright">${mainBrushWTHours}${self.translate('HOURS')}</td>
	<td class="battery">${self.translate('REMAIN')} ${mainBrushWTPercent}% / ${mainBrushHoursRemain}${self.translate('HOURS')}</td>`;

    },


    RenderSideBrushWorkTime() {
        const self = this;

        let sidebrushWTPercent = Math.floor(100 - (this.stats.sidebrush) / 720000 * 100);
        let sidebrushWTHours = Math.floor(this.stats.sidebrush / 3600);
        let sidebrushHoursRemain = (200 - sidebrushWTHours); //this one is for model S50, improvement here maybe ¯\_(ツ)_/¯

        return `
	<td class="name"><i class="fas fa-sliders"></i>${self.translate('SIDEBRUSH_WORK_TIME')}</td>
	<td class="bin title bright">${sidebrushWTHours}${self.translate('HOURS')}</td>
	<td class="battery">${self.translate('REMAIN')} ${sidebrushWTPercent}% / ${sidebrushHoursRemain}${self.translate('HOURS')}</td>`;

    },

    RenderFilterWorkTime() {
        const self = this;

        let filterWTPercent = Math.floor(100 - (this.stats.filterworktime) / 540000 * 100);
        let filterWTHours = Math.floor(this.stats.filterworktime / 3600);
        let filterHoursRemain = (150 - filterWTHours); //this one is for model S50, improvement here maybe ¯\_(ツ)_/¯

        return `
			<td class="name"><i class="fas fa-sliders"></i>${self.translate('FILTER_WORK_TIME')}</td>
			<td class="bin title bright">${filterWTHours}${self.translate('HOURS')}</td>
			<td class="battery">${self.translate('REMAIN')} ${filterWTPercent}% / ${filterHoursRemain}${self.translate('HOURS')}</td>`;

    },



    RenderFanspeed() {
        const self = this;

        let fanSpeedtxt;
        switch (this.stats.fanspeed) {
            case 0: // gen1, gen2 and gen3
                fanSpeedtxt = self.translate('FANSPEED_IDLE');
                break;
            case 38: // gen1, gen2 and gen3
                fanSpeedtxt = self.translate('FANSPEED_QUIET');
                break;
            case 101: // changed in firmware 3.5.7_002008?
                fanSpeedtxt = self.translate('FANSPEED_QUIET');
                break;
            case 105: // gen 2
                fanSpeedtxt = self.translate('FANSPEED_MOPPING');
                break;
            case 38: // gen1, gen2 and gen3
                fanSpeedtxt = self.translate('FANSPEED_QUIET');
                break;
            case 60: // gen1, gen2 and gen3
                fanSpeedtxt = self.translate('FANSPEED_BALANCED');
                break;
            case 102: // // changed in firmware 3.5.7_002008?
                fanSpeedtxt = self.translate('FANSPEED_BALANCED');
                break;
            case 75: // gen2
                fanSpeedtxt = self.translate('FANSPEED_TURBO');
                break;
            case 77: // gen1
                fanSpeedtxt = self.translate('FANSPEED_TURBO');
                break;
            case 103: // gen3
                fanSpeedtxt = self.translate('FANSPEED_TURBO');
                break;
            case 90: // gen1
                fanSpeedtxt = self.translate('FANSPEED_MAX_SPEED');
                break;
            case 100: // gen2
                fanSpeedtxt = self.translate('FANSPEED_MAX_SPEED');
                break;
            case 104: // gen3
                fanSpeedtxt = self.translate('FANSPEED_MAX_SPEED');
                break;
            default: // could not identify fan speed - new model or has user hacked preset settings?
                fanSpeedtxt = `${self.translate('UNKNOWN')}: ${this.stats.fanspeed}`;
        }

        return `
			<td class="name"><i class="fas fa-sliders"></i>${self.translate('FANSPEED_LABLE')}</td>
			<td class="bin title bright">${fanSpeedtxt}</td>
			<td class="battery">${this.stats.fanspeed}</td>`;
    },




    renderBinStatus() {
        const self = this;

        let statusHtml = '';
        if (self.stats.phase == "full") {
            statusHtml = `
				<td class="bin title bright">
					<i class="fas fa-trash"></i> ${self.translate('FULL')}
				</td>
			`;
        }

        return statusHtml;
    },


    renderBatteryStatus() {
        const self = this;

        let bp = (this.stats.batteryPercent)

        if (self.stats.phase == "charging") {
            return `
	<td class="battery">
	<i class="fas fa-plug"></i> ${bp}%
	</td>`;
        };

        if (bp >= 0 && bp < 12) {
            return `
	<td class="battery">
	<i class="fas fa-battery-empty"></i> ${bp}%
	</td>`;
        };

        if (bp >= 13 && bp < 25) {
            return `
	<td class="battery">
	<i class="fas fa-battery-quarter"></i> ${bp}%
	</td>`;
        };

        if (bp >= 26 && bp < 50) {
            return `
	<td class="battery">
	<i class="fas fa-battery-half"></i> ${bp}%
	</td>`;
        };

        if (bp >= 51 && bp < 75) {
            return `
	<td class="battery">
	<i class="fas fa-battery-three-quarters"></i> ${bp}%
	</td>`;
        };

        if (bp >= 76 && bp <= 100) {
            return `
	<td class="battery">
	<i class="fas fa-battery-full"></i> ${bp}%
	</td>`;
        };

    },

    socketNotificationReceived(notification, payload) {
        const self = this;

        switch (notification) {
            case 'STATS':
                self.loaded = true;
                self.stats = payload;
                break;
            case 'ERROR':
                self.error = payload;
                break;
        }

        this.updateDom(self.config.animationSpeed);
    },

    getScripts() {
        return [];
    },

    getStyles() {
        return [
            'MMM-XiaomiVacuum.css',
            'font-awesome.css',
        ];
    },

    getTranslations() {
        return {
            en: 'translations/en.json'
        };
    },
});
