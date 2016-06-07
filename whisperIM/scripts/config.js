requirejs.config({
    baseUrl: '/im/www/v1/scripts/lib',
    paths: {
        "zepto": "zepto/zepto.min",
        "mobilekit": "mobilekit/mobileKit.min",
        'app': '../app' 
    },
    shim: {
        "zepto": {
            exports: "zepto"
        },
        "mobilekit": {
            deps: ["zepto"],
            exports: "mobilekit"
        }
      
    }
    ,
    map: {

    },
    waitSeconds: 30,
   
    urlArgs: "v=" + (new Date()).getTime(),
    enforceDefine: false
});