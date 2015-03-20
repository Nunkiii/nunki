//window.addEventListener("load", function(){

//alert("Abraacadabra!");

var BSON=bson().BSON;

template_ui_builders.nunki=function(ui_opts, nunki){

    console.log("NUNKI Build....");

    var sbig=nunki.elements.sbig;


  //var browser = nunki.elements.db.elements.browser;
  //browser.glm=glm;
    
}

template_ui_builders.message_handler=function(ui_opts, mhd){
    
    var btn=mhd.elements.btn;
    var status=mhd.elements.status;
    
    mhd.set_btn=function(title, icon){
	if(typeof title ==="boolean"){
	    btn.disable(!title); return mhd;
	}
	
	if(è(icon))btn.ui_opts.fa_icon=icon;
	if(è(title))btn.set_title(title); else btn.set_title("");
	return mhd;
    }

    mhd.set_status=function(m){
	status.set_alert(m); return mhd;
    }

    mhd.start=function(dialog, dgm, pre_handler){
	mhd.dgm=dgm;
	//console.log("MHD START btn = " + btn.name);
	btn.disable(false);
	btn.listen("click",function(){
	    
	  
	    btn.disable();
	    if(è(pre_handler))pre_handler();
	  //  console.log("MHD CLICK " +JSON.stringify(mhd.dgm));

	    status.set_alert({ type :"info", content : "Sending datagram..."+JSON.stringify(mhd.dgm) + " dialog " + dialog});
	    dialog.send_datagram(mhd.dgm,null,function(error){
		if(error){
		    status.set_alert({ type:"error", content : error});
		    btn.disable(false);
		}else
		    status.set_alert({ type :"info", content : "datagaram sent..."});
	    });
	});
    };
}

template_ui_builders.expo_setup=function(ui_opts, expo_setup){

//    var mhd=expo_setup.mhd=create_widget({type: "template", template_name : "message_handler", ui_opts : {render_name : false}});
//    expo_setup.ui_root.appendChild(mhd.ui_root);
//    mhd.disable(ui_opts.type!=="edit");

    return;
}



