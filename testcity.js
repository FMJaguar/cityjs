var async = require('async');
var _u = require('underscore');

var populationSize = 10000;

var Person = function(_id){
	this.id = _id;
	this.homeCity = null;
};

Person.prototype.handleStormWarning = function(cb){
		var action = (this.id % 3 === 0) ? true : false //Am I moving out of town?
		setTimeout(function(){cb(null, action);}, 1000); // thinking about this major decision, i want to be sure!
	};
	
var City = function(_name){
	this.name = _name;
	this.startTime = new Date().getTime();
	this.population = [];
};

City.prototype.addPerson = function(p){
	this.population.push(p);
	p.homeCity = this;
};

City.prototype.elapsedTime = function(){
	return (new Date().getTime() - this.startTime) / 1000.00
};

City.prototype.stormWarning = function(p){
	var self = this;
	var fns = [];
	_u.each(self.population, function(p){
		fns.push(function(cb){p.handleStormWarning(cb);});
	});
	async.parallel(fns,function(err,results){
		if (err){
			console.log('Warning Failed');
			return;
		} 
		if (results.length !== populationSize){
			console.log('Everyone did not respond, ' + results.count() + ' responses');
			return;
		}
		console.log(results.length + ' responses in ' + self.elapsedTime() + ' seconds');
		console.log(_u.compact(results).length + ' have moved away');
	})
};

city = new City('Test City');
console.log(city);
for(var i = 0; i < populationSize; i++){
	var p = new Person(i);
	city.addPerson(p);
}
city.stormWarning();