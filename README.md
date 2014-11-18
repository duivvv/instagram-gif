[![npm version](http://img.shields.io/npm/v/instagram-gif.svg?style=flat)](https://www.npmjs.org/package/instagram-gif)

# instagram-gif

Search Instagram and create a GIF with the results

## install

With [npm](http://npmjs.org) do:

```
npm install --save instagram-gif
```

### Example

```javascript

var InstagramGIF = require("instagram-gif");

var instagram_gif = new InstagramGIF({
	access_token: <access_token>,
	client_id: <client_id>,
	client_secret: <client_secret>
});

instagram_gif.create({
	path: "./summer.gif",
	tag: "summer",
	delay: 200,
	count: 10
}, handler);

function handler(err, result){
	if(err){
		console.log(err.msg);
		return;
	}
	console.log(result.path);
}
```

## Parameters

### path [required]

path where GIF file should be saved

    Type: 'String'


### size [optional]

size of the file

    Type: 'String'
    options: 'small|thumb|full'
    default: 'full'

### username [optional]

which username to return media, filter on

    Type: 'String'


### tag [optional]

search media for a tag,
add username for extra filter on tag

    Type: 'String'


### count [optional]

amount of pictures to load

    Type: 'Number'
    default: 300


### repeat [optional]

frame to start repeat after end

    Type: 'Number'
    default: 0


### delay [optional]

delay between each frame

    Type: 'Number'
    default: 300


### quality [optional]

frame quality

    Type: 'Number'
    default: 10


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
