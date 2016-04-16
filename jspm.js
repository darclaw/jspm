"use strict"
var github = require('./controllers/githubInterface');

//looks at cmdline args and runs the commands
function main(){
	//process.argv contains [0] node [1] prog name [2...] arguments
	//command looks like 
	//		jspm search pkgname

	var command = process.argv[2];
	var commandArg = process.argv[3];
	switch(command){
		case 's':
		case 'search': 
			//search for pkg
			github.search(commandArg);
			break;

		case 'a':
		case 'add': 
			//add repo
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
