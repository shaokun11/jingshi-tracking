function trace(message, ...optionalParams) {
    console.log(message, ...optionalParams);
}


var api;
(function (api) {
    var A2H5 = /** @class */ (function () {
        function A2H5() {
        }

        A2H5.post = function (methondName, parameters, callBack) {
            A2H5.initRequst();
            A2H5.sentReQuest(methondName, parameters, callBack);
        };
        A2H5.initRequst = function () {
            if (A2H5.os == "iOS") {
                A2H5.sentReQuest = function (methondName, parameters, callBack) {
                    trace("sendToNative-IOS" + " -methondName=" + methondName + " -parameters=" + parameters);
                    if (!window["webkit"] || !window["webkit"].messageHandlers || !window["webkit"].messageHandlers.sendToNative) {
                        trace("sendToNative-iOS---》No docking app! ", methondName);
                    } else {
                        window["webkit"].messageHandlers.sendToNative.postMessage(methondName, parameters, callBack);
                    }
                };
            } else {
                A2H5.sentReQuest = function (methondName, parameters, callBack) {
                    trace("sendToNative-android" + " -methondName=" + methondName + " -parameters=" + parameters);
                    if (!window["JSBlockChainTracing"]) {
                        trace("sendToNative-android---》No docking app! ");
                        return;
                    } else {
                        window["JSBlockChainTracing"].callMessage(methondName, parameters, callBack);
                    }
                };
            }
        };
        A2H5.getCallbackName = function () {
            var ramdom = parseInt(Math.random() * 100000 + "");
            return 'h5os_callback_' + new Date().getTime() + ramdom;
        };
        A2H5.initWindowEvent = function () {
            window.addEventListener("message", function (e) {
                var data = JSON.parse(e.data);
            }, false);
        };

        /**
         * install App  method= "installApp" params={hashId,sourceId}
         * @param params {hashId,sourceId}
         * @param bf.code(1,2,3) callback bf({code,message,data}) code：101(downing); 102(downed);103(down err);//    201(install...);202(install err);203(install successs);
         */
        A2H5.installApp = function (params, bf) {
            return new window["Promise"](function (resolve, reject) {
                var h5OSCallbackFun = A2H5.getCallbackName();
                window[h5OSCallbackFun] = function (result) {
                    trace("installApp-result=", result);
                    if (bf)
                        bf(result);
                    // trace("result obj=",JSON.parse(result))
                    // trace("result obj query=",JSON.parse(result).query)
                    // result = result.replace(/\r/ig, "").replace(/\n/ig, "");
                    try {
                        var res = JSON.parse(result);
                        resolve(res);
                    } catch (e) {
                        reject(e);
                    }
                };
                A2H5.post('installApp', JSON.stringify(params), h5OSCallbackFun);
            });
        };
        A2H5.openApp = function () {
        };

        /**
         * get UUID  method= "getUUID"
         * @param params {uuid:"uuid"}
         * @param bf.code(6) callback bf({code,message,data}) code：601(success); 602(err);
         */
        A2H5.getUUID = function () {
            return new window["Promise"](function (resolve, reject) {
                var h5OSCallbackFun = A2H5.getCallbackName();
                window[h5OSCallbackFun] = function (result) {
                    result = result.replace(/\r/ig, "").replace(/\n/ig, "");
                    try {
                        var res = JSON.parse(result);
                        var data = res.qrResult || '';
                        resolve(res);
                    } catch (e) {
                        reject(e);
                    }
                };
                A2H5.post('getUUID', JSON.stringify({uuid: "uuid"}), h5OSCallbackFun);
            });
        };

        /**
         * openBrowserPage  method= "openBrowserPage"
         * @param path params={path}
         * code(11) 1101(success)  1102（err）
         * return {code,data,message}
         */
        A2H5.openBrowserPage = function (path) {
            return new window["Promise"](function (resolve, reject) {
                var h5OSCallbackFun = A2H5.getCallbackName();
                window[h5OSCallbackFun] = function (result) {
                    trace("openBrowserPage-result=", result);
                    // trace("result obj=",JSON.parse(result))
                    // trace("result obj query=",JSON.parse(result).query)
                    // result = result.replace(/\r/ig, "").replace(/\n/ig, "");
                    try {
                        var res = JSON.parse(result);
                        resolve(res);
                    } catch (e) {
                        reject(e);
                    }
                };
                A2H5.post('openBrowserPage', JSON.stringify({path: path}), h5OSCallbackFun);
            });
        };

        A2H5.getPoint = function () {
            return new window["Promise"](function (resolve, reject) {
                var h5OSCallbackFun = A2H5.getCallbackName();
                window[h5OSCallbackFun] = function (result) {
                    trace("OSRestart-result=", result);
                    try {
                        var res = JSON.parse(result);
                        resolve(res);
                    } catch (e) {
                        reject(e);
                    }
                };
                A2H5.post('getPoint', JSON.stringify({getPoint: "getPoint"}), h5OSCallbackFun);
            });
        };
        A2H5.getCode = function () {
            return new window["Promise"](function (resolve, reject) {
                var h5OSCallbackFun = A2H5.getCallbackName();
                window[h5OSCallbackFun] = function (result) {
                    trace("OSRestart-result=", result);
                    try {
                        var res = JSON.parse(result);
                        resolve(res);
                    } catch (e) {
                        reject(e);
                    }
                };
                A2H5.post('getCode', JSON.stringify({getCode: "getCode"}), h5OSCallbackFun);
            });
        };
        A2H5.print = function (data) {
            return new window["Promise"](function (resolve, reject) {
                var h5OSCallbackFun = A2H5.getCallbackName();
                window[h5OSCallbackFun] = function (result) {
                    trace("OSRestart-result=", result);
                    try {
                        var res = JSON.parse(result);
                        resolve(res);
                    } catch (e) {
                        reject(e);
                    }
                };
                A2H5.post('print', JSON.stringify(data), h5OSCallbackFun);
            });
        };
        A2H5.keyfn = function () {
            return new window["Promise"](function (resolve, reject) {
                var h5OSCallbackFun = A2H5.getCallbackName();
                window[h5OSCallbackFun] = function (result) {
                    trace("OSRestart-result=", result);
                    try {
                        var res = JSON.parse(result);
                        resolve(res);
                    } catch (e) {
                        reject(e);
                    }
                };
                A2H5.post('keyfn', JSON.stringify({data:"keyfn"}), h5OSCallbackFun);
            });
        };
        /**
         * os
         */
        A2H5.os = "android"; //iOS android
        return A2H5;
    }());
    api.A2H5 = A2H5;
})(api || (api = {}));


