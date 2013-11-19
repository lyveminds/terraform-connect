terraform-connect
=================

use the [terraform](https://github.com/sintaxi/terraform) asset pipeline as connect middleware

Extracted with some minor modifications from the [harp server](https://github.com/sintaxi/harp) middleware.

## Usage

```javascript

var express      = require('express'),
    TerraConnect = require('terraform-connect');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(TerraConnect.pipeline(path.join(__dirname, 'public'), { root: './public' }));
```

The `options` object is there to future-proof the `pipeline()` call in case it ever needs more than just the asset directory path.

## License

MIT.
