terraform-connect
=================

use the [terraform](https://github.com/sintaxi/terraform) asset pipeline as connect middleware

Extracted with some minor modifications from the [harp server](https://github.com/sintaxi/harp) middleware.

[![Build Status](https://secure.travis-ci.org/ceejbot/light-cycle.png)](http://travis-ci.org/lyveminds/terraform-connect)  
[![Dependencies](https://david-dm.org/ceejbot/light-cycle.png)](https://david-dm.org/lyveminds/terraform-connect)

[![NPM](https://nodei.co/npm/light-cycle.png)](https://nodei.co/npm/lterraform-connect/)

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
