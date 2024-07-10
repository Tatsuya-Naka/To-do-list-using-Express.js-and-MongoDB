const mongoose = require("mongoose");
const moment = require("moment-timezone");

const timezoneMap = {
    'Japan': 'Asia/Tokyo',
    'China': 'Asia/Shanghai',
    'Singapore': 'Asia/Singapore',
    'United States': 'America/New_York',
    'Canada': 'America/Toronto',
    'England': 'Europe/London',
    'Egypt': 'Africa/Cairo',
};
const defaultTimezone = 'Australia/Sydney';

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        default: function() {
            const timezone = timezoneMap[this.location] || defaultTimezone;
            return moment().tz(timezone).toDate();
        }
    },
});

module.exports = mongoose.model("ToDoSchema", todoSchema);