const interfaceOS = {
    post: function (path, data, backfunc, time) {
        if (time === void 0) {
            time = 10000;
        }
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', path, true);
        httpRequest.timeout = time;
        httpRequest.setRequestHeader("Content-type", "application/json");
        try {
            httpRequest.send(JSON.stringify(data));
        } catch (error) {
            trace("post-data-error=", error);
        }
        var issent = false;
        httpRequest.onload = function () {
            if (issent)
                return;
            issent = true;
            var json = JSON.parse(httpRequest.responseText);
            if (backfunc && json)
                backfunc(1, json);
        };
        httpRequest.onerror = function () {
            trace("httpRequest.onerror--=" + httpRequest.responseText);
            if (issent)
                return;
            issent = true;
            if (backfunc)
                backfunc(0, {code: 0, message: httpRequest.responseText});
        };
        httpRequest.ontimeout = function () {
            trace("httpRequest.ontimeout--=" + httpRequest.responseText);
            if (issent)
                return;
            issent = true;
            if (backfunc)
                backfunc(0, {code: 0, message: httpRequest.responseText});
        };
    },
    get: function (path, backfunc, time) {
        if (time === void 0) {
            time = 10000;
        }
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', path, true);
        httpRequest.timeout = time;
        httpRequest.setRequestHeader("Content-type", "application/json");
        try {
            httpRequest.send();
        } catch (error) {
            trace("post-data-error=", error);
        }
        var issent = false;
        httpRequest.onload = function () {
            if (issent)
                return;
            issent = true;
            var json = httpRequest.responseText;
            json = JSON.parse(json)
            if (backfunc && json)
                backfunc(1, json);
        };
        httpRequest.onerror = function () {
            trace("httpRequest.onerror--=" + httpRequest.responseText);
            if (issent)
                return;
            issent = true;
            if (backfunc)
                backfunc(0, {code: 0, message: httpRequest.responseText});
        };
        httpRequest.ontimeout = function () {
            trace("httpRequest.ontimeout--=" + httpRequest.responseText);
            if (issent)
                return;
            issent = true;
            if (backfunc)
                backfunc(0, {code: 0, message: httpRequest.responseText});
        };
    }
}

