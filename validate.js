var fs = require('fs');
Array.prototype.diff = function(arr2) {
    //return this.filter(function(i) {return a.indexOf(i) < 0;});
    return this.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !this.includes(x)));
};
Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) === -1;
    });
};
if(process.argv.length < 3){
	console.error("Invalid filename!");
}else{
	var base = JSON.parse(fs.readFileSync("en-US.json", 'utf8'));
	var test = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
	var missingkeys = [];
	var missingargs = [];
	Object.keys(base).forEach(function(key){
	  if(!Object.keys(test).includes(key)){
	  	missingkeys.push(key);
	  }else{
	  	var baseargs = base[key].match(/\{.?\}/g);
	  	var testargs = test[key].match(/\{.?\}/g);
	  	if(baseargs == null && testargs != null){
	  		missingargs.push(key + " has invalid args: " + testargs.join(", ") + "\nExpected: none");
	  	}else if(testargs == null && baseargs != null){
	  		missingargs.push(key + " has no args, expected: " + baseargs.join(", "));
	  	}else if(baseargs != null && testargs !=null && baseargs.diff(testargs).length > 0){
	  		missingargs.push(key + " has invalid args: " + testargs.join(", ") + "\nExpecting: " + baseargs.join(", "));
	  	}
	  }
	});
	if(missingkeys.length > 0){
		console.error("Missing keys: " + missingkeys.join(", "));
	}
	if(missingargs.length > 0){
		console.error(missingargs.join("\n"));
	}
}