template_ui_builders.sbig_control=function(ui_opts, sbig){
    
    var glwidget=sbig.elements.glwidget;
    var glm = glwidget.elements.glm;
    var screen = glwidget.elements.screen;

//    var actions=sbig.elements.actions.elements;
    
    var control_panel=sbig.elements.control_panel.elements;
    
    var drawing_node=cc("div", screen.ui_root);
    drawing_node.add_class("drawing_node");
    glm.set_drawing_node(drawing_node);

    var main=control_panel.main.elements;
    var cooling=control_panel.cooling.elements;    
    var expo_base=control_panel.exposure.elements;
    
    
    var expo_params=expo_base.setup.elements.params;
    var expo=expo_base.exposure.elements;
    var expo_mhd=expo_base.setup.elements.mhd;

    var doexpo_mhd=expo_base.exposure.elements.mhd;
    
    //var exptime=expo_setup.exptime;
    //var nexpo=expo_setup.nexpo;
    //var binning=expo_setup.binning;


    var cam_mhd=main.cam_switch;

    var expo_status=expo.expo_status;
    var start_exposure=expo.start_exposure;

    var last_image=expo_base.last_image;
    var expo_progress=expo_base.exposure.elements.expo_progress;
    var grab_progress=expo_base.exposure.elements.grab_progress;
    var data_progress=expo_base.exposure.elements.data_progress;    
    
    //var start_camera=cam_sw.start_camera;
    //var cam_status=cam_sw.status;
    var server=main.server;
    var messages=server.elements.messages;

    var enable_cooling=cooling.enable;
    var cooling_setpoint=cooling.setpoint;
    var temp=cooling.temp;
    var ambient_temp=cooling.ambient_temp;
    var pow=cooling.pow;

    var temp_max_points=300;
    var temp_data=[];

    var sadira=server; 
    
    //server.elements.url.set_value("ws://localhost");

    var cam_online=false;
    var cam_expo=false;
    
    cam_mhd.set_btn(cam_online?"Stop camera":"Start camera",cam_online?"stop":"play").set_btn(false);
    doexpo_mhd.set_btn(cam_expo?"Stop exposure":"Start exposure",cam_online?"stop":"play").set_btn(false);
    expo_mhd.set_btn("Send expo parameters","play").set_btn(false);
    
    expo_mhd.set_status({type : "info", content : "ready"});

    var expo_size={};
    var gl_layer;
    
    server.connect(function(error){

	if(error){
	    return cam_mhd.set_status({type : "error", content : error});
	}
	
	server.listen("socket_connect", function(){
	    
	    var d= sadira.dialogs.create_dialog({ handler : "nunki.sbig"});
	    
	    d.listen("message", function(dgram){
	    //console.log("Got message msg!" + JSON.stringify(dgram.header));
		var m=dgram.header.data;
		switch(m.id){
		    
		case "init" :
		    if(è(m.online)) cam_online=m.online;
		    
		    
		    switch(m.type){
		    case "success":
		    case "error":
		    case "warning":
			//for (var e in cam_mhd) console.log("cam " + e);
			cam_mhd.set_btn(cam_online?"Stop camera":"Start camera",cam_online?"stop":"play").set_btn(true);
			
			// if(cam_online){
			// 	start_camera.ui_opts.fa_icon="stop";
			// 	start_camera.set_title("Stop camera");
			// }else{
			// 	start_camera.ui_opts.fa_icon="play";
			// 	start_camera.set_title("Start camera");
			// }
			// start_camera.disable(false);
			break;
		    case "info":
			cam_mhd.set_btn(false);
			//start_camera.disable(true);
			break;
		    default: break;
		    };
		    cam_mhd.set_status(m);
		    break;
		    
		case "expo_params" :
		    switch(m.type){
		    case "success":
			expo_mhd.set_btn(true);
			break;
		    case "error":
			expo_mhd.set_btn(true);
			break;
		    case "info":
			break;
		    default: break;
		    };
		    expo_mhd.set_status(m);
		    
		    break;

		case "expo_proc" :
		    switch(m.type){
		    case "success":
			doexpo_mhd.set_status(m);
			doexpo_mhd.set_btn(true);
			break;
		    case "error":
			doexpo_mhd.set_status(m);
			doexpo_mhd.set_btn(true);
			break;
		    case "info":
			doexpo_mhd.set_status(m);
			break;
		    case "expo_size":
			expo_size=JSON.parse(m.content);
			break;
		    case "grab_progress":
			grab_progress.set_value(m.content);
			break;
		    case "expo_progress":
			expo_progress.set_value(m.content);
			break;
		    default:
			doexpo_mhd.set_status(m);
			break;
		    };
		    
		    
		    break;
		    
		default :
		    cam_mhd.set_status(m);
		    //cam_status.set_alert(m); break;
		}
		
	    });
	    
	    d.connect(function(error, init_dgram){
		if(error)
		    return cam_mhd.set_status({type : "error", content : "Init data error= " + error + " init datagram = <pre> " + JSON.stringify(init_dgram,null,4)});
		
		cam_mhd.set_status({type : "info", content : "Dialog handshake OK"});
		    
		//expo_base.setup.listen("rebuild", function(type){
		//	if(type!=="edit") return;
		
		
		//
		
		//});
		
		function get_dgm(){return {type : "sbig_request", request_type : cam_online? "shutdown" : "init"};}
		function get_expo_dgm(){return {type : "sbig_request", request_type : cam_expo? "stop_expo" : "start_expo"};}		    
		
		cam_mhd.start(d,get_dgm(),function(){
		    cam_mhd.dgm=get_dgm();
		});
		
		expo_mhd.start(d, null, function(){
		    //console.log("Expo data is : " + JSON.stringify(expo_data));
		    expo_mhd.dgm= {type : "sbig_request", request_type : "set_expo_params", data : build_data_structure(expo_params)};
		});
		
		doexpo_mhd.start(d, null, function(){
		    doexpo_mhd.dgm=get_expo_dgm();
		    //console.log("Expo data is : " + JSON.stringify(expo_data));
		});
		
		d.srz_request=function(dgram, result_cb){
		    
		    //console.log("SRZ Request !");
		    
		    var sz=dgram.header.sz;
		    //var w=dgram.header.width;
		    //var h=dgram.header.height;
		    
		    //console.log("Ready to receive "+sz +" bytes. Image ["+dgram.header.name+"] size will be : " + w + ", " + h + "<br/>");
		    data_progress.set_title("Downloading "+dgram.header.name+" : "+ format_byte_number(sz));
		    
		    var b=new ArrayBuffer(sz);
		    //var fvp = new Float32Array(b);
			//console.log("AB: N= "+ fv.length +" =? "+sz/4+" first elms : " + fv[0] + ", " + fv[1] );
		    var sr=new srz_mem(b);
		    
		    
		    sr.on_chunk=function(dgram){
			data_progress.set_value(Math.ceil(100*( ((dgram.header.cnkid+1)*sr.chunk_size)/sr.sz_data)));
			//console.log("Fetching data : "+(Math.floor(100*( (dgram.header.cnkid*sr.chunk_size)/sr.sz_data)))+" %");
		    }
		    sr.on_done=function(){
			data_progress.set_value(100.0);
			
			//console.log("GoT image data !!! " + b.length + " bl " + b.byteLength);
			//var bb = new Uint8Array(b);
			//var img_cnt=BSON.deserialize(bb);
			
			//console.log("GOT IMAGE ! " + img_cnt.w + ", " + img_cnt.h + " :" + img_cnt.data.length() + " bl "+img_cnt.data.byteLength);
			//console.log("Btype " + img_cnt.data.constructor.name);
			
			//var fv=new Float32Array(img_cnt.data);
			//var img=create_widget("image");
			//xd.elements.objects.elements.tree.ui_childs.add_child(img, img_ui);
			last_image.setup_dgram_image(
			    {name : dgram.header.name, sz : dgram.header.sz, width: expo_size.w, height: expo_size.h},
			    b
			);
			
			if(ù(gl_layer)) gl_layer=glm.create_layer(last_image);
			else{

			    gl_layer.setup_image(last_image);
			}
			
			
			/*
			var l;
			l=xd1_display.create_layer(img);
			if(dgram.header.colormap)
			    l.cmap.set_value(dgram.header.colormap);
			*/
			
			
		    };

		    result_cb(null, sr);
		    //console.log("srz request completed");
		}
		
	    }); 
	    
	});
	
    });
    
    return;
    
    start_camera.listen("click", function(){
	
	d.listen("expo_progress", function(dgram){
	    //console.log("EXPO Head" + JSON.stringify(dgram.header));
	    expo_progress.set_value(dgram.header.value*1.0);
	});

	d.listen("grab_progress", function(dgram){
	    //console.log("GRAB Head" + JSON.stringify(dgram.header));
	    grab_progress.set_value(dgram.header.value*1.0);
	});


	var iv;
	d.listen("cooling_info", function(dgram){
	    var temp_info = dgram.header.cooling_info;
	    temp_data.push(temp_info);
	    if(temp_data.length>temp_max_points)
		temp_data.splice(0,1);
	    temp.set_value(temp_info.ccd_temp);
	    ambient_temp.set_value(temp_info.ambient_temp);
	    pow.set_value(temp_info.cooling_power);
	    //messages.append(JSON.stringify(temp_info,null,3));
	    //console.log("Cooling info " + JSON.stringify(temp_info));
	    //draw_ccd_temperature();
	});
	
	
	d.listen("cam_status", function(dgram){
	    var m=dgram.header.status;
	    
	    messages.append(JSON.stringify(m,null,5));
	    
	    if(m.ready) {
		
		start_exposure.listen("click",function(){
		    d.send_datagram({ type : "start_expo", exptime : exptime.value, nexpo : nexpo.value },null,function(error){} );
		});
		
		iv=setInterval(function(){

		    d.send_datagram({ type : "get_cooling_info"},null,function(error){} );
		    
		    //console.log("NS= "+ ns +" Cam temperature = " + JSON.stringify(cam.get_temp()));
		    //clearInterval(iv);
		    
		    
		}, 1000);
		
		enable_cooling.listen("change", function(enabled){
		    var setpoint=temp_setpoint.value; 
		    console.log("Setting temp ["+enabled+"] setpoint " + setpoint);
		    d.send_datagram({ type : "set_cooling", enabled : enabled*1.0, setpoint: setpoint},null,function(error){} );

		});
		

	    }
	    if(m.info) {
		
	    }
	    if(m.error){
	    }
	    
	});
	
	d.lay_id=this.id;

	d.srz_request=function(dgram,  calb){
	    console.log("SRZ req called...");

	    var w=lay.width = dgram.header.width;
	    var h=lay.height =dgram.header.height;
	    
	    var sz=dgram.header.sz;
	    
	    console.log("Ready to receive "+sz +" bytes. Image ["+dgram.header.name+"] size will be : " + w + ", " + h);
	    camera_status.innerHTML+="Ready to receive "+sz +" bytes. Image ["+dgram.header.name+"] size will be : " + w + ", " + h + "<br/>";
	    
	    setup_bbig(w,h);
	    
	    // if(bbig==null){
	    
	    // 	sz=dgram.header.sz;
	    // 	w=
	    // 	h=
	    
	    // 	bbig=new ArrayBuffer(4*sz);
	    // 	fv = new Float32Array(bbig);
	    // 	for(var i=0;i<fv.length/4;i++){
	    // 	    fv[4*i]=0.0;
	    // 	    fv[4*i+1]=0.0;
	    // 	    fv[4*i+2]=0.0;
	    // 	    fv[4*i+3]=1.0;
	    // 	}
	    // }
	    
	    status.innerHTML+=dgram.header.name;

	    console.log("X");
	    var b=new ArrayBuffer(sz);
	    console.log("X");
	    var fvp = new Float32Array(b);
	    //console.log("AB: = "+ fv.length +" =? "+sz/4+" first elms : " + fv[0] + ", " + fv[1] );
	    var sr=new srz_mem(b);

	    lay.arr=fvp;
	    sr.lay_id=d.lay_id;
	    
	    console.log("X");

	    sr.on_chunk=function(dgram){
		//console.log("Fetching data chunk...");

		p_fetch.value=(Math.floor(100*( (dgram.header.cnkid*sr.chunk_size)/sr.sz_data)));

		//status.innerHTML="Fetching data for " + dgram.header.name +
	    	//" : "+(Math.floor(100*( (dgram.header.cnkid*sr.chunk_size)/sr.sz_data)))+" %";
	    }

	    console.log("XXX w,h = " + w + ", " + h);
	    
	    sr.on_done=function(){

		console.log("Fetch image done !");
		p_fetch.value=100.0;
		var lid=lay.id;
		var fv=xd.fv;
		var min=1e20,max=-1e20;
		
		var rangeLocation = gl.getUniformLocation(xd.program, "u_layer_range");
		
		xd.p_layer_range[2*lid]=lay.width/xd.w;
		xd.p_layer_range[2*lid+1]=lay.height/xd.h;
		
		gl.uniform2fv(rangeLocation, xd.p_layer_range);
		var fv=xd.fv;
		console.log("Filling texture ("+xd.w+","+xd.h+") with image ("+w +","+h+")"  );

		for(var i=0;i<h;i++){
		    for(var j=0;j<w;j++){
			var v=fvp[i*w+j]*1.0;
			fv[4*(i*xd.w+j)+lid]=1.0*v;
			if(v>max)max=v; else if(v<min)min=v;
		    }
		}

		console.log("Setting up layer data...");
		lay.ext=[min,max];
		setup_layer_data();
		
	    };

	    console.log("XXX");

	    console.log("calling cb");
	    calb(null, sr);
	    console.log("calling cb done");
	};
	


    });
    
}


