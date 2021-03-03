
    function Oscillator(options) {
        this.init(options || {});
    }

    Oscillator.prototype = (function () {

        var value = 0;

        return {

            init: function (options) {
                this.phase = options.phase || 0;
                this.offset = options.offset || 0;
                this.frequency = options.frequency || 0.001;
                this.amplitude = options.amplitude || 1;
                this.minor = options.minor || 1;
            },

            update: function () {
                this.phase += this.frequency;
                value = this.offset + ((Math.sin(this.phase) * this.amplitude) * this.minor);
                return value;
            },

            value: function () {
                return value;
            }
        };

    })();
