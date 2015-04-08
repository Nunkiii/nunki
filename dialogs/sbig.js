var DLG = require("../../sadira/www/js/dialog");
var SRZ=require('../../sadira/www/js/serializer.js');
var bson=require('../../sadira/www/js/community/bson');;
//var fits=require("../node-fits/build/Release/fits");

var BSON=bson().BSON;

var sbig_cli_master;
exports.init=function(pkg, app,cb){
    if(pkg.opts.client){
	app.log("SBIG client module slave: init...");
	sbig_cli_master=new sbig_cli(pkg,app);
	app.dialog("nunki.sbig", nunki_sbig);
    }
    cb();
}

var sbig_cam_master;
exports.init_master=function(pkg, app, cb){
    if(pkg.opts.master){
	app.log("SBIG module master: init");
	sbig_cam_master = new sbig_cam(pkg, app);
    }
    cb();

}


var sbig_cli=function(pkg,app){
    var scli=this;

    var redis_host=pkg.opts.redis.host;
    var redis_host_port=pkg.opts.redis.port;
    
    
    var redis = require("../../sadira/node_modules/redis");
    var redis_cnx =scli.redis_cnx=redis.createClient(redis_host_port, redis_host ,{detect_buffers: true});
    var redis_pubcnx = scli.redis_pubcnx=redis.createClient(redis_host_port, redis_host, {detect_buffers: true});
    
    new_event(this, "message");
    new_event(this, "image");
    
    redis_cnx.on("subscribe", function (channel, count) {
	app.log("SBIG redis client: subscribed to channel ["+channel+"]");
	//client2.publish("a nice channel", "I am sending a message.");
    });


    redis_cnx.on("message", function (channel, m) {
	
	//console.log("SBIG client : received redis message on channel " + channel + " M: " + json_message);
	
	switch(channel){
	    
	case "nunki:sbig:messages":
	    //console.log("Trig msg!");
	    var message=JSON.parse(m);
	    scli.trigger("message", message);
	    switch(message.id){
	    case "init": break;
	    };
	    break;
	case "nunki:sbig:images":
	    //console.log("Received a " + typeof m + " sz   " + m.byteLength + " l = " + m.length);
	    scli.trigger("image", m);
	    //for(var p in m) console.log("P "+p);
	    break;
	default:
	    break;
	};
    });

    
    redis_cnx.subscribe("nunki:sbig:messages");
    redis_cnx.subscribe("nunki:sbig:status");
    redis_cnx.subscribe("nunki:sbig:images");

}



var sbig_cam = function(pkg, app){

    var sbg=this;
    var sbig=require("../../node-sbig/build/Release/sbig");
    
    sbg.cam = new sbig.cam();
/*
    for(var e in sbg.cam){
	console.log("cam prop : " + e);
    }
*/
    var redis_host=pkg.opts.redis.host;
    var redis_host_port=pkg.opts.redis.port;

    var redis = require("../../sadira/node_modules/redis");
    var cnx=sbg.redis_cnx = redis.createClient(redis_host_port, redis_host,{detect_buffers: true});
    var pubcnx=sbg.redis_pubcnx = redis.createClient(redis_host_port, redis_host,{detect_buffers: true});

    function publish_status(m){
	pubcnx.set("nunki:sbig:init_status", JSON.stringify(m));
    }
    function pub_message(m){
	//console.log("publish " +  JSON.stringify(m) );
	sbg.redis_pubcnx.publish("nunki:sbig:messages", JSON.stringify(m) );
    }

    function pub_image(m){
	//console.log("publish image" );
	sbg.redis_pubcnx.publish("nunki:sbig:images", m);
    }


    sbg.online=false;
    cnx.flushdb();    

    publish_status({type: "warning", content:"Driver not started yet.", id : "init", online: false});
    

    sbg.redis_cnx.on("subscribe", function (channel, count) {
	app.log("sbig: redis subscribed to channel ["+channel+"]");
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
	    case "set_expo_params":
		var d=message.data;
		if(è(message.data))
		    if(è(message.data.els)){
			if(è(message.data.els.exptime))
			    if(è(message.data.els.exptime.value)){
				sbg.cam.exptime=message.data.els.exptime.value;
			    }
			if(è(message.data.els.nexpo))
			    if(è(message.data.els.nexpo.value)){
				sbg.cam.nexpo=message.data.els.nexpo.value;
			    }
			pub_message({type : "success", content : "Expo parameters loaded. NE="  + sbg.cam.nexpo + " expt = " + sbg.cam.exptime, id : "expo_params"});
			break;
		    }
		
		pub_message({type : "error", content : "Data not found as excepted.", id : "expo_params"});
		
		
		break;
	    case "start_expo":

		function send_info(m){pub_message({type : "info", content : m, id : "expo_proc"});}
		function send_error(m){pub_message({type : "error", content : m, id : "expo_proc"});}
		function send_success(m){pub_message({type : "success", content : m, id : "expo_proc"});}
		
		
		
		//send_info("Start exposure...");

		console.log("START EXPO !!!!!!!");
		sbg.cam.start_exposure(function (expo_message){
		    
		    //return;
		    
		    switch(expo_message.type){

		    case "new_image":

			var image=expo_message.content;
			
			//var image=sbg.cam.last_image_float;
			
			send_success("New image ! w= " + image.width() + " h= " + image.height());
			pub_message({
			    type : "expo_size",
			    content : JSON.stringify({ w:  image.width(), h: image.height()}),
			    id : "expo_proc"
			});
			
			//image.extend({w : 1024, h : 1024});
			
			//console.log("extend OK");
			
			//sbig.last_image=img;
			//fifi.write_image_hdu(img);
			//if( m instanceof sbig.mat_ushort){
			
			//image.swapx();
			//image.swapy();
		
			pub_image(image.get_data());
			//console.log("Got data  + " + (typeof data) + " length " + data.length + " bl " + data.byteLength);
			break;

		    default:
			console.log("expo message : " + JSON.stringify(expo_message));
			pub_message(expo_message);
			break;
		    }
		    
		});
		
		break;
	    case "stop_expo":
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


    sbig_cli_master.listen("image", function(m){

	
	//console.log("We have the data buffer serializing... SRZ is  " + typeof SRZ);
	//console.log("We have the data buffer serializing... SRZ is  " + typeof SRZ.srz_mem);
	
	var srep=new SRZ.srz_mem(m);
	
	//console.log("Filling header .. DATA length is " + m.length);
	
	srep.header={sz : m.length, name : "SBIG raw float image"};
	//srep.header={width : 512, height: 512 };
			
	//console.log("SRZ configured size= " + srep.size());
	
	srep.on_done=function(){
	    //console.log("Image data sent!");
	    //dlg.close();
	};
	
	//send_info("serializing...");
	//console.log("serializing...");
	
	dlg.srz_initiate(srep, function(error){
	    if(error)
		console.log("SRZ error : " + error);
	});
	//console.log("serializing call done...");
	
	
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
	//console.log("dialog disconnect");
    });
    
    
    status_cb();

    
}






