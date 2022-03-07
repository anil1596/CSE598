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

    //  TASK-7: Implement the unknownTransaction to throw an error when
    //  a function is called that does not exist in the contract.
    //  The error message should be: 'Function name missing'.
    //  Read more about unknownTransaction here: https://hyperledger.github.io/fabric-chaincode-node/master/api/fabric-contract-api.Contract.html
    async unknownTransaction(ctx){
        // GRADED FUNCTION
        throw new Error()
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
        //TASK 0
        // Add device record by calling the method in the DRecordList
        throw new Error()
        return precord.toBuffer();
    }

    async getDeviceByKey(ctx, serial, company){
        let precordKey = DeviceRecord.makeKey([serial,company]);
        //TASK-1: Use a method from deviceRecordList to read a record by key
        return JSON.stringify(precord)
    }


    /**
     * Update last_update_date to an existing record
     * @param {Context} ctx the transaction context
     * @param {String} serial serial
     * @param {String} company company
     * @param {String} last_update_date date string 
     */
     async updateLastUpdate(ctx,serial,company,last_update_date){
        let precordKey = DeviceRecord.makeKey([serial,company]);
        //TASK-3: Use a method from deviceRecordList to read a record by key
        //Use set_last_checkup_date from DeviceRecord to update the last_checkup_date field
        //Use updatePRecord from deviceRecordList to update the record on the ledger
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
    //      TASK-4: Complete the query String JSON object to query using the priceIndex (META-INF folder)
    //      Construct the JSON couch DB selector queryString that uses priceIndex
    //      Pass the Query string built to queryWithQueryString
        return queryResults;
    }

    /**
     * Query by Device_Type
     *
     * @param {Context} ctx the transaction context
     * @param {String} device_type device_type to queried
    */
   async queryByDevice_Type(ctx, device_type) {
    //      TASK-5: Write a new index for deviceType and write a CouchDB selector query that uses it
    //      to query by deviceType
    //      Construct the JSON couch DB selector queryString that uses device_typeIndex
    //      Pass the Query string built to queryWithQueryString
        return queryResults;
    }

    /**
     * Query by Device_Type Dual Query
     *
     * @param {Context} ctx the transaction context
     * @param {String} device_type device_type to queried
    */
   async queryByDevice_Type_Dual(ctx, device_type1, device_type2) {
    //      TASK-6: Write a CouchDB selector query that queries using two device types
    //      and uses the index created for deviceType
    //      Construct the JSON couch DB selector queryString that uses two device type indexe
    //      Pass the Query string built to queryWithQueryString
    return queryResults;

}

}


module.exports = DeviceRecordContract;

