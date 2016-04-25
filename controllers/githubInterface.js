"use strict"
var simpleGitFactory = require('simple-git');
var https = require('https');
var config = require('../config.json');
var pkgdb = require('../controllers/pkgdb');


var gitter = simpleGitFactory(config.sourceDir);

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

		gitter.clone(repo, pkgname)
			.then(function(err){
				if(err){
					reject(err);
				}else{
					resolve();
				}
			});
	});
}
