# binary-mock-websocket

Websocket mock creator for binary applications

## Installation 

```
npm install --save-dev binary-mock-websocket
```
## Build calls.js 
This gulp file will read the calls from calls.js and will create the websocket mock files in the dist folder.
```
var gulp = require('gulp');
var mock = require('binary-mock-websocket');

gulp.task('build', function() {
    return gulp.src('./calls.js', {read: false})
        .pipe(mock())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], function(){
    process.exit(0);
});
```
## Output
```
dist/
├── database.js
└── websocket.js
```

## Usage with binary-live-api
```
var LiveApi = require('binary-live-api').LiveApi;
var ws = require('./dist/websocket');
var api = new LiveApi({websocket: ws});
api.getActiveSymbolsBrief().then(function(response){
    console.log(response);
});
```

## Example calls.js 
```
module.exports = {
    history: {
        // errors: {}
        // responses: {}
        subscriptions: {
            r_100: {
                func: function r_100(api){
                    api.getTickHistory('R_100', {
                        "end": "latest",
                        "count": 600,
                        "subscribe": 1
                    });
                },
                maxResponse: 4, // optional
                stopCondition: function(data){ // optional
                    // return true to stop saving the stream 
                    return false;
                },
            }
        },
    },
    authorize: {
        // subscriptions: {}
        // responses: {}
        errors: {
            InvalidToken: {
                func: function InvalidToken(api){
                    api.authorize('FakeToken');
                }
            }
        },
    },
    active_symbols: {
        // subscriptions: {}
        // errors: {}
        responses: {
            allActiveSymbols: {
                func: function allActiveSymbols(api) {
                    api.getActiveSymbolsBrief();
                }
            }
        }
    },
};
```
