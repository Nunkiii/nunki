

var nunki_templates = {
        
    mount_control : {
	type : "mount_control",
	name : "Mount control",
	ui_opts : {
	    child_view_type : "div",
	    child_classes : ["panel panel-default"],
	    root_classes : ["container-fluid"],
	    name_node : "h2",
	    icon : "/nunki/icons/mount.png",
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
	type : "sbig_control",
	name : "SBIG camera",
	ui_opts : {
	    child_view_type : "div",
	    child_classes : ["row"],
	    root_classes : ["container-fluid"],
	    icon : "/nunki/icons/sbig_cam.png",
	    render_name : false
	},
	elements : {
	    actions : {
		//name : "Actions",
		ui_opts : { child_classes : ["btn-group"]},
		elements : {
		}
	    },

	    

	    control_panel : {
		name : "SBIG camera control panel", 
		ui_opts : {
		    child_view_type : "tabbed", root_classes : ["col-md-5"], child_classes : [],
		    icon : "/nunki/icons/sbig_cam.png", name_node : "h2"
		},
		elements : {
		    cam_switch : {
			name : "Initialization", subtitle : "Initialize/Release the SBIG camera driver.", intro : "<p>The camera driver is a native C++ Node.js addon that runs on the Sadira Node.js server physically connected to the SBIG camera(s).</p> <p>It happens that bugs in the camera driver makes the firmware to crash, in such a case there is no other way than to plug/unplug the camera to force firmware reload trough USB and to restart the Node.js Sadira server processes.</p><p>More investigations are needed to find a suitable solution to the problem.</p>",
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
			subtitle : "Sadira websocket server",
			intro : "<p>Address of a Sadira Node.js server participating in the same cluster as at least one SBIG camera server</p><p>Usually, default setting (connecting to the same server as the one serving you these pages) is what you want.</p>",
			type : "template",
			template_name : "sadira",
			ui_opts : {root_classes : ["container-fluid"], child_classes : ["container-fluid"]},
		    },
		    exposure : {
			name : "Exposure",
			elements : {
			    setup : {
				name : "Configuration",subtitle : "Set exposure parameters :",
				ui_opts : {
				    root_classes : ["container-fluid"],
				    child_classes : ["row"],
				    fa_icon : "wrench",
				    editable : true
				},
				elements : {
				    exptime : {
					name : "Exposure time", type : "double", intro : "<p>Exposure time in seconds.</p>",
					default_value : 10, min : 0, max : 10000, step : .5,
					ui_opts : {
					    label : true,
					    root_classes : ["col-sm-4"],
					    
					}
				    },
				    nexpo : {
					name : "Number of expos", type : "double",
					default_value : 1,
					min : 1, max : 1024, step : 1,
					ui_opts : {
					    label : true,
					    root_classes : ["col-sm-4"]
					}
				    },
				    binning : {
					name : "Binning",
					type : "combo",
					options : ["1X"],
					default_value : "1X",
					ui_opts : {
					    label : true,
					    root_classes : ["col-sm-4"]
					}
				    }
				}
			    },
			    exposure : {
				name : "Image acquisition",
				ui_opts : {},
				elements : {
				    start_exposure : {
					name : "Start exposure",
					type : "action",
					ui_opts: {item_classes : ["btn btn-primary"], fa_icon : "circle"}
				    },
				    expo_status : {
					
					name : "Exposure status :",
					ui_opts : {
					    root_classes :  ["row"],
					    child_classes :["container-fluid"],
					},
					elements : {
					    expo_progress : {
						name : "Exposure progress",
						type : "progress",
						ui_opts : {
						    root_classes :  ["row"],
						    name_classes : ["col-md-4"], 
						    item_classes :["col-md-8"],
						}
					    },
					    grab_progress : {
						name : "Grab progress",
						type : "progress",
						ui_opts : {
						    root_classes :  ["row"],
						    name_classes : ["col-md-4"], 
						    item_classes :["col-md-8"],
						}

					    }
					}
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
	intro : "<p>The <strong>Nunki observatory</strong> will be a transportable robotic observatory fully controlled trough web interfaces, making use of the latest technologies available.</p> <p>It will be dedicated to help bringing computerized astronomy to a large spectrum of interested and curious public, from children groups, research students to retired people.</p>",

//<p>The project homepage will be available soon at <a href='http://www.nunki-observatory.net'>www.nunki-observatory.net</a>.</p>",
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

	    },
	    filter_wheel : {
		name :"Filter wheel"
	    },
	    spectro : {
		name :"Spectrograph"
	    },
	    meteo : {
		name : "Meteo"
	    },
	    dome : {
		name : "Dome"
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
