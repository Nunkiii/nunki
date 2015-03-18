var DLG = require("../../sadira/www/js/dialog");
var SRZ=require('../../sadira/www/js/serializer.js');
//var fits=require("../node-fits/build/Release/fits");



var sbig_cli_master;
exports.init=function(pkg, app){
    app.log("SBIG client module slave: init...");
    sbig_cli_master=new sbig_cli(pkg,app);
    app.dialog("nunki.sbig", nunki_sbig);    
}

var sbig_cam_master;
exports.init_master=function(pkg, app){
    app.log("SBIG module master: init");
    sbig_cam_master = new sbig_cam(pkg, app);
}


var sbig_cli=function(pkg,app){
    var scli=this;

    var redis_host="192.167.166.207";
    var redis_host_port=6379;
    
    
    var redis = require("../../sadira/node_modules/redis");
    var redis_cnx =scli.redis_cnx=redis.createClient(redis_host_port, redis_host ,{detect_buffers: true});
    var redis_pubcnx = scli.redis_pubcnx=redis.createClient(redis_host_port, redis_host, {detect_buffers: true});
    
    DLG.new_event(this, "message");
    
    redis_cnx.on("subscribe", function (channel, count) {
	app.log("SBIG redis client: subscribed to channel ["+channel+"]");
	//client2.publish("a nice channel", "I am sending a message.");
    });


    redis_cnx.on("message", function (channel, json_message) {
	var message=JSON.parse(json_message);
	console.log("SBIG client : received redis message on channel " + channel + " M: " + json_message);
	
	switch(channel){
	    
	case "nunki:sbig:messages":
	    console.log("Trig msg!");
	    scli.trigger("message", message);
	    switch(message.id){
	    case "init": break;
	    };
	    break;
	default:
	    break;
	};
    });

    
    redis_cnx.subscribe("nunki:sbig:messages");
    redis_cnx.subscribe("nunki:sbig:status");
    redis_cnx.subscribe("nunki:sbig:images");

}



var sbig_cam = function(){

    var sbg=this;
    var sbig=require("../../node-sbig/build/Release/sbig");
    
    sbg.cam = new sbig.cam();
    for(var e in sbg.cam){
	console.log("cam prop : " + e);
    }

    var redis_host="192.167.166.207";
    var redis_host_port=6379;

    var redis = require("../../sadira/node_modules/redis");
    var cnx=sbg.redis_cnx = redis.createClient(redis_host_port, redis_host,{detect_buffers: true});
    var pubcnx=sbg.redis_pubcnx = redis.createClient(redis_host_port, redis_host,{detect_buffers: true});

    function publish_status(m){
	pubcnx.set("nunki:sbig:init_status", JSON.stringify(m));
    }
    function pub_message(m){
	console.log("publish " +  JSON.stringify(m) );
	sbg.redis_pubcnx.publish("nunki:sbig:messages", JSON.stringify(m) );
    }


    sbg.online=false;
    cnx.flushdb();    

    publish_status({type: "warning", content:"Driver not started yet.", id : "init", online: false});
    

    sbg.redis_cnx.on("subscribe", function (channel, count) {
	console.log("sbig: redis subscribed to channel ["+channel+"]");
	//client2.publish("a nice channel", "I am sending a message.");
    });

    
    cnx.on("message", function (channel, json_message) {
	var message=JSON.parse(json_message);
	console.log("SBIG master: received redis message on channel " + channel + " M: " + json_message);
	
	switch(channel){
	    
	case "nunki:sbig:requests":
	    if( ù (message.request_type) ){
		console.log("No message type !");
		return;
	    }
	    
	    switch (message.request_type){
	    case "shutdown":
		if(!sbg.online){
		    pub_message({type : "warning", content : "Driver already unloaded!", id : "init", online : false});
		    break;
		}
		sbg.cam.shutdown(function (m){
		    //console.log("Cam message : " + JSON.stringify(m));
		    if(m.type==="success" || m.type==="error"){
			sbg.online=m.online=m.type==="success" ? false : true;
			publish_status(m);
		    }
		    pub_message(m);
		});
		
		break;
	    case "init":
		if(sbg.online){
		    pub_message({type : "warning", content : "Driver already loaded!", id : "init", online : true});
		    break;
		}
		sbg.cam.initialize(function (m){
		    //console.log("Cam message : " + JSON.stringify(m));
		    if(m.type==="success" || m.type==="error"){
			sbg.online=m.online=m.type==="success" ? true : false;
			publish_status(m);
		    }
		    pub_message(m);
		});

		break;
	    default :
		console.log("Unknown message type " + message.request_type + " ! ");
		break;
	    };
	    
	    break;
	default:
	    break;
	};
	
	//this.trigger("chat_event", message);
	//client1.unsubscribe();
	//client1.end();
	
    });

    
    
    cnx.subscribe("nunki:sbig:requests");
    
};



function nunki_sbig (dlg, status_cb){

    var uid;
    var nick;
    var user_ip;
    
    dlg.cnx.listen("closed", function(cr){
	console.log("SBIG client : socket connexion closed : " + cr);
    });
    

    sbig_cli_master.redis_pubcnx.get("nunki:sbig:init_status", function (error, json_stat){

	if(error)
	    dlg.send_datagram({ type : "message", data : {type: "error", content : error, id : "init"}});
	else{
	    if(json_stat){
		var stat=JSON.parse(json_stat);
		dlg.send_datagram({ type : "message", data : stat});
	    }
	    else
		dlg.send_datagram({ type : "message", data : {type: "error", content : "RDIS sbig status key not found !", id : "init"}});
	}
	//
    });
    
    sbig_cli_master.listen("message", function(m){
	dlg.send_datagram({ type : "message", data : m});
	
    });
	
	/*
	uid=Math.random().toString(36).substring(2);
	*/
	    
    
    dlg.listen("sbig_request", function(dgram){
	var request=dgram.header;
	var json_request=JSON.stringify(request);
	console.log("Sbig : forwarding received client message ["+json_request+"]");
	sbig_cli_master.redis_pubcnx.publish("nunki:sbig:requests",json_request);
    });

    dlg.listen("disconnect", function (dgram){
	console.log("dialog disconnect");
	if(è(sbig_uid)){
	    redis_cnx.unlisten("sbig_event", sbig_msg_handler);
	    redis_pubcnx.publish("sbig", JSON.stringify({ what : "user_disconnect", uid : sbig_uid }) );

	    redis_pubcnx.lrem("sbigusers",1,sbig_uid);
	    redis_pubcnx.del("sbiguser:"+sbig_uid);
	}

    });
    
    
    status_cb();

    
}






