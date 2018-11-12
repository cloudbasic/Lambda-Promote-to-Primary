/*
Sample AWS Lambda function to call the Promote to Primary CBR API functions

Uses the aws4 node.js library (https://github.com/mhart/aws4) to simplify call signing

For more information on packaging your custom Lambda function see the AWS documentation (http://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html) 

*/
'use strict';

var httpClient = require('./http-client.js'),
    deepcopy = require("deepcopy"),
    CONFIG = require('./config.json');

exports.handler = (event, context, callback) => {

    scenario();

    function scenario() {

        CONFIG.xml = event.xml;
        CONFIG.https = event.https;
        
        var testCase = "Test case: " + (CONFIG.xml ? " XML " : " JSON ") + '/' + (CONFIG.https ? " HTTPS " : " HTTP ") + "version";

        console.log(testCase);

        var credentials = { accessKeyId: CONFIG.accessKeyId, secretAccessKey: CONFIG.secretAccessKey };

        var replicationID='63ef4baa-97ec-4ad2-a519-98d87227885e'; 

//**********************************************************************************************//
        promoteDbReplicaToPrimary(credentials, replicationID, function (replicationStatus) {
            console.log(` `);
            console.log(`Promote DB Replica To Primary ended!`);
            console.log(replicationStatus);

            promoteDbReplicaToPrimaryStatus(credentials, replicationID, function (replicationStatus) {
                console.log(` `);
                console.log(`Promote To Primary Status ended!`);
                console.log(replicationStatus);
            });
        });                    
//****************************************************************//
}

    //Promote to Primary 
    function promoteDbReplicaToPrimary(creds, replicationId, callback) {
        var model = deepcopy(CONFIG.promoteDbReplicaToPrimary);
        model.PromoteDbReplicaToPrimary.ReplicationId = replicationId;

        httpClient.post('PromoteDbReplicaToPrimary', model, function (res) {
            callback(res);
        }, creds);
    }

    //Promote to Primary Status
    function promoteDbReplicaToPrimaryStatus (creds, replicationId, callback) {
        var model = deepcopy(CONFIG.promoteDbReplicaToPrimaryStatus);
        model.PromoteDbReplicaToPrimaryStatus.ReplicationId = replicationId;

        httpClient.post('PromoteDbReplicaToPrimaryStatus', model, function (res) {
            callback(res);
        }, creds);
    }
//****************************************************************//


}