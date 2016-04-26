"use strict"
var config = require("../config.json");
var db = require(config.jspmRoot+config.dbFile);
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
exports.remove_pkg=function(pkgname){
	var found =false;
	for(let i=0;i<db.pkgs.length;i++){
		if(db.pkgs[i].name==pkgname){
			db.pkgs.splice(i,1);
			found = true;
			break;
		}
	}

	return new Promise(function(resolve,reject){
		if(found){
			db.save()
				.then(
					resolve
				);
		}else{
			reject(new Error(`pkg ${pkgname} not found in pkgdb`));
		}
	});
}
