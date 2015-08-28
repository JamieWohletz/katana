"use strict";define("katana/acceptance-tests/main",["exports","ember-cli-sri/acceptance-tests/main"],function(e,t){e["default"]=t["default"]}),define("katana/app",["exports","ember","ember/resolver","ember/load-initializers","katana/config/environment"],function(e,t,r,n,a){var l;t["default"].MODEL_FACTORY_INJECTIONS=!0,l=t["default"].Application.extend({modulePrefix:a["default"].modulePrefix,podModulePrefix:a["default"].podModulePrefix,Resolver:r["default"]}),n["default"](l,a["default"].modulePrefix),e["default"]=l}),define("katana/blueprints/ember-youtube",["exports","ember-youtube/blueprints/ember-youtube"],function(e,t){e["default"]=t["default"]}),define("katana/components/app-version",["exports","ember-cli-app-version/components/app-version","katana/config/environment"],function(e,t,r){var n=r["default"].APP,a=n.name,l=n.version;e["default"]=t["default"].extend({version:l,name:a})}),define("katana/components/ember-youtube",["exports","ember","ember-youtube/components/ember-youtube"],function(e,t,r){e["default"]=r["default"]}),define("katana/components/video-player-url-input",["exports","ember"],function(e,t){e["default"]=t["default"].Component.extend({storage:t["default"].inject.service(),project:null,videoId:t["default"].computed("videoUrl",{get:function(e){return this.extractVideoIdFromUrl(this.get("videoUrl")||"")},set:function(e,t){return t}}),_autoSetupProject:t["default"].observer("videoId",function(){var e=this.get("videoId"),t=this.get("storage"),r=this;return e?void t.loadAll(function(){var n=t.findProjectBy("videoId",e);n||(n=t.createProject({videoId:e,slices:[],videoLength:0})),r.set("project",n)}):void r.set("project",null)}),extractVideoIdFromUrl:function(e){var t=/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,r=e.match(t);return r&&11===r[2].length?r[2]:null}})}),define("katana/components/video-player",["exports","ember"],function(e,t){e["default"]=t["default"].Component.extend({storage:t["default"].inject.service(),project:null,playerWidth:640,SLICING:0,REPEATING:1,NORMAL:2,mode:2,currentSlice:null,videoId:"",playerVars:{controls:1,enablejsapi:1,rel:0,showinfo:0,fs:1,autohide:0,playsinline:1,modestbranding:0},_saveVideoLength:t["default"].observer("youtubePlayer.durationValue","project",function(){var e=this.get("project"),r=t["default"].get(e||{},"videoLength")||this.get("youtubePlayer.durationValue");e&&t["default"].set(e,"videoLength",r)}),_updateSlicingVisual:t["default"].observer("youtubePlayer.currentTime",function(){if(this.mode===this.SLICING){var e=this.get("youtubePlayer.currentTime"),r=this.get("currentSlice.startTime");this._isValidDuration(r,e)&&t["default"].set(this.get("currentSlice"),"endTime",this.get("youtubePlayer.currentTime"))}}),_updateSliceProgressIndicator:t["default"].observer("youtubePlayer.currentTime",function(){if(this.mode===this.REPEATING){var e=this.get("currentSlice"),r=t["default"].get(e,"startTime"),n=+this.get("youtubePlayer.currentTime")-r,a=t["default"].get(e,"duration");t["default"].set(e,"indicatorPositionPercentage",n/a*100)}}),_loopSlice:t["default"].observer("youtubePlayer.currentTime",function(){if(this.mode===this.REPEATING){var e=this.get("currentSlice"),r=t["default"].get(e,"endTime"),n=t["default"].get(e,"startTime");this.get("youtubePlayer.currentTime")>=r&&this._seekTo(n)}}),startSlice:function(e){this.setMode(this.SLICING);var t=this.get("storage").createSliceAndAddToProject({startTime:e,endTime:e},this.get("project"));this.set("currentSlice",t)},finishSlice:function(e,r){this._isValidDuration(t["default"].get(e,"startTime"),r)&&t["default"].set(this.get("currentSlice"),"endTime",r),this.setMode(this.NORMAL)},playSlice:function(e){this._seekTo(t["default"].get(e,"startTime")),this.set("currentSlice",e),this.setMode(this.REPEATING)},deleteSlice:function(e){this.get("project.slices").removeObject(e)},setMode:function(e){e===this.NORMAL&&this.set("currentSlice",null),this.set("mode",e)},_isValidDuration:function(e,t){return t>e},_seekTo:function(e){var t=this.get("youtubePlayer"),r=t.get("player");r.seekTo(e)},actions:{toggleSliceAction:function(e){if(e){var t=this.get("currentSlice");this.mode===this.SLICING?(this.finishSlice(t,e),this.playSlice(t),this.get("storage").saveAll()):(this.setMode(this.SLICING),this.startSlice(e))}},togglePlaySliceAction:function(e){return this.mode===this.REPEATING&&this.get("currentSlice")===e?void this.setMode(this.NORMAL):void this.playSlice(e)},deleteSliceAction:function(e){this.get("currentSlice")===e&&this.setMode(this.NORMAL),this.deleteSlice(e),this.get("storage").saveAll()}}})}),define("katana/components/video-slice-adjuster",["exports","ember"],function(e,t){e["default"]=t["default"].Component.extend({storage:t["default"].inject.service(),intervalId:"",tagName:"a",attributeBindings:["href","title"],href:"#",title:"Click and hold to adjust the clip.",direction:"",classNames:["video-player-slice-adjuster","fa"],classNameBindings:["icon"],icon:t["default"].computed("direction",function(){return"left"===this.get("direction")?this.get("leftIcon"):this.get("rightIcon")}),mouseDown:function(e){this.set("pressed",!0)},mouseUp:function(e){this.set("pressed",!1)},_reactToInteraction:t["default"].observer("pressed",function(){var e=this;return this.get("pressed")?void this.set("intervalId",window.setInterval(function(){e.sendAction("action",e.get("direction"))},100)):(window.clearInterval(this.get("intervalId")),void e.get("storage").saveAll())})})}),define("katana/components/video-slice",["exports","ember"],function(e,t){e["default"]=t["default"].Component.extend({tagName:"",videoLength:0,INCREMENT:1,MINIMUM_SLICE_SIZE:2,expandFromLeft:!0,adjustSizeTitle:"Click and hold to adjust clip length.",adjustPositionTitle:"Click and hold to adjust clip position.",active:t["default"].computed("currentSlice",function(){return this.get("slice")===this.get("currentSlice")}),indicatorPositionPercentage:t["default"].computed("currentTime","slice.startTime","duration",function(){var e=(this.get("currentTime")-this.get("slice.startTime"))/this.get("duration")*100;return new t["default"].Handlebars.SafeString("left:"+e+"%;")}),duration:t["default"].computed("slice","slice.startTime","slice.endTime",function(){return+this.get("slice.endTime")-+this.get("slice.startTime")}),style:t["default"].computed("duration","videoLength",function(){var e=+this.get("duration"),r=+this.get("videoLength"),n=+this.get("slice.startTime"),a=(e/r*100).toFixed(2),l=n/r*100;return new t["default"].Handlebars.SafeString("left:"+l+"%;width:"+a+"%;")}),actions:{play:function(e){this.sendAction("play",e)},"delete":function(e){this.sendAction("delete",e)},changePosition:function(e){var r=this.get("slice"),n=t["default"].get(r,"startTime"),a=t["default"].get(r,"endTime"),l=this.get("duration");if("left"===e){var i=Math.max(0,n-this.INCREMENT);t["default"].setProperties(r,{startTime:i,endTime:l+i})}else{var o=Math.min(this.videoLength,a+this.INCREMENT);t["default"].setProperties(r,{endTime:o,startTime:o-l})}},changeSize:function(e){var r=this.get("slice"),n=t["default"].get(r,"startTime"),a=t["default"].get(r,"endTime"),l=this.get("expandFromLeft");l?a+="left"===e?-this.INCREMENT:this.INCREMENT:n+="left"===e?-this.INCREMENT:this.INCREMENT,a-n<this.MINIMUM_SLICE_SIZE&&this.set("expandFromLeft",!l),t["default"].setProperties(r,{startTime:n,endTime:a})}}})}),define("katana/controllers/array",["exports","ember"],function(e,t){e["default"]=t["default"].Controller}),define("katana/controllers/object",["exports","ember"],function(e,t){e["default"]=t["default"].Controller}),define("katana/helpers/and",["exports","ember","ember-truth-helpers/helpers/and"],function(e,t,r){var n=null;t["default"].Helper?n=t["default"].Helper.helper(r.andHelper):t["default"].HTMLBars.makeBoundHelper&&(n=t["default"].HTMLBars.makeBoundHelper(r.andHelper)),e["default"]=n}),define("katana/helpers/eq",["exports","ember","ember-truth-helpers/helpers/equal"],function(e,t,r){var n=null;t["default"].Helper?n=t["default"].Helper.helper(r.equalHelper):t["default"].HTMLBars.makeBoundHelper&&(n=t["default"].HTMLBars.makeBoundHelper(r.equalHelper)),e["default"]=n}),define("katana/helpers/fa-icon",["exports","ember-cli-font-awesome/helpers/fa-icon"],function(e,t){e["default"]=t["default"],e.faIcon=t.faIcon}),define("katana/helpers/format-number",["exports","ember"],function(e,t){function r(e){return isNaN(e)?e:(+e).toFixed(1)}e.formatNumber=r,e["default"]=t["default"].Helper.helper(r)}),define("katana/helpers/gt",["exports","ember","ember-truth-helpers/helpers/gt"],function(e,t,r){var n=null;t["default"].Helper?n=t["default"].Helper.helper(r.gtHelper):t["default"].HTMLBars.makeBoundHelper&&(n=t["default"].HTMLBars.makeBoundHelper(r.gtHelper)),e["default"]=n}),define("katana/helpers/gte",["exports","ember","ember-truth-helpers/helpers/gte"],function(e,t,r){var n=null;t["default"].Helper?n=t["default"].Helper.helper(r.gteHelper):t["default"].HTMLBars.makeBoundHelper&&(n=t["default"].HTMLBars.makeBoundHelper(r.gteHelper)),e["default"]=n}),define("katana/helpers/is-array",["exports","ember","ember-truth-helpers/helpers/is-array"],function(e,t,r){var n=null;t["default"].Helper?n=t["default"].Helper.helper(r.isArrayHelper):t["default"].HTMLBars.makeBoundHelper&&(n=t["default"].HTMLBars.makeBoundHelper(r.isArrayHelper)),e["default"]=n}),define("katana/helpers/lt",["exports","ember","ember-truth-helpers/helpers/lt"],function(e,t,r){var n=null;t["default"].Helper?n=t["default"].Helper.helper(r.ltHelper):t["default"].HTMLBars.makeBoundHelper&&(n=t["default"].HTMLBars.makeBoundHelper(r.ltHelper)),e["default"]=n}),define("katana/helpers/lte",["exports","ember","ember-truth-helpers/helpers/lte"],function(e,t,r){var n=null;t["default"].Helper?n=t["default"].Helper.helper(r.lteHelper):t["default"].HTMLBars.makeBoundHelper&&(n=t["default"].HTMLBars.makeBoundHelper(r.lteHelper)),e["default"]=n}),define("katana/helpers/not-eq",["exports","ember","ember-truth-helpers/helpers/not-equal"],function(e,t,r){var n=null;t["default"].Helper?n=t["default"].Helper.helper(r.notEqualHelper):t["default"].HTMLBars.makeBoundHelper&&(n=t["default"].HTMLBars.makeBoundHelper(r.notEqualHelper)),e["default"]=n}),define("katana/helpers/not",["exports","ember","ember-truth-helpers/helpers/not"],function(e,t,r){var n=null;t["default"].Helper?n=t["default"].Helper.helper(r.notHelper):t["default"].HTMLBars.makeBoundHelper&&(n=t["default"].HTMLBars.makeBoundHelper(r.notHelper)),e["default"]=n}),define("katana/helpers/or",["exports","ember","ember-truth-helpers/helpers/or"],function(e,t,r){var n=null;t["default"].Helper?n=t["default"].Helper.helper(r.orHelper):t["default"].HTMLBars.makeBoundHelper&&(n=t["default"].HTMLBars.makeBoundHelper(r.orHelper)),e["default"]=n}),define("katana/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","katana/config/environment"],function(e,t,r){var n=r["default"].APP,a=n.name,l=n.version;e["default"]={name:"App Version",initialize:t["default"](a,l)}}),define("katana/initializers/export-application-global",["exports","ember","katana/config/environment"],function(e,t,r){function n(e,n){if(r["default"].exportApplicationGlobal!==!1){var a,l=r["default"].exportApplicationGlobal;a="string"==typeof l?l:t["default"].String.classify(r["default"].modulePrefix),window[a]||(window[a]=n,n.reopen({willDestroy:function(){this._super.apply(this,arguments),delete window[a]}}))}}e.initialize=n,e["default"]={name:"export-application-global",initialize:n}}),define("katana/initializers/truth-helpers",["exports","ember","ember-truth-helpers/utils/register-helper","ember-truth-helpers/helpers/and","ember-truth-helpers/helpers/or","ember-truth-helpers/helpers/equal","ember-truth-helpers/helpers/not","ember-truth-helpers/helpers/is-array","ember-truth-helpers/helpers/not-equal","ember-truth-helpers/helpers/gt","ember-truth-helpers/helpers/gte","ember-truth-helpers/helpers/lt","ember-truth-helpers/helpers/lte"],function(e,t,r,n,a,l,i,o,d,c,u,s,p){function m(){t["default"].Helper||(r.registerHelper("and",n.andHelper),r.registerHelper("or",a.orHelper),r.registerHelper("eq",l.equalHelper),r.registerHelper("not",i.notHelper),r.registerHelper("is-array",o.isArrayHelper),r.registerHelper("not-eq",d.notEqualHelper),r.registerHelper("gt",c.gtHelper),r.registerHelper("gte",u.gteHelper),r.registerHelper("lt",s.ltHelper),r.registerHelper("lte",p.lteHelper))}e.initialize=m,e["default"]={name:"truth-helpers",initialize:m}}),define("katana/models/project",function(){}),define("katana/models/slice",function(){}),define("katana/router",["exports","ember","katana/config/environment"],function(e,t,r){var n=t["default"].Router.extend({location:r["default"].locationType});n.map(function(){}),e["default"]=n}),define("katana/services/storage",["exports","ember"],function(e,t){e["default"]=t["default"].Service.extend({KEY:"katana-store",store:{projects:[]},loadAll:function(e){var t=this.get("store");localforage.getItem(this.KEY,function(r,n){n=JSON.parse(n),n&&n.projects&&n.projects.forEach(function(e){t.projects.pushObject(e)}),e()})},saveAll:function(){localforage.setItem(this.KEY,JSON.stringify(this.get("store")))},findProjectBy:function(e,t){var r=this.get("store").projects;return r.filter(function(r){return r[e]===t}).shift()},createProject:function(e){return this.validProperties(e,"project")?(this.get("store").projects.pushObject(e),e):null},createSliceAndAddToProject:function(e,t){if(!this.validProperties(e,"slice")||!this.validProperties(t,"project"))return null;var r=this.get("store").projects;return r[r.indexOf(t)].slices.pushObject(e),e},validProperties:function(e,t){return"slice"===t?e.startTime&&"number"==typeof e.startTime&&e.endTime&&"number"==typeof e.endTime:e.videoId&&"string"==typeof e.videoId&&e.slices&&e.slices instanceof Array}})}),define("katana/templates/application",["exports"],function(e){e["default"]=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:1,column:0},end:{line:2,column:0}},moduleName:"katana/templates/application.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createComment("");e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=new Array(1);return n[0]=e.createMorphAt(t,0,0,r),e.insertBoundary(t,0),n},statements:[["content","video-player",["loc",[null,[1,0],[1,16]]]]],locals:[],templates:[]}}())}),define("katana/templates/components/ember-youtube",["exports"],function(e){e["default"]=Ember.HTMLBars.template(function(){var e=function(){var e=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:7,column:34},end:{line:7,column:56}},moduleName:"katana/templates/components/ember-youtube.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("Pause");return e.appendChild(t,r),t},buildRenderNodes:function(){return[]},statements:[],locals:[],templates:[]}}(),t=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:7,column:56},end:{line:7,column:68}},moduleName:"katana/templates/components/ember-youtube.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("Play");return e.appendChild(t,r),t},buildRenderNodes:function(){return[]},statements:[],locals:[],templates:[]}}(),r=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:8,column:36},end:{line:8,column:57}},moduleName:"katana/templates/components/ember-youtube.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("Unmute");return e.appendChild(t,r),t},buildRenderNodes:function(){return[]},statements:[],locals:[],templates:[]}}(),n=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:8,column:57},end:{line:8,column:69}},moduleName:"katana/templates/components/ember-youtube.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("Mute");return e.appendChild(t,r),t},buildRenderNodes:function(){return[]},statements:[],locals:[],templates:[]}}();return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:5,column:1},end:{line:10,column:1}},moduleName:"katana/templates/components/ember-youtube.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("	");e.appendChild(t,r);var r=e.createElement("menu");e.setAttribute(r,"class","EmberYoutube-controls");var n=e.createTextNode("\n		");e.appendChild(r,n);var n=e.createElement("button"),a=e.createComment("");e.appendChild(n,a),e.appendChild(r,n);var n=e.createTextNode("\n		");e.appendChild(r,n);var n=e.createElement("button"),a=e.createComment("");e.appendChild(n,a),e.appendChild(r,n);var n=e.createTextNode("\n	");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=e.childAt(t,[1]),a=e.childAt(n,[1]),l=e.childAt(n,[3]),i=new Array(4);return i[0]=e.createElementMorph(a),i[1]=e.createMorphAt(a,0,0),i[2]=e.createElementMorph(l),i[3]=e.createMorphAt(l,0,0),i},statements:[["element","action",["togglePlay"],[],["loc",[null,[7,10],[7,33]]]],["block","if",[["get","isPlaying",["loc",[null,[7,40],[7,49]]]]],[],0,1,["loc",[null,[7,34],[7,75]]]],["element","action",["toggleVolume"],[],["loc",[null,[8,10],[8,35]]]],["block","if",[["get","isMuted",["loc",[null,[8,42],[8,49]]]]],[],2,3,["loc",[null,[8,36],[8,76]]]]],locals:[],templates:[e,t,r,n]}}(),t=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:12,column:1},end:{line:16,column:1}},moduleName:"katana/templates/components/ember-youtube.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("		");e.appendChild(t,r);var r=e.createElement("p");e.setAttribute(r,"class","EmberYoutube-time");var n=e.createTextNode("\n			");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createTextNode("/");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createTextNode("\n		");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=e.childAt(t,[1]),a=new Array(2);return a[0]=e.createMorphAt(n,1,1),a[1]=e.createMorphAt(n,3,3),a},statements:[["content","currentTimeFormatted",["loc",[null,[14,3],[14,27]]]],["content","durationFormatted",["loc",[null,[14,28],[14,49]]]]],locals:[],templates:[]}}(),r=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:18,column:1},end:{line:22,column:1}},moduleName:"katana/templates/components/ember-youtube.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("		");e.appendChild(t,r);var r=e.createElement("p");e.setAttribute(r,"class","EmberYoutube-progress");var n=e.createTextNode("\n			");e.appendChild(r,n);var n=e.createElement("progress");e.appendChild(r,n);var n=e.createTextNode("\n		");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=e.childAt(t,[1,1]),a=new Array(2);return a[0]=e.createAttrMorph(n,"value"),a[1]=e.createAttrMorph(n,"max"),a},statements:[["attribute","value",["get","currentTimeValue",["loc",[null,[20,21],[20,37]]]]],["attribute","max",["get","durationValue",["loc",[null,[20,46],[20,59]]]]]],locals:[],templates:[]}}(),n=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:24,column:1},end:{line:31,column:1}},moduleName:"katana/templates/components/ember-youtube.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("		");e.appendChild(t,r);var r=e.createElement("p");e.setAttribute(r,"class","EmberYoutube-debug");var n=e.createElement("code"),a=e.createTextNode("\n			ytid: ");e.appendChild(n,a);var a=e.createComment("");e.appendChild(n,a);var a=e.createElement("br");e.appendChild(n,a);var a=e.createTextNode("\n			state: ");e.appendChild(n,a);var a=e.createComment("");e.appendChild(n,a);var a=e.createElement("br");e.appendChild(n,a);var a=e.createTextNode("\n			isMuted: ");e.appendChild(n,a);var a=e.createComment("");e.appendChild(n,a);var a=e.createElement("br");e.appendChild(n,a);var a=e.createTextNode("\n			isPlaying: ");e.appendChild(n,a);var a=e.createComment("");e.appendChild(n,a);var a=e.createElement("br");e.appendChild(n,a);var a=e.createTextNode("\n		");e.appendChild(n,a),e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=e.childAt(t,[1,0]),a=new Array(4);return a[0]=e.createMorphAt(n,1,1),a[1]=e.createMorphAt(n,4,4),a[2]=e.createMorphAt(n,7,7),a[3]=e.createMorphAt(n,10,10),a},statements:[["content","ytid",["loc",[null,[26,9],[26,17]]]],["content","playerState",["loc",[null,[27,10],[27,25]]]],["content","isMuted",["loc",[null,[28,12],[28,23]]]],["content","isPlaying",["loc",[null,[29,14],[29,27]]]]],locals:[],templates:[]}}();return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:1,column:0},end:{line:37,column:0}},moduleName:"katana/templates/components/ember-youtube.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createElement("div");e.setAttribute(r,"id","EmberYoutube-player"),e.appendChild(t,r);var r=e.createTextNode("\n\n");e.appendChild(t,r);var r=e.createElement("div");e.setAttribute(r,"class","EmberYoutube-controls");var n=e.createTextNode("\n\n");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createTextNode("\n");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createTextNode("\n");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createTextNode("\n");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n\n");e.appendChild(t,r);var r=e.createElement("div");e.setAttribute(r,"class","EmberYoutube-yield");var n=e.createTextNode("\n	");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createTextNode("\n");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=e.childAt(t,[2]),a=new Array(5);return a[0]=e.createMorphAt(n,1,1),a[1]=e.createMorphAt(n,3,3),a[2]=e.createMorphAt(n,5,5),a[3]=e.createMorphAt(n,7,7),a[4]=e.createMorphAt(e.childAt(t,[4]),1,1),a},statements:[["block","if",[["get","showControls",["loc",[null,[5,7],[5,19]]]]],[],0,null,["loc",[null,[5,1],[10,8]]]],["block","if",[["get","showTime",["loc",[null,[12,7],[12,15]]]]],[],1,null,["loc",[null,[12,1],[16,8]]]],["block","if",[["get","showProgress",["loc",[null,[18,7],[18,19]]]]],[],2,null,["loc",[null,[18,1],[22,8]]]],["block","if",[["get","showDebug",["loc",[null,[24,7],[24,16]]]]],[],3,null,["loc",[null,[24,1],[31,8]]]],["content","yield",["loc",[null,[35,1],[35,10]]]]],locals:[],templates:[e,t,r,n]}}())}),define("katana/templates/components/video-player-url-input",["exports"],function(e){e["default"]=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:1,column:0},end:{line:5,column:0}},moduleName:"katana/templates/components/video-player-url-input.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createElement("div");e.setAttribute(r,"id","video-player-input-wrapper"),e.setAttribute(r,"class","text-center pure-form");var n=e.createTextNode("\n  ");e.appendChild(r,n);var n=e.createElement("label");e.setAttribute(n,"for","video-player-input");var a=e.createTextNode("YouTube Video URL:");e.appendChild(n,a),e.appendChild(r,n);var n=e.createElement("br");e.appendChild(r,n);var n=e.createTextNode("\n  ");e.appendChild(r,n);var n=e.createComment("");e.appendChild(r,n);var n=e.createElement("br");e.appendChild(r,n);var n=e.createTextNode("\n");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=new Array(1);return n[0]=e.createMorphAt(e.childAt(t,[0]),4,4),n},statements:[["inline","input",[],["id","video-player-input","type","text","value",["subexpr","@mut",[["get","videoUrl",["loc",[null,[3,52],[3,60]]]]],[],[]]],["loc",[null,[3,2],[3,62]]]]],locals:[],templates:[]}}())}),define("katana/templates/components/video-player",["exports"],function(e){e["default"]=Ember.HTMLBars.template(function(){var e=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:28,column:12},end:{line:30,column:12}},moduleName:"katana/templates/components/video-player.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("              Finish\n");return e.appendChild(t,r),t},buildRenderNodes:function(){return[]},statements:[],locals:[],templates:[]}}(),t=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:30,column:12},end:{line:32,column:12}},moduleName:"katana/templates/components/video-player.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("              Record\n");return e.appendChild(t,r),t},buildRenderNodes:function(){return[]},statements:[],locals:[],templates:[]}}(),r=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:37,column:8},end:{line:39,column:8}},moduleName:"katana/templates/components/video-player.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("          ");e.appendChild(t,r);var r=e.createElement("strong"),n=e.createTextNode("Clips will show up here");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(){return[]},statements:[],locals:[],templates:[]}}(),n=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:40,column:8},end:{line:49,column:8}},moduleName:"katana/templates/components/video-player.hbs"},arity:1,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("          ");e.appendChild(t,r);var r=e.createComment("");e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=new Array(1);return n[0]=e.createMorphAt(t,1,1,r),n},statements:[["inline","video-slice",[],["videoLength",["subexpr","@mut",[["get","project.videoLength",["loc",[null,[42,24],[42,43]]]]],[],[]],"slice",["subexpr","@mut",[["get","slice",["loc",[null,[43,18],[43,23]]]]],[],[]],"currentSlice",["subexpr","@mut",[["get","currentSlice",["loc",[null,[44,25],[44,37]]]]],[],[]],"currentTime",["subexpr","@mut",[["get","youtubePlayer.currentTime",["loc",[null,[45,24],[45,49]]]]],[],[]],"play","togglePlaySliceAction","delete","deleteSliceAction"],["loc",[null,[41,10],[48,12]]]]],locals:["slice"],templates:[]}}();return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:1,column:0},end:{line:60,column:0}},moduleName:"katana/templates/components/video-player.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createElement("div");e.setAttribute(r,"class","pure-g");var n=e.createTextNode("\n  ");e.appendChild(r,n);var n=e.createComment(" LEFT COLUMN ");e.appendChild(r,n);var n=e.createTextNode("\n  ");e.appendChild(r,n);var n=e.createElement("div");e.setAttribute(n,"class","pure-u-1-5");var a=e.createTextNode("\n    ");e.appendChild(n,a);var a=e.createElement("div");e.setAttribute(a,"id","project-list-container");var l=e.createTextNode("\n    ");e.appendChild(a,l),e.appendChild(n,a);var a=e.createTextNode("\n  ");e.appendChild(n,a),e.appendChild(r,n);var n=e.createTextNode("\n  ");e.appendChild(r,n);var n=e.createComment(" CENTER COLUMN ");e.appendChild(r,n);var n=e.createTextNode("\n  ");e.appendChild(r,n);var n=e.createElement("div");e.setAttribute(n,"class","pure-u-3-5");var a=e.createTextNode("\n    ");e.appendChild(n,a);var a=e.createElement("div");e.setAttribute(a,"id","video-player-container");var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createComment(" URL input - Displays an input for users to enter a YouTube video ");e.appendChild(a,l);var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createComment("");e.appendChild(a,l);var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createComment(" Video player - Displays youtube video player and controls ");e.appendChild(a,l);var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createElement("div");e.setAttribute(l,"id","video-player"),e.setAttribute(l,"class","text-center");var i=e.createTextNode("\n        ");e.appendChild(l,i);var i=e.createComment("");e.appendChild(l,i);var i=e.createTextNode("\n      ");e.appendChild(l,i),e.appendChild(a,l);var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createElement("div");e.setAttribute(l,"id","video-player-controls"),e.setAttribute(l,"class","text-center center");var i=e.createTextNode("\n          ");e.appendChild(l,i);var i=e.createElement("button");e.setAttribute(i,"id","video-player-slice-button");var o=e.createTextNode("\n            ");e.appendChild(i,o);var o=e.createComment("");e.appendChild(i,o);var o=e.createTextNode("\n");e.appendChild(i,o);var o=e.createComment("");e.appendChild(i,o);var o=e.createTextNode("          ");e.appendChild(i,o),e.appendChild(l,i);var i=e.createTextNode("\n      ");e.appendChild(l,i),e.appendChild(a,l);var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createComment(" Slice panel - Displays all video slices  ");e.appendChild(a,l);var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createElement("div");e.setAttribute(l,"id","video-player-slice-panel"),e.setAttribute(l,"class","center");var i=e.createTextNode("\n");e.appendChild(l,i);var i=e.createComment("");e.appendChild(l,i);var i=e.createComment("");e.appendChild(l,i);var i=e.createTextNode("      ");e.appendChild(l,i),e.appendChild(a,l);var l=e.createTextNode("\n    ");e.appendChild(a,l),e.appendChild(n,a);var a=e.createTextNode("\n  ");e.appendChild(n,a),e.appendChild(r,n);var n=e.createTextNode("\n\n  ");e.appendChild(r,n);var n=e.createComment(" RIGHT COLUMN ");e.appendChild(r,n);var n=e.createTextNode("\n  ");e.appendChild(r,n);var n=e.createElement("div");e.setAttribute(n,"class","pure-u-1-5");var a=e.createTextNode("\n\n  ");e.appendChild(n,a),e.appendChild(r,n);var n=e.createTextNode("\n\n");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=e.childAt(t,[0,7,1]),a=e.childAt(n,[9,1]),l=e.childAt(n,[13]),i=new Array(8);return i[0]=e.createMorphAt(n,3,3),i[1]=e.createMorphAt(e.childAt(n,[7]),1,1),i[2]=e.createAttrMorph(a,"class"),i[3]=e.createElementMorph(a),i[4]=e.createMorphAt(a,1,1),i[5]=e.createMorphAt(a,3,3),i[6]=e.createMorphAt(l,1,1),i[7]=e.createMorphAt(l,2,2),i},statements:[["inline","video-player-url-input",[],["videoId",["subexpr","@mut",[["get","videoId",["loc",[null,[11,39],[11,46]]]]],[],[]],"project",["subexpr","@mut",[["get","project",["loc",[null,[11,55],[11,62]]]]],[],[]]],["loc",[null,[11,6],[11,64]]]],["inline","ember-youtube",[],["ytid",["subexpr","@mut",[["get","videoId",["loc",[null,[15,15],[15,22]]]]],[],[]],"playerVars",["subexpr","@mut",[["get","playerVars",["loc",[null,[16,21],[16,31]]]]],[],[]],"delegate",["subexpr","@mut",[["get","this",["loc",[null,[17,19],[17,23]]]]],[],[]],"delegate-as","youtubePlayer"],["loc",[null,[14,8],[19,10]]]],["attribute","class",["concat",["pure-button ",["subexpr","if",[["subexpr","eq",[["get","mode",["loc",[null,[24,40],[24,44]]]],["get","SLICING",["loc",[null,[24,45],[24,52]]]]],[],["loc",[null,[24,36],[24,53]]]],"pure-button-active red-button"],[],["loc",[null,[24,31],[24,87]]]]]]],["element","action",["toggleSliceAction",["get","youtubePlayer.currentTime",["loc",[null,[25,41],[25,66]]]]],[],["loc",[null,[25,12],[25,68]]]],["inline","fa-icon",["circle"],[],["loc",[null,[27,12],[27,32]]]],["block","if",[["subexpr","eq",[["get","mode",["loc",[null,[28,22],[28,26]]]],["get","SLICING",["loc",[null,[28,27],[28,34]]]]],[],["loc",[null,[28,18],[28,35]]]]],[],0,1,["loc",[null,[28,12],[32,19]]]],["block","unless",[["get","project.slices",["loc",[null,[37,18],[37,32]]]]],[],2,null,["loc",[null,[37,8],[39,19]]]],["block","each",[["get","project.slices",["loc",[null,[40,16],[40,30]]]]],[],3,null,["loc",[null,[40,8],[49,17]]]]],
locals:[],templates:[e,t,r,n]}}())}),define("katana/templates/components/video-slice-adjuster",["exports"],function(e){e["default"]=Ember.HTMLBars.template(function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:1,column:0},end:{line:1,column:0}},moduleName:"katana/templates/components/video-slice-adjuster.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment();return t},buildRenderNodes:function(){return[]},statements:[],locals:[],templates:[]}}())}),define("katana/templates/components/video-slice",["exports"],function(e){e["default"]=Ember.HTMLBars.template(function(){var e=function(){return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:29,column:6},end:{line:35,column:6}},moduleName:"katana/templates/components/video-slice.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createTextNode("        ");e.appendChild(t,r);var r=e.createElement("div");e.setAttribute(r,"id","video-player-slice-progress-indicator");var n=e.createTextNode("\n        ");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=e.childAt(t,[1]),a=new Array(1);return a[0]=e.createAttrMorph(n,"style"),a},statements:[["attribute","style",["get","indicatorPositionPercentage",["loc",[null,[32,18],[32,45]]]]]],locals:[],templates:[]}}();return{meta:{revision:"Ember@1.13.7",loc:{source:null,start:{line:1,column:0},end:{line:53,column:0}},moduleName:"katana/templates/components/video-slice.hbs"},arity:0,cachedFragment:null,hasRendered:!1,buildFragment:function(e){var t=e.createDocumentFragment(),r=e.createElement("div");e.setAttribute(r,"class","video-player-slice-parent");var n=e.createTextNode("\n  ");e.appendChild(r,n);var n=e.createElement("div");e.setAttribute(n,"class","video-player-slice-wrapper");var a=e.createTextNode("\n    ");e.appendChild(n,a);var a=e.createElement("div");e.setAttribute(a,"class","video-player-slice-controls left");var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createElement("a");e.setAttribute(l,"class","video-player-slice-delete"),e.setAttribute(l,"href","#");var i=e.createTextNode("\n        ");e.appendChild(l,i);var i=e.createComment("");e.appendChild(l,i);var i=e.createTextNode("\n      ");e.appendChild(l,i),e.appendChild(a,l);var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createComment("");e.appendChild(a,l);var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createComment("");e.appendChild(a,l);var l=e.createTextNode("\n    ");e.appendChild(a,l),e.appendChild(n,a);var a=e.createTextNode("\n    ");e.appendChild(n,a);var a=e.createElement("div"),l=e.createTextNode("\n");e.appendChild(a,l);var l=e.createComment("");e.appendChild(a,l);var l=e.createTextNode("    ");e.appendChild(a,l),e.appendChild(n,a);var a=e.createTextNode("\n    ");e.appendChild(n,a);var a=e.createElement("div");e.setAttribute(a,"class","video-player-slice-controls right");var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createComment("");e.appendChild(a,l);var l=e.createTextNode("\n      ");e.appendChild(a,l);var l=e.createComment("");e.appendChild(a,l);var l=e.createTextNode("\n    ");e.appendChild(a,l),e.appendChild(n,a);var a=e.createTextNode("\n  ");e.appendChild(n,a),e.appendChild(r,n);var n=e.createTextNode("\n");e.appendChild(r,n),e.appendChild(t,r);var r=e.createTextNode("\n");return e.appendChild(t,r),t},buildRenderNodes:function(e,t,r){var n=e.childAt(t,[0,1]),a=e.childAt(n,[1]),l=e.childAt(a,[1]),i=e.childAt(n,[3]),o=e.childAt(n,[5]),d=new Array(10);return d[0]=e.createElementMorph(l),d[1]=e.createMorphAt(l,1,1),d[2]=e.createMorphAt(a,3,3),d[3]=e.createMorphAt(a,5,5),d[4]=e.createAttrMorph(i,"class"),d[5]=e.createAttrMorph(i,"style"),d[6]=e.createElementMorph(i),d[7]=e.createMorphAt(i,1,1),d[8]=e.createMorphAt(o,1,1),d[9]=e.createMorphAt(o,3,3),d},statements:[["element","action",["delete",["get","slice",["loc",[null,[7,26],[7,31]]]]],[],["loc",[null,[7,8],[7,33]]]],["inline","fa-icon",["trash"],[],["loc",[null,[9,8],[9,27]]]],["inline","video-slice-adjuster",[],["direction","left","action","changePosition","icon","fa-arrow-left","title",["subexpr","@mut",[["get","adjustPositionTitle",["loc",[null,[15,14],[15,33]]]]],[],[]]],["loc",[null,[11,6],[16,8]]]],["inline","video-slice-adjuster",[],["direction","left","action","changeSize","icon","fa-minus","title",["subexpr","@mut",[["get","adjustSizeTitle",["loc",[null,[21,14],[21,29]]]]],[],[]]],["loc",[null,[17,6],[22,8]]]],["attribute","class",["concat",["video-player-slice\n        ",["subexpr","if",[["subexpr","eq",[["get","slice",["loc",[null,[27,17],[27,22]]]],["get","currentSlice",["loc",[null,[27,23],[27,35]]]]],[],["loc",[null,[27,13],[27,36]]]],"active"],[],["loc",[null,[27,8],[27,47]]]]]]],["attribute","style",["get","style",["loc",[null,[28,14],[28,19]]]]],["element","action",["play",["get","slice",["loc",[null,[25,22],[25,27]]]]],[],["loc",[null,[25,6],[25,29]]]],["block","if",[["get","active",["loc",[null,[29,12],[29,18]]]]],[],0,null,["loc",[null,[29,6],[35,13]]]],["inline","video-slice-adjuster",[],["direction","right","action","changeSize","icon","fa-plus","title",["subexpr","@mut",[["get","adjustSizeTitle",["loc",[null,[42,14],[42,29]]]]],[],[]]],["loc",[null,[38,6],[43,8]]]],["inline","video-slice-adjuster",[],["direction","right","action","changePosition","icon","fa-arrow-right","title",["subexpr","@mut",[["get","adjustPositionTitle",["loc",[null,[48,14],[48,33]]]]],[],[]]],["loc",[null,[44,6],[49,8]]]]],locals:[],templates:[e]}}())}),define("katana/config/environment",["ember"],function(e){var t="katana";try{var r=t+"/config/environment",n=e["default"].$('meta[name="'+r+'"]').attr("content"),a=JSON.parse(unescape(n));return{"default":a}}catch(l){throw new Error('Could not read config from meta tag with name "'+r+'".')}}),runningTests?require("katana/tests/test-helper"):require("katana/app")["default"].create({name:"katana",version:"v1.0"});