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


```javascript

// ...

instagram_gif.create({
	path: "./duivvv.gif",
	username: "duivvv"
}, handler);

```

    Type: `String`

### username [optional]

which username to return media, filter on

```javascript

// ...

instagram_gif.create({
	path: "./duivvv.gif",
	username: "duivvv"
}, handler);

```

    Type: `String`

### tag [optional]

search media for a tag,

```javascript

// ...

instagram_gif.create({
	path: "./summer.gif",
	tag: "summer"
}, handler);

```

add username for extra filter on tag

```javascript

// ...

instagram_gif.create({
	path: "./summer.gif",
	tag: "summer",
	username: "duivvv"
}, handler);

```

### count [optional]

amount of pictures to load (can return less if filtering is applied)

```javascript

// ...

instagram_gif.create({
	path: "./duivvv.gif",
	username: "duivvv",
	count: 10
}, handler);

```

    Type: `Number`
    default: 300

### repeat [optional]

frame to start repeat after end

```javascript

// ...

instagram_gif.create({
	path: "./duivvv.gif",
	username: "duivvv",
	repeat: 2
}, handler);

```

    Type: `Number`
    default: 0

### delay [optional]

delay between each frame

```javascript

// ...

instagram_gif.create({
	path: "./duivvv.gif",
	username: "duivvv",
	delay: 100
}, handler);

```

    Type: `Number`
    default: 300

### quality [optional]

frame quality

```javascript

// ...

instagram_gif.create({
	path: "./duivvv.gif",
	username: "duivvv",
	quality: 3
}, handler);

```

    Type: `Number`
    default: 10

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
