/* Magic Mirror
 * Node Helper: MMM-XiaomiVacuum
 *
 * By John Kristensen
 * MIT Licensed.
 */


const NodeHelper = require('node_helper');
const miio = require('miio');

const REQUIRED_FIELDS = ['token', 'ipAddress'];

module.exports = NodeHelper.create({

    // Start
    start: function() {
        const self = this;

        self.started = false;
        self.config = [];
        self.stats = {};
    },

    // socket Notification Received
    socketNotificationReceived: function(notification, payload) {
        const self = this;

        switch (notification) {
            case 'START':
                self.handleStartNotification(payload);
        }
    },

    // handle Start Notification
    handleStartNotification: function(payload) {
        const self = this;

        if (self.started) {
            return;
        }

        self.config = payload;

        if (self.isInvalidConfig()) {
            return;
        }

        self.scheduleUpdates();

        self.started = true;
    },

    /*
    Connected to MiioDevice {
      model=roborock.vacuum.s5,
      types=miio:vacuum, miio, vaccuum,
      capabilities=adjustable-fan-speed, fan-speed, spot-cleaning, autonomous-cleaning,
      cleaning-state, error-state, charging-state, battery-level, state
    }
    */

    // *** Update Stats ***
    updateStats: function() {
        const self = this;


        // Connect to the vacuum cleaner and get various status
        var device = miio.device({
                address: self.config.ipAddress,
                token: self.config.token,
            })
            .then(device => {

                /*
                console.log('Connected to', device.model());
                console.log('Model         : ' + device.miioModel);
                console.log('State         : ' + device.property('state'));
                console.log('Battery Level : ' + device.property('batteryLevel'));
                console.log('Fan Speed     : ' + device.property('fanSpeed'));
                console.log('mainBrush Work Time : ' + device.property('mainBrushWorkTime'));
                console.log('sideBrush Work Time : ' + device.property('sideBrushWorkTime'));
                console.log('filter Work Time : ' + device.property('filterWorkTime'));
                console.log('sensor Dirty Time : ' + device.property('sensorDirtyTime'));
                */
                Object.assign(self.stats, {
                    name: device.miioModel.toUpperCase(),
                    batteryPercent: device.property('batteryLevel'),
                    phase: device.property('state'),
                    fanspeed: device.property('fanSpeed'),
                    filterworktime: device.property('filterWorkTime'),
                    sidebrush: device.property('sideBrushWorkTime'),
                    mainBrush: device.property('mainBrushWorkTime'),
                    sensordirtytime: device.property('sensorDirtyTime')
                });

                device.destroy();

                self.sendSocketNotification('STATS', self.stats);
            })
            .catch(err => console.log('Connection failure'));

        return

    },


    // Validate config, and report back if fields are missing
    isInvalidConfig: function() {
        const self = this;

        let missingField = REQUIRED_FIELDS.find((field) => {
            return !self.config[field];
        });

        if (missingField) {
            self.sendSocketNotification(
                'ERROR',
                `<i>Confg.${missingField}</i> is required for module: ${self.name}.`
            );
        }
        return !!missingField;
    },

    // schedule Updates
    scheduleUpdates() {
        const self = this;

        self.updateStats();
        setInterval(function() {
            self.updateStats();
        }, self.config.updateInterval);
    },


});
