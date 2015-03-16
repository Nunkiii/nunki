

var nunki_templates = {
        
    mount_control : {
	type : "mount_control",
	name : "Mount control",
	ui_opts : {
	    child_view_type : "div",
	    child_classes : ["panel panel-default"],
	    root_classes : ["container-fluid"],
	    name_node : "h2"
	},

	elements : {
	    config : {
		elements : {
		    server : {
			name : "Mount server",
			type : "template",
			template_name : "sadira"
		    },
		}
	    },
	    status : {
		name : "Mount status",
		elements : {
		    position : {
			name : "Current position",
			type : "sky_coords"
			
		    }
		}
	    },
	    actions : {
		name : "Actions",
		
		elements : {
		
		    goto_radec : {
			name : "Goto Ra-Dec",
			elements : {
			    coords : {
				name : "Coordinates",
				type : "sky_coords",
				value : [0,0]
			    },
			    go : {
				name : "Goto",
				type : "action"
			    }
			}
		    },
		    slew : {
			name : "Slew telescope",
			elements : {
			    speed : {
				name : "Slewing speed",
				type : "double",
				value : 0
			    },
			    arrow_pad : {
				name : "Direction",
				type : "arrow_pad"
			    },
			    slew : {
				name : "Slew",
				type : "action"
			    }
			    
			    
			}
		    }
		}
	    }
	}
    },

    sbig_control : {
	name : "SBIG camera interface", 
	type : "sbig_control",
	ui_opts : {
	    child_view_type : "div",
	    child_classes : ["row"],
	    root_classes : ["container-fluid"],
	    name_node : "h2"
	},
	elements : {
	    actions : {
		//name : "Actions",
		ui_opts : { child_classes : ["btn-group"]},
		elements : {
		}
	    },

	    

	    control_panel : {
		name : "Camera control panel", 
		ui_opts : {child_view_type : "tabbed", root_classes : ["col-md-5"], child_classes : []},
		elements : {
		    cam_switch : {
			name : "Initialization", subtitle : "Start/Stop the SBIG camera driver.", intro : "<p>The camera driver is a native C++ Node.js addon that runs on the Sadira Node.js server physically connected to the SBIG camera(s).</p> <p>It happens that bugs in the camera driver makes the firmware to crash, in such a case there is no other way than to plug/unplug the camera to force firmware reload trough USB and to restart the Node.js Sadira server processes.</p><p>More investigations are needed to find a suitable solution to the problem.</p>",
			ui_opts : {root_classes : ["container-fluid"], child_classes : ["row"]},
			elements : {
			    start_camera : {
				name : "Start camera", type : "action",
				ui_opts : {
				    item_classes : ["btn btn-primary"], fa_icon : "play",
					    root_classes : ["col-xs-5 col-sm-5"]
				},
			    },
			    status : {
				name: "status : ",
				type : "string",
				ui_opts : {root_classes : ["col-xs-12 col-sm-7"], text_node : "div", label : true},
			    }
			}
		    },
		    
		    server : {
			name : "Server",
			subtitle : "Address of the Sadira Node.js server connected to the SBIG camera",
			type : "template",
			template_name : "sadira",
			ui_opts : {root_classes : ["container-fluid"], child_classes : ["container-fluid"]},
		    },
		    exposure : {
			name : "Exposure configuration",
			elements : {
			    exptime : { name : "Exposure time (s)", type : "double"},
			    nexpo : { name : "Number of expos", type : "double"},
			    binning : { name : "Binning" },
			    start_exposure : {
				name : "Start exposure",
				type : "action",
				ui_opts: {item_classes : ["btn btn-primary"]}
			    },
			    expo_status : {
				
				name : "Exposure status :",
				
				elements : {
				    expo_progress : {
					name : "Exposure progress",
					type : "progress"
				    },
				    grab_progress : {
					name : "Grab progress",
					type : "progress"
				    }
				}

			    }
			    
			    
			}
		    },
		    cooling : {
			name : "Cooling",
			elements : {
			    temp : {name : "CCD temperature", value : 0.0, type : "double"},
			    ambient_temp : {name : "Ambient temperature", value : 0.0, type : "double"},
			    pow : {name : "Cooling power", value : 0.0, type : "double"},
			    enable : {name : "Enable cooling", value : false, type : "bool", ui_opts : { type : "edit"} },
			    setpoint : {name: "Temperature setpoint", value : 0.0, type : "double", ui_opts : { type : "edit"}}
			}
		    }
		}
	    },
	    	    
	    glwidget : {
		name : "Camera monitor",
		subtitle : "View the last image published by the camera driver.",
		ui_opts : { root_classes : ["col-md-7"]},
		//type : "string", value : "Hello widget !",
		elements : {
		    glm : {
			//name : "GL View setup",
			type : "template",
			template_name : "gl_multilayer",
			server_root : "XD-1/",
			ui_opts: {
			    sliding: false,
			    slided : false,
			    child_view_type : "tabbed",
			    render_name : false

			},

			// elements : {
			//     levels : {
			// type : "template",
			// template_name : "levelconf",
			// ui_opts: {
			//     //root_classes : ["inline"], child_classes : ["inline"],child_view_type : "bar"
			// }
			//     }
			// }
		    },
		    screen : {
			//name : "GL Screen"
			//type : "glscreen"
		    }

		}
	    }
	    
	    // last_image : {
	    // 	name : "Last image",
	    // 	type : "template",
	    // 	template_name: "image",
	    // 	elements : {
	    // 	    view : {
	    // 		name : "Preview",
	    // 		template_name : "gl_multilayer",
	    // 		type : "template"
	    // 	    }
	    // 	}
	    // },
	}
    },
    
    
    nunki : {
	name : "Nunki",
	subtitle : "Mobile robotic observatory",
	ui_opts : {child_view_type : "pills",
		   child_classes : ["row"],
		   root_classes : ["container-fluid"]
		  },
	//name : "Observatory control",
	tpl_builder : "nunki",
	elements : {
	    sbig :{
		//type : "string", value : "Hello DB !"
		type : "template",template_name : "sbig_control",
	    },
	    mount : {
		type : "template",template_name : "mount_control",
	    }
	}
    },
    
};


(function(){
    sadira.listen("ready",function(){
	console.log("adding nunki templates");
	tmaster.add_templates(nunki_templates);
    });
})();
