var rl = require('readline');
const fs = require('fs');

var r = rl.createInterface({input: process.stdin, output: process.stdout});
function addKeyAndMsg(key, msg){
	r.close()
	fs.readdirSync(__dirname).forEach(file => {
  		if(file.endsWith(".json")){
  			var myJson = JSON.parse(fs.readFileSync(__dirname + '/' + file, 'utf8'));
  			if(Object.keys(myJson).includes(key)){
  				console.error("That key exists already!");
  				process.exit(1);
  			}
  			Object.keys(myJson).forEach((key) =>{
  				if(myJson[key] == msg){
  					console.error("That message exists already!");
  					process.exit(1);
  				}
  			});
  			myJson[key] = msg;
  			fs.writeFileSync(__dirname + '/' + file, JSON.stringify(myJson, null, 2));
  		}
	});
	console.log("Done.");
	process.exit(0);
}
function askForMsg(key){
	r.question('What is the new language statement? ', async (potentialMsg) => {
		if(!potentialMsg.match(/^.+$/)){
			console.log("Invalid message!");
			await askForMsg(key);
		}else{
			await addKeyAndMsg(key, potentialMsg);
		}
	});
}
function askForKey(){
	r.question('What is the new language key? ', async (potentialKey) => {
		if(!potentialKey.match(/^[A-Z_]+$/)){
			console.log("Invalid key! Must be all uppercase, with only underscores like this: EXAMPLE_KEY");
			await askForKey();
		}else{
			askForMsg(potentialKey);
		}
	});
}

const main = async () => {
	  await askForKey();
}

main()