"use strict"
var simpleGet = require('simple-git');
var https = require('https');

exports.search= function(pkg){
	//same as "searching for "+pkg
	console.log(`searching for ${pkg}`);
	https.get({headers:{'User-Agent':'jspm'},host:"api.github.com", path:`/search/repositories?q=${pkg}`},
		function(res){
			res.on('data',function(chunk){
				console.log(chunk.toString());
				//data = JSON.parse(chunk);
			});
		}
	);




}