let app = new window["Vue"]({
        el: "#app",
        data: {
            js_path: "http://175.24.84.213:8083",
            showCreateOrder: false,
            showQRcode: false,
            showCZ: false,
            showCZJG: false,
            isCreate: false,
            showPrint: false,
            input_user: "admin",
            input_password: "",
            orders: [],
            curOrder: null,
            isLoading: false,
            value1: 0,
            productName: "",
            productDesc: "",
            productCategoryDesc: "",
            merchantUserId: "",
            barcodeId: "",
            isCZ: false,
            option1: [
                {text: '王玉生', value: 0},
                {text: '卢雷', value: 1},
                {text: '金伟连', value: 2},
            ],
            value2: 0,
            option2: [
                {text: '家畜', value: 0},
                {text: '家禽', value: 1},
                {text: '蔬菜', value: 2},
            ],
            value3: "",
            value4: "",
            visible: true,
            sf: [{
                "id": 1,
                "name": "北京饲养场",
                "category": 1
            }, {
                "id": 2,
                "name": "北京仓储",
                "category": 2
            }, {
                "id": 3,
                "name": "北京质检",
                "category": 3
            }],
            sflist: [],
            yhlist: [],
            yh: [
                {
                    "id": 1,
                    "merchantId": 1,
                    "realName": "段建安"
                }, {
                    "id": 2,
                    "merchantId": 1,
                    "realName": "田乐池"
                }, {
                    "id": 3,
                    "merchantId": 1,
                    "realName": "魏同化"
                }, {
                    "id": 4,
                    "merchantId": 1,
                    "realName": "贺弘伟"
                }, {
                    "id": 5,
                    "merchantId": 2,
                    "realName": "孔和平"
                }, {
                    "id": 6,
                    "merchantId": 2,
                    "realName": "彭兴发"
                }, {
                    "id": 7,
                    "merchantId": 2,
                    "realName": "江欣悦"
                }, {
                    "id": 8,
                    "merchantId": 3,
                    "realName": "康玉树"
                }, {
                    "id": 9,
                    "merchantId": 3,
                    "realName": "任飞雨"
                }, {
                    "id": 10,
                    "merchantId": 3,
                    "realName": "万英杰"
                }],
            printData: {},
            shID: "",
            yhID: "",
            curQRIndex: 0,
            czText: "检验",
            qrIsEnd: false,
            czLoading: false,
            codeMsgs:{},
            codeCallback:null,
            statu_msg:"操作成功"
        },
        created: function () {
            trace("created");
            setTimeout(()=>{
                document.getElementById("app").style.display = "block"
            },250)
            this.init();
        },
        methods: {
            init: function () {
                this.getYHCZ();




                //设置过去code 方法
                window["getCode"]= (data)=> {
                    if(this.codeCallback){
                        this.codeCallback(data);
                    }
                }

                document.onkeydown=function(event){
                    var e = event || window.event || arguments.callee.caller.arguments[0];

                    trace("code="+e.keyCode)
                    if(e.keyCode==114){
                        api.A2H5.keyfn();
                    }


                };
            },

            getYH: function (id) {
                //merchantId
                let arr = [];
                this.yh.map((item, index) => {
                    if (item.merchantId == id) {
                        arr.push(item);
                    }
                })
                return arr;
            },

            getYHCZ: function () {
                let arr = this.getYH(1);
                arr.map((item) => {
                    item.value = item.id;
                    item.text = item.realName;
                })
                this.option1 = arr;

                this.sf.map((item, index) => {
                    item.value = item.id;
                    item.text = item.name;
                })
                this.sflist = this.sf;

            },
            hideQR: function () {
                this.showQRcode = false;
                this.showCZ = true;

                let path = this.js_path + "/api/product/flow/query/"+this.barcodeId;
                interfaceOS.get(path, (code, res) => {
                    trace("post", code, res);

                    if (code == 1 && res.code == 200) {
                        if(res.data.done==1){       //全流程是否完成 0否 1是
                            this.codeMsgs = res.data;
                            this.hideCZ();
                            this.statu_msg = "已检验通过";
                            this.showCZJG = true;
                        }else{
                            this.curQRIndex = Number(res.data.currentFlowStatus) - 2;
                        }
                    } else {
                        this.alert({
                            title: "查询失败",
                            content: res.message || res.msg
                        })
                    }

                }, 30000);

            },
            hideCZ: function () {
                this.showCZ = false;
            },


            createOrder: function () {
                trace("createOrder");
                this.showCreateOrder = true;
            },
            comfirmOrder: function () {
                trace("comfirmOrder")
                this.showQRcode = true;

                this.codeCallback = (data)=>{
                    data = JSON.parse(data);
                    if(data.code==200){
                        this.codeCallback = null;
                        this.barcodeId = data.data;
                        this.hideQR();
                    }else{

                    }
                    trace("codeCallback"+data.data)

                }

                api.A2H5.getCode()
            },
            confirmOrder: function () {
                vant.Dialog.confirm({
                    title: '创建实例',
                    message: '您确定要创建么？',
                })
                    .then(() => {
                        trace("ok")
                        this.isCreate = true;
                        this.postCreate();
                    })
                    .catch(() => {
                        trace("cancel")
                    });
            },
            alert: function (data) {
                vant.Dialog.alert({
                    title: data.title,
                    message: data.content,
                })
            },

            postCreate: async function () {
                let res = await api.A2H5.getPoint();
                trace('getPoint-'+res.code)
                if(res.code == 200){

                }else{
                    this.alert({
                        tile:"获取位置失败",
                        content:res.message,
                    })
                    this.isCreate = false;
                    return;
                }
                let data = {
                    "barcodeId": Math.random().toString(16).slice(2,7)+Math.random().toString(16).slice(2,7),
                    "productName": this.productName,
                    "productDesc": this.productDesc,
                    "productCategory": this.productCategoryDesc,
                    "merchantUserId": this.merchantUserId,
                    "locationLongitude": res.data.long,
                    "locationLatitude": res.data.lat,
                    "locationDetail": res.data.address,
                }
                let path = this.js_path + "/api/product/create";
                interfaceOS.post(path, data, (code, res) => {
                    trace("post", code, res);

                    if (code == 1 && res.code == 200) {
                        this.onCreateBack();
                        this.printData = res.data;
                        this.toPrint();
                    } else {
                        this.alert({
                            title: "创建实例",
                            content: res.message || res.msg
                        })
                    }

                }, 30000);

            },
            toOrder: function () {

            },

            toPrint: async function () {
                this.showPrint = true;
                let res = await api.A2H5.print({data:this.printData.barcodeId})
                trace("print"+this.printData.barcodeId+JSON.stringify(res))
                this.alert({
                    title:"打印结果",
                    content:res.message
                })
            },
            onCreateBack: function () {
                this.showCreateOrder = false;
                this.isCreate = false;
            },
            onPrintBack: function () {
                this.showPrint = false;
            },
            login: function () {
                // if(this.input_user=="admin"&&this.input_password=="123456"){
                //     this.isLogin = true;
                // }
                this.isLogin = true;
            },
            closeOrder: function () {
                this.showOrder = false;
            },
            showOrderPane: function (item) {
                this.showOrder = true;
                this.curOrder = item;
            },
            checkCode: function () {
                let path = this.js_path + "/api/product/check/query";
                let data =
                    {
                        "barcodeId": this.barcodeId,
                        "merchantId": this.shID,
                        "merchantUserId": this.yhID,
                    };
                interfaceOS.post(path, data, (code, res) => {
                    if (code == 1) {
                        if (res.code == 200) {

                            this.curQRIndex = Number(res.data) - 2;
                            this.isCZ = true;
                            if (this.curQRIndex == 0) {
                                this.czText = "仓储";
                            } else {
                                this.czText = "检验";
                            }
                        } else if (res.code == 500) {
                            this.isCZ = false;
                            this.alert({
                                title: "检验",
                                content: res.message || res.msg
                            })
                        } else {
                            this.isCZ = false;
                            this.alert({
                                title: "检验",
                                content: res.message || res.msg
                            })
                        }


                        trace("checkCode=", res)
                    }
                }, 30000)
            },
            confirmCZ: async function () {
                if (!this.isCZ) {
                    this.hideCZ();
                    this.showCZJG = true;
                    return;
                }

                let res = await api.A2H5.getPoint();
                trace('getPoint-'+res.code)
                if(res.code == 200){

                }else{
                    this.alert({
                        tile:"获取位置失败",
                        content:res.message,
                    })
                    this.isCreate = false;
                    return;
                }
                let path = this.js_path + "/api/product/check/submit";
                let data = {
                    "barcodeId": this.barcodeId,
                    "merchantId": this.shID,
                    "merchantUserId": this.yhID,
                    "locationLongitude": res.data.long,
                    "locationLatitude": res.data.lat,
                    "locationDetail": res.data.address,
                }
                this.czLoading = true;
                interfaceOS.post(path, data, (code, res) => {
                    trace("confirmCZ=", res);
                    this.czLoading = false;
                    if (code == 1) {
                        if (res.code == 200) {

                            this.hideCZ();

                            this.codeMsgs = res.data;
                            if(this.curQRIndex==0){
                                this.statu_msg = "操作成功";
                            }else{
                                this.statu_msg = "检验通过";
                            }
                            this.showCZJG = true;
                        } else {
                            this.alert({
                                title: "提交",
                                content: res.message || res.msg
                            })
                        }
                    } else {
                        this.alert({
                            title: "提交",
                            content: res.message || res.msg
                        })
                    }
                }, 30000)
            },
        },
        watch: {
            shID: function (a, b) {
                this.yhlist = this.getYH(this.shID);
                this.yhlist.map((item) => {
                    item.value = item.id;
                    item.text = item.realName;
                })
                trace(a, b, this.yhlist)
                this.yhID = "";
            },
            yhID: function (a, b) {
                if (a != "") {
                    this.checkCode();
                }
            }

        }
    }
)