#isomorphine

Makes it possible to use the same [mongoose](http://mongoosejs.com/) models both on the client and server side.
The goal is to avoid having to define the data models more than once, or having to use different APIs to work with the database on the client and server side,
or having to implement an API to work with the database.
All that has to be provided to the client side are the model names and the REST API address, and the rest happens transparently.
This is similar to what [Meteor](https://www.meteor.com/) does with mongodb.

The REST API is implemeneted as an [express 4](http://expressjs.com/) router.

### Example

Defining the data model the server side:
```
var TestModel = mongoose.model('TestModel', new mongoose.Schema({
  foo: Number,
  bar: String
}));

TestModel.create({
  foo: 42,
  bar: 'baz'
});
```

Running the REST API:

```
var Router = require('isomorphine/router');

express()
  .use(Router())
  .listen();
  .
```

Using the model on the client side:
```
// the server should somehow export Object.keys(mongoose.models) to the client
var models = require('isomorphine/models')(['TestModel'], 'http://localhost:3000/');

models.TestModel
  .find({
    foo: 42
  })
  .exec(function(err, data) {
    if (err) {
      return console.error(err);
    }

    console.log(data); // returns { foo: 42, bar: 'baz' }
  });
```

### Planned features

 * User authentication
 * Model- and maybe document-level ACL