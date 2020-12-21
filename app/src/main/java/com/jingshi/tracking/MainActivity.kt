package com.jingshi.tracking

import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Bitmap
import android.media.AudioManager
import android.media.MediaPlayer
import android.os.Bundle
import android.text.TextUtils
import android.util.Log
import android.view.KeyEvent
import android.view.View
import android.webkit.*
import android.zyapi.pos.PosManager
import android.zyapi.pos.PrinterDevice
import android.zyapi.pos.interfaces.OnPrintEventListener
import android.zyapi.pos.interfaces.OnPrintEventListener.*
import androidx.appcompat.app.AppCompatActivity
import com.baidu.location.BDAbstractLocationListener
import com.baidu.location.BDLocation
import com.baidu.location.LocationClient
import com.baidu.location.LocationClientOption
import com.baidu.mapapi.SDKInitializer
import com.google.gson.Gson
import com.jingshi.tracking.comm.BarcodeCreater
import com.jingshi.tracking.comm.BitmapTools
import kotlinx.android.synthetic.main.activity_main.*
import org.json.JSONObject


class MainActivity : AppCompatActivity() {

    private val deviceMode = "A980"
    private var printCallbackName = ""
    private lateinit var mPrinter: PrinterDevice
    private lateinit var mediaPlayer: MediaPlayer
    var locationMsg = LOCATION_RESPONSE(data = LOCATION_RESPONSE.Data())
    private val ISMART_KEY_SCAN_VALUE = "ismart.intent.scanvalue"
    private var mReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (intent.action == ISMART_KEY_SCAN_VALUE) {
                mediaPlayer.start()
                val bytesArr = intent.getByteArrayExtra("scanvalue")
                val s = String(bytesArr!!)
                callJs("getCode", Gson().toJson(COMM_RESPONSE(data = s)))
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        initBeepSound()
        initLocation()
        initPrinter()
        initWebView()
    }

    private fun initPrinter() {
        val filter = IntentFilter()
        filter.addAction(ISMART_KEY_SCAN_VALUE)
        registerReceiver(mReceiver, filter)
        PosManager.get().init(applicationContext, deviceMode)
        mPrinter = PosManager.get().printerDevice
        mPrinter.setPrintEventListener(object : OnPrintEventListener {
            override fun onEvent(event: Int) {
                when (event) {

                    EVENT_PRINT_OK -> {
                        showMsg("打印完成")
                        if (!TextUtils.isEmpty(printCallbackName)) {
                            callJs(printCallbackName, Gson().toJson(COMM_RESPONSE()))
                            printCallbackName = ""
                        }
                    }
                    EVENT_UNKNOW -> showMsg("未知错误")
                    EVENT_NO_PAPER -> showMsg("打印机缺纸")
                    EVENT_PAPER_JAM -> showMsg("打印机卡纸")
                    EVENT_HIGH_TEMP -> showMsg("机芯温度过热")
                    EVENT_LOW_TEMP -> showMsg("机芯温度过低")
                    EVENT_CONNECTED -> showMsg("打印机连接完成")
                    EVENT_CONNECT_FAILD -> showMsg("打印机连接失败")
                    EVENT_STATE_OK -> showMsg("打印机状态正常")
                    EVENT_CHECKED_BLACKFLAG -> showMsg("检测到黑标")
                    EVENT_NO_CHECKED_BLACKFLAG -> showMsg("未检测到黑标")
                    EVENT_TIMEOUT -> showMsg("打印机响应超时")
                    EVENT_PRINT_FAILD -> showMsg("打印失败")
                    else -> {
                        showMsg("打印失败:$event")
                        Log.e("print fail", "code is $event")
                        callJs(
                            printCallbackName,
                            Gson().toJson(COMM_RESPONSE(code = -200, message = "print error"))
                        )
                        printCallbackName = ""
                    }
                }
            }

            override fun onCheckBlack(event: Int) {
                when (event) {
                    EVENT_CHECKED_BLACKFLAG -> showMsg("检测到黑标")
                    EVENT_NO_CHECKED_BLACKFLAG -> showMsg("没有检测到黑标")
                    EVENT_NO_PAPER -> showMsg("检测黑标时缺纸")
                }
            }

            override fun onGetState(p0: Int, p1: Int) {
                // 没用
            }
        })
        mPrinter.init()
    }

    @SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
    private fun initWebView() {
        webview.addJavascriptInterface(this, "JSBlockChainTracing")
        webview.settings.javaScriptEnabled = true
        webview.settings.domStorageEnabled = true
        webview.settings.cacheMode = WebSettings.LOAD_DEFAULT
        webview.settings.setAppCacheEnabled(true)
        webview.settings.blockNetworkImage =false
        webview.settings.blockNetworkLoads =false
        webview.settings.allowFileAccessFromFileURLs = true
        webview.setLayerType(View.LAYER_TYPE_HARDWARE, null)
        webview.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                if (request != null) {;
                    view?.loadUrl(request.url.toString())
                }
                return true
            }
        }
