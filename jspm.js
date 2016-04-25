"use strict"
var github = require('./controllers/githubInterface');
var pkgdb = require('./controllers/pkgdb');
var config = require('./config.json');

function search(pkg){
	return github.search(pkg);
}
function add(pkgrepo, pkgname){
	var pkgadded = github.add(pkgrepo, pkgname)
		.then(function fufilled(){
			//promise
			return pkgdb.add_pkg({
				name:pkgname,
				repo: pkgrepo,
				file_location: config.jspmroot+config.sourceDir+pkgname
			});
		})
		.catch(function catcher(err){
			console.log(err.stack);
		});
	return Promise.resolve(pkgadded);
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
