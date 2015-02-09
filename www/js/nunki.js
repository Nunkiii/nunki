

var nunki_templates = {

    sbig_control : {
	
	//name : "SBIG Camera Control",
	type : "sbig_control",
	ui_opts : { child_view_type : "divider", root : false},
	elements : {
	    control : {
		name : "SBIG Control panel", 
		ui_opts : {child_view_type : "tabbed", name_node : "h2"},
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
		//name : "GL Image display",
		ui_opts : { child_view_type : "divider", divdir : true, split_frac : 25},
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
	//name : "Observatory control",
	tpl_builder : "nunki",
	elements : {
	    db :{
		//type : "string", value : "Hello DB !"
		type : "template",template_name : "sbig_control",
	    }
	    ,
	}
    },
    
};


(function(){
    sadira.listen("ready",function(){
	console.log("adding nunki templates");
	tmaster.add_templates(nunki_templates);
    });
})();
