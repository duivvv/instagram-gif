var request = require('request');
var Canvas = require('canvas');
var Image = Canvas.Image;
var _ = require('lodash');
var GIFEncoder = require('gifencoder');

var APIHelper = require('./modules/APIHelper.js');

var fs = require('fs');

var images = [];

function _init_encoder(params, width, height){

	var encoder = new GIFEncoder(width, height);
	encoder.createReadStream().pipe(fs.createWriteStream(params.path));

	encoder.start();
	encoder.setRepeat(params.repeat);
	encoder.setDelay(params.delay);
	encoder.setQuality(params.quality);

	return encoder;
}

function _init_canvas(width, height){
	var canvas = new Canvas(width, height);
	var ctx = canvas.getContext('2d');
	return ctx;
}

function _handle_results(params, results, cb){

	images = [];

	this.width = results[0].images[params.size].width;
	this.height = results[0].images[params.size].height;

	this.converted = 0;

	this.encoder = _init_encoder(params, this.width, this.height);
	this.ctx =  _init_canvas(this.width, this.height);

	for(var i = 0;i < results.length;i++){

			var url = results[i].images[params.size].url;

			request({url: url, encoding: null}, (function (error, response, body) {

				var img = new Canvas.Image();

				img.onload = (function(){
					this.converted ++;
					this.ctx.drawImage(img, 0, 0);
					this.encoder.addFrame(this.ctx);
					if(results.length === this.converted){
						this.encoder.finish();
						return cb(null, {path: params.path});
					}
				}).bind(this);

				img.onerror = (function(error){
					return cb(error);
				}).bind(this);

				img.src = new Buffer(body, 'binary');

			}).bind(this));

	}

}

function _init_params(params){

	params = params || {};
	params.path = params.path || false;

	if(!params.path){
		throw new Error("please provide a path");
	}

	params.repeat = parseInt(params.repeat) || 0;
	params.delay = parseInt(params.delay) || 300;
	params.username = params.username || false;
	params.count = parseInt(params.count) || 20;
	params.tag = params.tag || false;
	params.quality = parseInt(params.quality) || 10;

	if(!params.username && !params.tag){
		throw new Error("please provide a search tag and/or a username");
	}

	switch(params.size){
		case "thumb":
			params.size = "thumbnail";
		break;
		case "small":
			params.size = "low_resolution";
		break;
		case "full":
		default:
			params.size = "standard_resolution";
		break;
	}

	return params;

}

function InstagramGIF(config){

	if(!config.access_token){
		throw new Error("please provide an access_token");
	}
	if(!config.client_id){
		throw new Error("please provide a client_id");
	}
	if(!config.client_secret){
		throw new Error("please provide a client_secret");
	}

	this.api = new APIHelper({
		access_token: config.access_token,
		client_id: config.client_id,
		client_secret: config.client_secret
	});

}

InstagramGIF.prototype.create = function(params, cb){

	params = _init_params(params);

	if(params.tag){

		this.api.search_by_tag(params, (function(error, params, results){

			if(error){
				return cb(error);
			}

			if(results){

				if(results.length === 0){
					return cb(new Error("no images found"));
				}

				_handle_results(params, results, cb);

			}

		}).bind(this));

	}else if(params.username){

		this.api.search_by_user(params, (function(error, params, results){

			if(error){
				return cb(error);
			}

			if(results){

				if(results.length === 0){
					return cb(new Error("no images found"));
				}

				_handle_results(params, results, cb);

			}

		}).bind(this));


	}

};

module.exports = InstagramGIF;
