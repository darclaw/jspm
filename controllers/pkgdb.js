"use strict"
var config = require("../config.json");
var db = require(config.jspmroot+config.dbFile);
var fs = require("fs");
var jsonfile =require("jsonfile");

jsonfile.readFileSync(config.dbFile);

function save(){
	return new Promise(function(resolve,reject){
		jsonfile.writeFile(config.dbFile, db,
			function writeCB(err){
				if(err){
					reject(err);
				}else{
					resolve();
				}
		});
	});
}
db.save = save;

exports.add_pkg=function(pkg){
		db.pkgs.push(pkg);
		return Promise.resolve(db.save()); //promise
}
