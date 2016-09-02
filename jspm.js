"use strict"
var github = require('./controllers/githubInterface');
var pkgdb = require('./controllers/pkgdb');
var builder = require('./controllers/builder');

var config = require('./config.json');

var logger = function logger(data){
	console.log(this.method+this.timesCalled+" data="+data);

	if(!Number.isNaN(this.timesCalled)){
		this.timesCalled++;
	}else{
		this.timesCalled=0;
	}

	return data;
}
function search(pkg){
	return github.search(pkg);
}
function add(pkgrepo, pkgname){
	var boundLog = logger.bind({method:"/jspm/add", timesCalled:0});
	var pkgaddedQ = github.add(pkgrepo, pkgname)
		.then(boundLog)
		.then(function fufilled(){
			//promise
			return pkgdb.add_pkg({
				name:pkgname,
				repo: pkgrepo,
				source_location: config.packageRoot+config.build.sourceDir+pkgname,
				add_date: new Date()
			});
		})
		.then(boundLog)
		.catch(function catcher(err){
			console.log("/jspm/add/catcher err "+err.stack);
		});
	return Promise.resolve(pkgaddedQ);
}

function remove(pkgname){
	//remove from builds 
	//remove symbolic links
		//paths
		//libs
	//rm -r sources/<pkgname>
	//rm build-scripts/<pkgname>.build
	//remove from pkg-database

	//varnameQ means that it is a question
	var unclonePkg = function unclone(){ 
		return Promise.resolve(github.unadd(pkgname))
	}
	var pkgdbRemove = function pkgRemoveFunc(){
		return Promise.resolve( pkgdb.remove_pkg(pkgname));
	}

	unclonePkg()
		.then(pkgdbRemove)
		//.then(unclonePkg) //having issues
		.then(function fufilled(){
			console.log(`removed ${pkgname} correctly`);
		})
		.catch(function(err){
			console.log(err.stack);
		});
}
function build(pkgname){
	var boundLog = logger.bind({method:"/jspm/build", timesCalled:0});
	var configure = function configurePkg(){
		return Promise.resolve(builder.configure(pkgname));
	}
	var build = function buildpkg(){
		return Promise.resolve(builder.run("build",pkgname));
	}
	var install = function installpkg(){
		return Promise.resolve(builder.run("install",pkgname));
	}
	var link = function linkpkg(){
		return Promise.resolve(builder.link(pkgname));
	}
	configure()
		.then(boundLog)
		.then(build)
		.then(boundLog)
		.then(install)
		.then(boundLog)
		.then(link)
		.then(boundLog)
		.catch(function(err){
			console.log(err.stack);
		});
	
}

//looks at cmdline args and runs the commands
function main(){
	//process.argv contains [0] node [1] prog name [2...] arguments
	//command looks like 
	//		jspm search pkgname

	var command = process.argv[2];
	var args = process.argv.slice(3);
	switch(command){
		case 's':
		case 'search': 
			//search for pkg
			search(args[0]);
			break;

		case 'a':
		case 'add': 
		case 'g':
		case 'get':
			//add repo
			add(args[0],args[1]);
			break;

		case 'b':
		case 'build':
			//build pkg
			build(args[0]);
			break;

		case 'u':
		case 'update':
			//update pkg or all
			break;

		case 'r':
		case 'remove':
			//remove pkg
			remove(args[0]);
			break;

		case '-h':
		case 'h':
		case 'help':
		default:
			//print help
			console.log("this is the help page, fill me in");
			console.log("jspm [a,add,g,get] gitUrl name : get package source from gitUrl and name it name");
			console.log("jspm [r,remove] name : remove package by name");
			console.log("jspm [b,build] name : build package by name");
			break;
	}
}


main();
