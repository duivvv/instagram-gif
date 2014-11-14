var request = require('request');
var api = require('instagram-node').instagram();
var Canvas = require('canvas');
var Image = Canvas.Image;
var _ = require('lodash');
var GIFEncoder = require('gifencoder');
var Imagemin = require('imagemin');

var fs = require('fs');

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
	api.use({
		access_token: config.access_token
	});
	api.use({
		client_id: config.client_id,
		client_secret: config.client_secret
	});
}

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

	this.width = results[0].images.standard_resolution.width;
	this.height = results[0].images.standard_resolution.height;

	this.converted = 0;

	this.encoder = _init_encoder(params, this.width, this.height);
	this.ctx =  _init_canvas(this.width, this.height);

	if(params.tag && params.username){
		results = _.filter(results, function(result){
			return result.user.username === params.username;
		});
	}

	for(var i = 0;i < results.length;i++){

			var url = results[i].images.standard_resolution.url;

			request({url: url, encoding: null}, (function (error, response, body) {

				var img = new Canvas.Image();

				img.onload = (function(){
					this.converted ++;
					this.ctx.drawImage(img, 0, 0);
					this.encoder.addFrame(this.ctx);
					if(results.length === this.converted){
						this.encoder.finish();
						var imagemin = new Imagemin().use(Imagemin.gifsicle());
						imagemin.src(params.path);
						imagemin.dest(".");
						imagemin.run(function(err, files){
					    if(err) {
					      throw err;
					    }
							return cb(null, {path: params.path});
						})
					}
				}).bind(this);

				img.onerror = (function(error){
					return cb({msg: error});
				}).bind(this);

				img.src = new Buffer(body, 'binary');

			}).bind(this));

	}

}

InstagramGIF.prototype.create = function(params, cb){

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

	if(params.tag){

		api.tag_media_recent(params.tag, {count: params.count}, (function(err, results, pagination, remaining, limit) {

			if(err){
				return cb({msg: err});
			}

			if(results && results.length > 0){
				_handle_results.call(this, params, results, cb);
			}

		}).bind(this));

	}else if(params.username){

		api.user_search(params.username, function(err, users, remaining, limit){

			if(err){
				return cb({msg: err});
			}

			api.user_media_recent(users[0].id, {count: params.count}, (function(err, results, pagination, remaining, limit) {

				if(err){
					return cb({msg: err});
				}

				if(results && results.length > 0){
					_handle_results.call(this, params, results, cb);
				}

			}).bind(this));

		});



	}

};

module.exports = InstagramGIF;
