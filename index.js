var
    assert    = require('assert'),
    mime      = require('mime'),
    path      = require('path'),
    terraform = require('terraform')
    ;

function normalize(url)
{
    var base = url.split('?')[0];
    var normalized = path.normalize(base);
    if (path.sep == normalized[normalized.length - 1])
        normalized += 'index.html';

    return normalized;
}

function lookupMimeType(source)
{
    var ext = path.extname(source);

    // These are the types terraform knows how to compile
    if (['.jade', '.md', '.ejs'].indexOf(ext)  !== -1)
        return mime.lookup('html');

    if (['.less', '.styl'].indexOf(ext)  !== -1)
        return mime.lookup('css');

    return mime.lookup(source);
}

function pipeline(opts)
{
    assert(opts && (typeof opts === 'object'), 'You must pass an options object to pipeline()');
    assert(opts.root && (typeof opts.root === 'string'), 'You must pass an options object with a `root` path string field');

    var assets = path.resolve(opts.root);
    var terraformer = terraform.root(assets);

    function assetPipeline(request, response, next)
    {
        var normalizedPath = normalize(request.url);
        var priorityList = terraform.helpers.buildPriorityList(normalizedPath);
        var source = terraform.helpers.findFirstFile(assets, priorityList);

        if (!source)
            return next();

        terraformer.render(source, function(err, body)
        {
            if (err)
            {
                if (request.app.logger)
                    request.app.logger.error({ error: err.message, path: normalizedPath }, 'while rendering assset pipeline');
                return next();
            }

            if (!body)
                return next();

            var outputtype = terraform.helpers.outputType(source);
            var mimetype = lookupMimeType(outputtype);
            var charset = mime.charsets.lookup(mimetype);

            response.statusCode = 200;
            response.setHeader('Content-Type', mimetype + (charset ? '; charset=' + charset : ''));
            response.setHeader('Content-Length', body.length);
            response.end(body);
        });
    }

    return assetPipeline;
}

module.exports =
{
    normalize:      normalize,
    lookupMimeType: lookupMimeType,
    pipeline:       pipeline
};
