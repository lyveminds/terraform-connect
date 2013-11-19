/*global describe:true, it:true, before:true, after:true */

var
    demand      = require('must'),
    path        = require('path'),
    sinon       = require('sinon'),
    Terramiddle = require('../')
    ;

var mockAssets = path.join(__dirname, 'mocks');

var responseAPI =
{
    setHeader: function() { },
    end: function() {}
};

describe('terraform-connect', function()
{
    it('the module exports a `pipeline` function', function()
    {
        Terramiddle.must.have.property('pipeline');
        Terramiddle.pipeline.must.be.instanceof(Function);
    });

    it('pipeline() demands an options object', function()
    {
        function shouldThrow() { return Terramiddle.pipeline(); }
        shouldThrow.must.throw(/options object/);
    });

    it('pipeline() demands a root path option', function()
    {
        function shouldThrow() { return Terramiddle.pipeline({}); }
        shouldThrow.must.throw(/path string/);
    });

    it('pipeline() returns a function', function()
    {
        var result =  Terramiddle.pipeline({ root: mockAssets });
        result.must.be.instanceof(Function);
    });

    it('middleware calls setHeader & end as expected', function()
    {
        var middle =  Terramiddle.pipeline({ root: mockAssets });

        var spy = sinon.spy();
        var mock = sinon.mock(responseAPI);
        mock.expects('setHeader').twice();
        mock.expects('end').once();

        middle({ url: '/markdown.md' }, responseAPI, spy);

        mock.verify();
        spy.called.must.equal(false);
        mock.restore();
    });

    it('middleware renders markdown', function()
    {
        var middle =  Terramiddle.pipeline({ root: mockAssets });

        var spy = sinon.spy();
        var mock = sinon.mock(responseAPI);
        mock.expects('end').withArgs('<p>I am a markdown document.</p>\n<p>I have paragraphs.</p>\n');

        middle({ url: '/markdown.md' }, responseAPI, spy);

        mock.verify();
        mock.restore();
    });

    it('middleware renders jade', function()
    {
        var middle =  Terramiddle.pipeline({ root: mockAssets });

        var spy = sinon.spy();
        var mock = sinon.mock(responseAPI);
        mock.expects('end').withArgs('<p>I am a jade template.</p><p>I have paragraphs.</p>');

        middle({ url: '/template.jade' }, responseAPI, spy);

        mock.verify();
        mock.restore();
    });

    it('middleware renders less', function(done)
    {
        var middle =  Terramiddle.pipeline({ root: mockAssets });
        var spy = sinon.spy();

        var response =
        {
           setHeader: function() { },
           end: function(data)
           {
                spy.called.must.equal(false);
                data.must.equal('.foo{font-weight:bold}.foo .bar{color:red}');
                done();
           }
        };

        middle({ url: '/style.css' }, response, spy);
    });

});
