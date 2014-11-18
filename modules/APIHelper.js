var _ = require('lodash');
var api = require('instagram-node').instagram();

function APIHelper(config){

	api.use({
		access_token: config.access_token
	});

	api.use({
		client_id: config.client_id,
		client_secret: config.client_secret
	});

}

APIHelper.prototype.search_by_tag = function(params, cb){

	var api_params = _.pick(params, ["count", "max_id"]);

	api.tag_media_recent(params.tag, api_params, (function(err, results, pagination, remaining, limit){

		_handle_results.call(this, err, params, results, cb, pagination, this.search_by_tag);

	}).bind(this));

}

function _handle_results(err, params, results, cb, pagination, self){

	if(err){
		return cb(err);
	}

	if(params.username && params.tag){
		results = _.filter(results, function(result){
			return result.user.username === params.username;
		});
	}

	if(!this.results){
		this.results = results;
	}else{
		this.results = _.union(this.results, results);
	}

	this.results = _.uniq(this.results, function(result){
		return result.id;
	});

	if(this.results.length < params.count && pagination.next_max_id){
		params.max_id = pagination.next_max_id;
		self.call(this, params, cb);
		return;
	}else{
		return cb(null, params, _.first(this.results, params.count));
	}

}

function _user_media_recent(params, cb){

	var api_params = _.pick(params, ["count", "max_id"]);

	api.user_media_recent(params.user_id, api_params, (function(err, results, pagination, remaining, limit){

		_handle_results.call(this, err, params, results, cb, pagination, _user_media_recent);

	}).bind(this));

}

APIHelper.prototype.search_by_user = function(params, cb){

	api.user_search(params.username, (function(err, users, remaining, limit){

		if(err){
			return cb(err);
		}

		if(users){

			params.user_id = users[0].id;

			_user_media_recent(params, (function(error, params, data){

				if(error){
					return cb(error);
				}
				if(data){
					return cb(null, params, data);
				}

			}).bind(this));

		}

	}).bind(this));

}

module.exports = APIHelper;