//        webview.loadUrl("http://10.10.41.23/sweepH5/index.html")
        webview.loadUrl("file:///android_asset/sweepH5/index.html")
    }

    fun callJs(methodName: String, data: String) {
        val js = "javascript:${methodName}(\'${data}\')"
        webview.post {
            webview.loadUrl(js)
        }
    }

    @JavascriptInterface
    fun callMessage(methodName: String, params: String, callbackName: String) {
        when (methodName) {
            "print" -> {
                val data = JSONObject(params).getString("data")
                printCallbackName = callbackName
                runOnUiThread {
                    print(data)
                }
            }
            "getPoint" -> {
                callJs(callbackName, Gson().toJson(locationMsg))
            }

            "keyfn" -> {
                mPrinter.addAction(PrinterDevice.PRINTER_CMD_KEY_CHECKBLACK)
                mPrinter.printStart()
            }
        }
    }

    private fun initBeepSound() {
        volumeControlStream = AudioManager.STREAM_MUSIC
        mediaPlayer = MediaPlayer()
        mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC)
        mediaPlayer.setOnCompletionListener {
            it.seekTo(0)
        }
        val file = resources.openRawResourceFd(R.raw.ding)
        mediaPlayer.setDataSource(
            file.fileDescriptor,
            file.startOffset, file.length
        )
        file.close()
        mediaPlayer.setVolume(1.0f, 1.0f)
        mediaPlayer.prepare()
    }

    private fun showMsg(str: String) {
//        Toast.makeText(this, str, Toast.LENGTH_SHORT).show()
    }

    val concentration = 30 //打印浓度油墨浓度 25 – 60
    private fun print(content: String) {
        var textData = mPrinter.TextData()
        textData.addParam("1B4A30")
        mPrinter.addText(concentration, textData)
        val bmp = BarcodeCreater.creatBarcode(
            this, content,
            200, 200, false, 2
        )
        img_code.setImageBitmap(bmp)
        var bmp1 = convertViewToBitmap(print_code)
        bmp1 = BitmapTools.gray2Binary(bmp1)
        val printImgData = BitmapTools.bitmap2PrinterBytes(bmp1)
        mPrinter.addBmp(concentration, 5, bmp1.width, bmp1.height, printImgData)
        mPrinter.addAction(PrinterDevice.PRINTER_CMD_KEY_CHECKBLACK)
//        textData.addParam("1B4A04")
//        mPrinter.addText(concentration, textData)
        mPrinter.printStart()

    }

    private fun convertViewToBitmap(view: View): Bitmap {
        view.measure(
            View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED),
            View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED)
        )
        view.layout(0, 0, view.measuredWidth, view.measuredHeight);
        view.buildDrawingCache();
        view.isDrawingCacheEnabled = true
        val bitmap = view.drawingCache;
        return bitmap
    }

    override fun onKeyUp(keyCode: Int, event: KeyEvent?): Boolean {
        Log.d("--akun", "key onKeyUp $keyCode")
        // 手持机Fn的键值(PDA keycode)[其它键值为：SCAN:280 BACK:13 LEFT:131 RIGHT:132]
        // SCAN按钮的广播
        //  按键抬起
        //  private static final String  ISMART_KEY_SCAN_UP = "ismart.intent.scanup";
        //  按键按下
        //  private static final String  ISMART_KEY_SCAN_DOWN = "ismart.intent.scandown";
        if (keyCode == 133) {
            // 添加webview后此按钮无法拦截
            // fn 检测
            mPrinter.addAction(PrinterDevice.PRINTER_CMD_KEY_CHECKBLACK)
            mPrinter.printStart()
        }
        return super.onKeyUp(keyCode, event)
    }


    private lateinit var mLocationClient: LocationClient
    private val myListener = object : BDAbstractLocationListener() {
        override fun onReceiveLocation(p0: BDLocation) {
            locationMsg.data.long = p0.longitude.toString()
            locationMsg.data.lat = p0.latitude.toString()
            locationMsg.data.address = p0.addrStr
        }
    }

    private fun initLocation() {
        SDKInitializer.initialize(applicationContext)
        mLocationClient = LocationClient(applicationContext)
        val option = LocationClientOption()
        option.locationMode =
            LocationClientOption.LocationMode.Hight_Accuracy //可选，默认高精度，设置定位模式，高精度，低功耗，仅设备
        option.setCoorType("bd09ll") //可选，默认gcj02，设置返回的定位结果坐标系
        val span = 5 * 60 * 1000
        option.setScanSpan(span) //可选，默认0，即仅定位一次，设置发起定位请求的间隔需要大于等于1000ms才是有效的
        option.setIsNeedAddress(true) //可选，设置是否需要地址信息，默认不需要
        option.isOpenGps = true //可选，默认false,设置是否使用gps
        option.isLocationNotify = true //可选，默认false，设置是否当GPS有效时按照1S/1次频率输出GPS结果
        option.setIsNeedLocationDescribe(true) //可选，默认false，设置是否需要位置语义化结果，可以在BDLocation
        // .getLocationDescribe里得到，结果类似于“在北京天安门附近”
        option.setIsNeedLocationPoiList(true) //可选，默认false，设置是否需要POI结果，可以在BDLocation.getPoiList里得到
        option.setIgnoreKillProcess(false)
        option.isOpenGps = true // 打开gps
        //可选，默认true，定位SDK内部是一个SERVICE，并放到了独立进程，设置是否在stop的时候杀死这个进程，默认不杀死
        option.SetIgnoreCacheException(false) //可选，默认false，设置是否收集CRASH信息，默认收集
        option.setEnableSimulateGps(false) //可选，默认false，设置是否需要过滤GPS仿真结果，默认需要
        mLocationClient.locOption = option
        mLocationClient.registerLocationListener(myListener)
        mLocationClient.start();
    }

    override fun onDestroy() {
        mLocationClient.unRegisterLocationListener(myListener)
        unregisterReceiver(mReceiver)
        super.onDestroy()
        mPrinter.close()
        mediaPlayer.release()
    }
}