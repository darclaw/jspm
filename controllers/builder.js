"use strict"
var config = require('../config.json');
var exec = require('child-process-promise').exec;
var fs = require('fs');
//const jsonfile = require('jsonfile');


var buildScriptDirStr = config.packageRoot+config.build.buildScriptRoot;
var sourceDirStr = config.packageRoot+config.build.sourceDir;

//may want to add removing the required file from cache
require.async = function(filename, callback) {
	return new Promise(function(resolve,reject){
		fs.readFile(filename, 'utf8', function(err, content) {
			if (err){ reject(err);}
			if(!content){reject(new Error("bad file name"));}
			module._compile(content, filename);

			// this require call won't block anything because of caching
			if(callback){
				callback(null,filename);
			}
			resolve(require(filename));
		});
	});
}


//use buildscripts/pkgname.build.json or buildscripts/default.build.json
var getBuildScript = function getBuildScript(pkgname){
	//return new Promise(function(resolve,reject){
		//jsonfile.readFile(buildScriptDirStr+pkgname+".build.json",function(err,obj){
		//	if(err){
		//		//use default build script
		//		jsonfile.readFile(buildScriptDirStr+config.build.defaultBuildScript,function(err,obj){
		//			if(err){ reject(err);}
		//			else{ resolve(obj);}
		//		});
		//	}else{
		//		resolve(obj);
		//	}
		//});
	//});
	return require.async(buildScriptDirStr+pkgname+".build.js");
}

var cdIntoBuildDirStr = function(pkgname){
	return "cd "+sourceDirStr+pkgname+" && pwd";
}
	
var run = function run(command, pkgname){
	var buildScript = {};
	var runP = getBuildScript(pkgname)
		.then(function(buildScr){
			buildScript = buildScr;
			return buildScript;
		}).then(function configure(){
			console.log("/cont/builder/config preconfig buildScript."+command+"="+buildScript[command]);
			return exec(cdIntoBuildDirStr(pkgname)+" && "+buildScript[command],
				{env:{ 
					INSTALLPREFIX : config.PREFIX, 
					INSTALLEPREFIX : config.EPREFIX, 
					LOAD: config.load }}
			);
		}).then(function(result){
			console.log("/cont/builder/config postconfig result.stdout="+result.stdout);
		});
	return runP;
}
exports.run = run;

exports.configure = function(pkgname){
	return run("configure",pkgname);
}

exports.build = function(pkgname){
	return run("build",pkgname);
}

exports.install = function(pkgname){
	return run("install",pkgname);
}

exports.link = function(pkgname){
	return run("link",pkgname);
}

