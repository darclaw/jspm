"use strict"
//var simpleGitFactory = require('simple-git');
var Git = require("nodegit");
var https = require('https');
var fs = require('fs');
var rimraf = require('rimraf');

var config = require('../config.json');
var pkgdb = require('../controllers/pkgdb');

var sourceDirStr = config.packageRoot+config.build.sourceDir;


//var gitter = simpleGitFactory(sourceDirStr);

exports.search= function(pkg){
	//same as "searching for "+pkg
	console.log(`searching for ${pkg}`);
	https.get({headers:{'User-Agent':'jspm'},host:"api.github.com", path:`/search/repositories?q=${pkg}`},
		function(res){
			var data;
			var shown=false;
			res.on('data',function(chunk){
				data += chunk;
			});
			res.on('end',function(){
				data= JSON.parse(data);
				for(let i=0;i<data.items.length;i++){
					var item = data.items[i];
					console.log("name: "+item.name);
					console.log("repository: "+item.html_url);
					console.log("description: "+item.description);
					console.log("");
				}
			});
		}
	);
}

exports.add = function(repo, pkgname){
	return new Promise(function(resolve,reject){
		console.log(`adding ${repo}`);

		Git.Clone(repo, sourceDirStr+pkgname).then(resolve);
	});
}
exports.unadd= function(pkgname){
	var unaddP = new Promise(function(resolve,reject){
		rimraf(sourceDirStr+pkgname,{disableGlob:true}, function(err){
			if(err){
				reject(err);
			}else{
				resolve();
			}
		});
	});

	return unaddP;

}
