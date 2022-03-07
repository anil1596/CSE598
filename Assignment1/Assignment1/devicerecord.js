'use strict';

const State = require('./ledger-api/state.js');

class DeviceRecord extends State {

    constructor(obj) {
        super(DeviceRecord.getClass(),[obj.serial, obj.company]);
        Object.assign(this,obj);
    }

    //Helper Functions for reading and writing attributes
    getSerial() { return this.serial }
    setSerial(newSerial) { return this.serial=newSerial }
    getCompany() { return this.company }
    setCompany(newCompany) { return this.company=newCompany }
    getmanufacturingDate() { return this.manufacturingDate }
    setmanufacturingDate(newmanufacturingDate) { return this.manufacturingDate=newmanufacturingDate }
    getprice() { return this.price }
    setprice(newprice) { return this.price=newprice }
    getdevicetype() { return this.price }
    setdevicetype(newdevicetype) { return this.device_type=newdevicetype }

    //TASK 2 - Write a getter and a setter for a field called last_checkup_date
    
    //Helper functions

    static fromBuffer(buffer) {
        return DeviceRecord.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, DeviceRecord);
    }

    static createInstance(serial, company, manufacturingDate, price, device_type) {
        return new DeviceRecord({serial, company, manufacturingDate, price, device_type});
    }

    static getClass() {
        return 'edu.asu.DeviceRecord';
    }


}

module.exports = DeviceRecord;
