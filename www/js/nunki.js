

var nunki_templates = {
    
    rectangle : {
	name : "Rectangle",
	intro : "Set up position and dimension",
	ui_opts :  {root_classes : [],child_classes : [], editable : true, edited : false},
	elements : {
	    p:{
		name : "Top/Left corner",
		type : "labelled_vector",
		value_labels : ["C<sub>X</sub>","C<sub>Y</sub>"],
		value : [0,0],
		ui_opts : {
		    child_classes : [], label : true,
		    root_classes : ["form-group row"],
		    name_classes : ["control-label col-xs-4"],
		    intro_name : true,
		}
	    },
	    d:{
		name : "Dimensions",
		type : "labelled_vector",
		value_labels : ["Width","Height"],
		value : [0,0],
		ui_opts : {
		    //child_classes : ["input-group"],
		    label : true,
		    root_classes : ["form-group row"],
		    name_classes : ["control-label col-xs-4"],
		}
	    },
	    
	}
    },
    
    
    mount_control : {
	type : "mount_control",
	name : "Mount control",
	ui_opts : {
	    child_view_type : "div",
	    child_classes : ["container-fluid"],
	    root_classes : ["container-fluid"],
	    //render_name : false,
	    name_node : "h2",
	    icon : "/nunki/icons/mount.svg",
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
    
    message_handler : {
	
	//name : "Message title",
	//subtitle : "Et ça ?",
	tpl_builder : "message_handler",
	ui_opts : {
	    root_classes : ["container-fluid"],
	    //item_root : true,
	    //name_classes : ["control-label col-xs-2"],
	    child_classes : ["form-group input-group"],
	    //render_name: false
	},
	elements : {
	    btn : {
		name : "Apply changes",
		type : "action",
		ui_opts : {
		    button_node : "span",
		    item_classes : ["btn btn-info "], fa_icon : "play",
		    //item_root : true,
		    root_classes : ["input-group-btn"]
		},
	    },
	    status : {
		name: "status : ",
		type : "string",
		ui_opts : {item_classes : ["input-group-addon full"], text_node : "span", label : true,
			   item_root : true,
			  },
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
	    icon : "/nunki/icons/sbig.svg",
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
		name : "SBIG camera", subtitle:"control panel",
		toolbar : {
		    ui_opts : {
			//nav_classes : ["nav-pills navbar-right"],
			//toolbar_classes : ["noborder"]
		    }
		},

		ui_opts : {
		    child_view_type : "tabbed", root_classes : ["col-md-5"], child_classes : [],
		    tab_scroll_height : "58vh",
		    icon : "/nunki/icons/sbig.svg", name_node : "h4"
		},
		elements : {
		    main : {
			name : "Camera setup",
			ui_opts : {
			    root_classes : ["container-fluid"], child_classes : ["container-fluid"],
			    render_name : false,
			    child_view_type : "pills"
			    
			},
			elements : {
			    cam_switch : {
				type : "template",
				template_name  : "message_handler",
				name : "Driver switch", subtitle : "Initialize/Release the SBIG camera driver.", intro : "<p>The camera driver is a native C++ Node.js addon running on a Sadira Node.js server physically connected to a SBIG camera.</p> <p>Driver should be unloaded before physically unplugging the camera, failing to do so makes the driver to crash and sadira processes need to be restarted.</p>",
				ui_opts : {
				    root_classes : ["container-fluid"]
				    //sliding: true, slided: false//, label : true
				    //root_classes : ["row"], name_classes : ["col-sm-5"], item_classes : ["col-sm-5"]
				},
			    },

			    server : {
				name : "Websocket server url",
				subtitle : "Sadira websocket server",
				intro : "<p>Address of a Sadira Node.js server participating in the same cluster as at least one SBIG camera server</p><p>Usually, default setting (connecting to the same server as the one serving you these pages) is what you want.</p>",
				type : "template",
				template_name : "sadira",
				ui_opts : {
				    root_classes : ["container-fluid"],
				    //sliding: true, slided: false//, label : true
				    //root_classes : ["row"], name_classes : ["col-sm-5"], item_classes : ["col-sm-5"]
				},
			    }
			    
			    
			}
		    },
		    
		    exposure : {
			name : "Exposure",
			ui_opts : { render_name : false},
			elements : {
			    setup : {
				name : "Options", subtitle : "Set exposure parameters :",
				type : "expo_setup",
				ui_opts : {
				    sliding : true,
				    //child_node_type : "form",
				    child_classes : ["container-fluid"],
				    root_classes : ["container-fluid"],
				    fa_icon : "wrench",
				    //editable : true,
				    //edit_apply : true,
				    save : true
				},
				elements : {
				    params :{
					ui_opts : {
					    child_node_type : "form",
					    child_classes : ["form-horizontal container-fluid"],
					    root_classes : ["container-fluid"],
					    //fa_icon : "wrench",
					    //editable : true,
					    //type : "edit",
					    //edited : true,
					    //edit_apply : true,
					    //save : true
					},

					elements : {
					    exptime : {
						name : "Exposure time", type : "double",
						intro : "<p>Exposure time in seconds.</p>",
						default_value : 10, min : 0, max : 10000, step : .5,
						ui_opts : {
						    root_classes : ["form-group row"],
						    label : true,
						    name_classes : ["control-label col-xs-4"],
						    intro_name : true,
						    type : "edit"
						}
					    },
					    nexpo : {
						name : "Number of expos", type : "double",
						default_value : 1,
						min : 1, max : 1024, step : 1,
						ui_opts : {
						    type : "edit",
						    root_classes : ["form-group"],
						    label : true,
						    name_classes : ["control-label col-xs-4"],
						}
						
					    },
					    binning : {
						name : "Binning",
						type : "combo",
						options : ["1X"],
						default_value : "1X",
						ui_opts : {
						    type : "edit",
						    root_classes : ["form-group"],
						    label : true,
						    name_classes : ["control-label col-xs-4"]
						}
					    },
					    subframe : {
						name : "Sub frame",
						intro : "Set the coordinates of the subframe for readout. Zero dimension means all frame.",
						type : "template",
						template_name : "rectangle",
						ui_opts : {
						    type : "edit",
						    root_classes : ["container-fluid"],
						    child_classes : ["form container-fluid"],
						    //name_classes : ["control-label col-xs-4"],
						    label : true
						}
					    }
					}
				    },

				    mhd : {
					type : "template",
					template_name  : "message_handler",
					//name : "Send",
					//subtitle : "Send exposure params to camera"
				    }
				    
				}
			    },
			    exposure : {
				name : "Image acquisition",
				ui_opts : {
				    root_classes : ["container-fluid"],
				    child_classes : ["container-fluid"],
				    fa_icon : "camera",
				    
				},
				elements : {
				    mhd : {
					type : "template",
					template_name  : "message_handler",
					//name : "Send",
					//subtitle : "Send exposure params to camera"
				    },
				    expo_progress : {
					name : "Turning photons into numbers...",
					type : "progress",
					ui_opts : {
					    label : true,
					    root_classes :  ["row"],
					    name_classes : ["col-xs-4"],
					    wrap : true,
					    wrap_classes : ["col-xs-7"],
					    item_classes :["form-control progress"],
					}
				    },
				    grab_progress : {
					name : "Fetching data from device...",
					type : "progress",
					ui_opts : {
					    label : true,
					    root_classes :  ["row"],
					    name_classes : ["col-xs-4"],
					    wrap : true,
					    wrap_classes : ["col-xs-7"],
					    item_classes :["form-control progress"],
					}

				    },
				    data_progress : {
					name : "Download image",
					type : "progress",
					ui_opts : {
					    label : true,
					    root_classes :  ["row"],
					    name_classes : ["col-xs-4"],
					    wrap : true,
					    wrap_classes : ["col-xs-7"],
					    item_classes :["form-control progress"],
					}

				    }
				}
			    },

			    last_image : {
				name : "No data",
				type : "template",
				template_name : "image"
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
		    },
		    glm : {
			name : "Display",
			type : "template",
			template_name : "gl_multilayer",
			server_root : "XD-1/",
			ui_opts: {
			    child_view_type : "tabbed",
			    //render_name : false

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

		}
	    },
	    	    
	    glwidget : {
		//name : "Camera monitor",
		//subtitle : "View the last image published by the camera driver.",
		ui_opts : { root_classes : ["col-md-7"]},
		//type : "string", value : "Hello widget !",
		elements : {
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
	
	//intro : "<p>The <strong>Nunki observatory</strong> will be a transportable robotic observatory fully controlled trough web interfaces, making use of the latest technologies available.</p> <p>It will be dedicated to help bringing computerized astronomy to a large spectrum of interested and curious public, from children groups, research students, retired people, ...</p>",

//<p>The project homepage will be available soon at <a href='http://www.nunki-observatory.net'>www.nunki-observatory.net</a>.</p>",

	toolbar : {},
	ui_opts : {
	    root: true,
	    child_view_type : "pills",
	    child_classes : ["row"],
	    root_classes : ["container-fluid"],
	    name_node : "h2",
	    tabs_on_name : true
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
		name :"Filter wheel",
		ui_opts : {
		    root_classes : ["container-fluid"],
		    name_node : "h2",
		    icon : "/nunki/icons/wheel.svg",
		}
	    }
	    // spectro : {
	    // 	name :"Spectrograph",
	    // 	ui_opts : {
	    // 	    root_classes : ["container-fluid"],
	    // 	    name_node : "h2",
	    // 	    icon : "/nunki/icons/mount.png",
	    // 	}
	    // },
	    // meteo : {
	    // 	name : "Meteo",
	    // 	ui_opts : {
	    // 	    root_classes : ["container-fluid"],
	    // 	    name_node : "h2",
	    // 	    icon : "/nunki/icons/mount.png",
	    // 	}
	    // },
	    // dome : {
	    // 	name : "Dome",
	    // 	ui_opts : {
	    // 	    root_classes : ["container-fluid"],
	    // 	    name_node : "h2",
	    // 	    icon : "/nunki/icons/mount.png",
	    // 	}
	    // }
	}
    },
    
};


(function(){
    sadira.listen("ready",function(){
	console.log("adding nunki templates");
	tmaster.add_templates(nunki_templates);
    });
})();
