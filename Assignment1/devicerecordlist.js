'use strict';

const StateList = require('./ledger-api/statelist.js');

const DeviceRecord = require('./devicerecord.js');

class DeviceRecordList extends StateList {
    constructor(ctx) {
        super(ctx,'edu.asu.DeviceRecordList');
        this.use(DeviceRecord);
    }

    async addPRecord(precord) {
        return this.addState(precord);
    }

    async getPRecord(precordKey) {
        return this.getState(precordKey);
    }

    async updatePRecord(precord) {
        return this.updateState(precord);
    }

}

module.exports = DeviceRecordList;
