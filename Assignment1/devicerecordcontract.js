/* eslint-disable quote-props */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const { Contract, Context } = require('fabric-contract-api');
const DeviceRecord = require('./devicerecord.js');
const DeviceRecordList = require('./devicerecordlist.js');


class DeviceRecordContext extends Context {

    constructor() {
        super();
        this.deviceRecordList = new DeviceRecordList(this);
    }

}

/**
 * Define device record smart contract by extending Fabric Contract class
 *
 */
class DeviceRecordContract extends Contract {

    constructor() {
        super('edu.asu.devicerecordcontract');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new DeviceRecordContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async init(ctx) {
        console.log('Instantiated the device record smart contract.');
    }

    async unknownTransaction(ctx){
        throw new Error('Function company missing')
    }

    async afterTransaction(ctx,result){
        console.log('---------------------INSIDE afterTransaction-----------------------')
        let func_and_params = ctx.stub.getFunctionAndParameters()
        console.log('---------------------func_and_params-----------------------')
        console.log(func_and_params)
        console.log(func_and_params['fcn'] === 'createDeviceRecord' && func_and_params['params'][4]==='iot')
        if (func_and_params['fcn'] === 'createDeviceRecord' && func_and_params['params'][4]==='AB-') {
            ctx.stub.setEvent('rare-device-type', JSON.stringify({'serial': func_and_params.params[0]}))
            console.log('Chaincode event is being created!')
        }
    }
    /**
     * Create a device record
     * @param {Context} ctx the transaction context
     * @param {String} serial serial
     * @param {String} company company
     * @param {String} manufacturingDate date of birth
     * @param {String} price  price
     * @param {String} device_type device type
     */
    async createDeviceRecord(ctx,serial,company,manufacturingDate,price,device_type){
        let precord = DeviceRecord.createInstance(serial,company,manufacturingDate,price,device_type);
        await ctx.deviceRecordList.addPRecord(precord);
        return precord.toBuffer();
    }

    async getDeviceByKey(ctx, serial, company){
        let precordKey = DeviceRecord.makeKey([serial,company]);
        //Use a method from deviceRecordList to read a record by key
        let precord = await ctx.deviceRecordList.getPRecord(precordKey);
        return JSON.stringify(precord)
    }


    /**
     * Update last_checkup_date to an existing record
     * @param {Context} ctx the transaction context
     * @param {String} serial serial
     * @param {String} company company
     * @param {String} last_checkup_date date string 
     */
    async updateCheckupDate(ctx,serial,company,last_checkup_date){
        let precordKey = DeviceRecord.makeKey([serial,company]);
        //Use a method from deviceRecordList to read a record by key
        //Use set_last_checkup_date from DeviceRecord to update the last_checkup_date field
        //Use updatePRecord from deviceRecordList to update the record on the ledger
        let precord = await ctx.deviceRecordList.getPRecord(precordKey);
        precord.setLastCheckupDate(last_checkup_date);
        await ctx.deviceRecordList.updatePRecord(precord);
        return precord.toBuffer();
    }



    /**
     * Evaluate a queryString
     * This is the helper function for making queries using a query string
     *
     * @param {Context} ctx the transaction context
     * @param {String} queryString the query string to be evaluated
    */    
   async queryWithQueryString(ctx, queryString) {

    console.log("query String");
    console.log(JSON.stringify(queryString));

    let resultsIterator = await ctx.stub.getQueryResult(queryString);

    let allResults = [];

    while (true) {
        let res = await resultsIterator.next();

        if (res.value && res.value.value.toString()) {
            let jsonRes = {};

            console.log(res.value.value.toString('utf8'));

            jsonRes.Key = res.value.key;

            try {
                jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
                console.log(err);
                jsonRes.Record = res.value.value.toString('utf8');
            }

            allResults.push(jsonRes);
        }
        if (res.done) {
            console.log('end of data');
            await resultsIterator.close();
            console.info(allResults);
            console.log(JSON.stringify(allResults));
            return JSON.stringify(allResults);
        }
    }

}

    /**
     * Query by Price
     *
     * @param {Context} ctx the transaction context
     * @param {String} price price to be queried
    */
   async queryByPrice(ctx, price) {
    let queryString = {
        "selector": {
            "price": price
        },
        "use_index": ["_design/priceIndexDoc", "priceIndex"]
    }
    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;

}

    /**
     * Query by Device_Type
     *
     * @param {Context} ctx the transaction context
     * @param {String} device_type device_type to queried
    */
   async queryByDevice_Type(ctx, device_type) {
    let queryString = {
        "selector": {
            "device_type": device_type
        },
        "use_index": ["_design/device_typeIndexDoc", "device_typeIndex"]
    }

    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;

}

    /**
     * Query by Device_Type Dual Query
     *
     * @param {Context} ctx the transaction context
     * @param {String} device_type device_type to queried
    */
   async queryByDevice_Type_Dual(ctx, device_type1, device_type2) {

    let queryString = {
        "selector": {
            "device_type": {
                "$in": [device_type1, device_type2]
            }
        },
        "use_index": ["_design/device_typeIndexDoc", "device_typeIndex"]
    }

    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;

}

}


module.exports = DeviceRecordContract;
