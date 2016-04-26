"use strict"
var github = require('./controllers/githubInterface');
var pkgdb = require('./controllers/pkgdb');
var config = require('./config.json');

function search(pkg){
	return github.search(pkg);
}
function add(pkgrepo, pkgname){
	var pkgaddedQ = github.add(pkgrepo, pkgname)
		.then(function fufilled(){
			//promise
			return pkgdb.add_pkg({
				name:pkgname,
				repo: pkgrepo,
				file_location: config.jspmRoot+config.sourceDir+pkgname,
				add_date: new Date()
			});
		})
		.catch(function catcher(err){
			console.log(err.stack);
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
		.then(function fufilled(){
			console.log(`removed ${pkgname} correctly`);
		})
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
			search(ars[0]);
			break;

		case 'a':
		case 'add': 
			//add repo
			add(args[0],args[1]);
			break;

		case 'b':
		case 'build':
			//build pkg
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
			break;
	}
}


main();
