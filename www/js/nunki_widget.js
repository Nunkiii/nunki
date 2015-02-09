//window.addEventListener("load", function(){

//alert("Abraacadabra!");


template_ui_builders.nunki=function(ui_opts, nunki){


    console.log("NUNKI Build....");
    var glwidget = nunki.elements.glwidget;
    var glm = glwidget.elements.glm;
    var screen = glwidget.elements.screen;

    var drawing_node=cc("div", screen.ui_root);
    drawing_node.add_class("drawing_node");
    glm.set_drawing_node(drawing_node);

  //var browser = nunki.elements.db.elements.browser;
  //browser.glm=glm;
    
}


template_ui_builders.sbig_control=function(ui_opts, sbig){

    var expo=sbig.elements.exposure.elements;
    var cooling=sbig.elements.cooling.elements;
    var actions=sbig.elements.actions.elements;
    var exptime=expo.exptime;
    var nexpo=expo.nexpo;
    var messages=sbig.elements.messages;
    
    var start_camera=actions.start_camera;
    var start_exposure=actions.start_exposure;
    
    var expo_progress=start_exposure.elements.expo_progress;
    var grab_progress=start_exposure.elements.grab_progress;
    var enable_cooling=cooling.enable;
    var cooling_setpoint=cooling.setpoint;
    var temp=cooling.temp;
    var ambient_temp=cooling.ambient_temp;
    var pow=cooling.pow;

    var temp_max_points=300;
    var temp_data=[];

    var sadira=sbig.elements.server;

    var url=sadira.elements.url;
    url.set_value("ws://localhost");
    
    start_camera.listen("click", function(){
	
			

	var d= sadira.dialogs.create_dialog({ handler : "sbig.drive"});
	
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
	

	d.connect(function(error, init_dgram){
	    if(error)
		messages.append("Init data error= " + error + " init datagram = <pre> " + JSON.stringify(init_dgram,null,4));
	    else{
		
		messages.append("Dialog handshake OK");
		
		start_camera.listen("click",function(){
		    
		    d.send_datagram({type : "start_camera"},null,function(error){
			
			if(error){
			    messages.append("ERROR: "+error);
			}
		    });
		});
		
	    }
	    
	    
	}); 

    });
    
}

