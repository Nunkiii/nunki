

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
	name : "SBIG camera", 
	type : "sbig_control",
	ui_opts : {
	    child_view_type : "div",
	    child_classes : ["row"],
	    root_classes : ["container-fluid"],
	    name_node : "h2"
	},
	elements : {
	    control : {
		//name : "Control panel", 
		ui_opts : {child_view_type : "tabbed", root_classes : ["col-md-5"]},
		elements : {
		    server : {
			name : "Camera server",
			type : "template",
			template_name : "sadira"
		    },
		    exposure : {
			name : "Exposure configuration",
			elements : {
			    exptime : { name : "Exposure time (s)", type : "double"},
			    nexpo : { name : "Number of expos", type : "double"},
			    binning : { name : "Binning" }
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
		    },
		    actions : {
			name : "Actions",
			elements : {
			    start_camera : { 
				name : "Start camera", type : "action"
			    },
			    start_exposure : {
				name : "Start exposure", 
				type : "action",
				elements : {
				    expo_progress : {
					name : "Exposure",
					type : "progress"
				    },
				    grab_progress : {
					name : "Exposure",
					type : "progress"
				    }
				}
				
			    }
			}
		    },
		    messages : {
			name : "Info",
			type : "text"
		    }
		}
	    },
	    	    
	    glwidget : {
		name : "WebGL Monitor",
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
	    db :{
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
