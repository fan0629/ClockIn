/* 参考文章
GPS相关
https://blog.csdn.net/sxf1061700625/article/details/120597039
https://xfxuezhang.blog.csdn.net/article/details/107102858
权限相关
https://www.cnblogs.com/andy-songwei/p/10638446.html */

/* GPS位置信息：手机GPS开关
位置权限：软件是否具有使用GPS的权限 */

importClass(android.Manifest);
importClass(android.content.pm.PackageManager);
importClass(Packages.androidx.core.app.ActivityCompat); /* 在牙叔autojs-camera2-照相机-实现单拍和连拍:https://www.yuque.com/yashujs/bfug6u/mm354k 找到 */
importClass(android.content.Context);
importClass(android.provider.Settings);
importClass(android.location.Location);
importClass(android.location.Criteria);
importClass(android.location.LocationManager);
importClass(android.location.LocationListener);
const locationManager = context.getSystemService(Context.LOCATION_SERVICE)
const networkManager = context.getSystemService(Context.CONNECTIVITY_SERVICE)
var Network = __ => {
        return !!networkManager.getActiveNetworkInfo();
    } /* 判断是否开启网络 */,
    GPS = __ => {
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    } /* 判断是否开启GPS位置信息 */,
    AGPS = __ => {
        return ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
    } /* 判断是否开启位置权限 */,
    Permission = _ => {
        !GPS() && openAGPS();
        !AGPS() && openAGPS();
        !Network() && toastLog("请连接网络")
    }
Permission();

let locationListener = getLocationListener();

function getLocationLoop() {
    let criteria, provider, location
    /* 判断是否已经打开GPS模块并非权限 */
    if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) || locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
        /* GPS模块打开，可以定位操作 */
        provider = locationManager.GPS_PROVIDER;
        if (provider != null) {
            log("provider: " + provider);
            location = locationManager.getLastKnownLocation(provider);
        }
        if (location == null) {
            log("GPS信号弱，请移动到室外开阔场地！");
            locationManager.requestLocationUpdates(provider, 1000, 0, locationListener);
        } else {
            locationManager.removeUpdates(locationListener);
        }
        return location;
    }
}

function getGPSInfo() { /* 由location获取定位信息 */
    let location = getLocationLoop()
    log(location)
    if (location) {
        let gc = new android.location.Geocoder(context, java.util.Locale.getDefault()),
            result = gc.getFromLocation(location.getLatitude() /* 纬度 */, location.getLongitude() /* n经度 */, 1),
            GPSInfo = {
                Time: new Date(location.time)
            }
        result = result.get(0)
        Object.keys(result).filter(item => {
            return /^get/.test(item) && item != "getClass" && item != "getExtras"
        }).forEach(item => {
            let info = item != "getAddressLine" ? result[item]() :
                result.getAddressLine(0)
            info && (GPSInfo[item.replace("get", "")] = info)
        })
        return GPSInfo;
    }
}

function getLocationListener() {
    return new LocationListener()
    {
        /**
         * 位置信息变化时触发:当坐标改变时触发此函数，如果Provider传进相同的坐标，它就不会被触发
         * @param location
         */
        onLocationChanged(location)
        {
            Toast.makeText(MainActivity.this, "onLocationChanged函数被触发！", Toast.LENGTH_SHORT).show();
            updateUI(location);
            Log.i(TAG, "时间：" + location.getTime());
            Log.i(TAG, "经度：" + location.getLongitude());
            Log.i(TAG, "纬度：" + location.getLatitude());
            Log.i(TAG, "海拔：" + location.getAltitude());
        }
    ,

        /**
         * GPS状态变化时触发:Provider被disable时触发此函数，比如GPS被关闭
         * @param provider
         * @param status
         * @param extras
         */
        onStatusChanged(provider, status, extras)
        {
            switch (status) {
                //GPS状态为可见时
                case LocationProvider.AVAILABLE:
                    Toast.makeText(MainActivity.this, "onStatusChanged：当前GPS状态为可见状态", Toast.LENGTH_SHORT).show();
                    break;
                //GPS状态为服务区外时
                case LocationProvider.OUT_OF_SERVICE:
                    Toast.makeText(MainActivity.this, "onStatusChanged:当前GPS状态为服务区外状态", Toast.LENGTH_SHORT).show();
                    break;
                //GPS状态为暂停服务时
                case LocationProvider.TEMPORARILY_UNAVAILABLE:
                    Toast.makeText(MainActivity.this, "onStatusChanged:当前GPS状态为暂停服务状态", Toast.LENGTH_SHORT).show();
                    break;
            }
        }
    ,

        /**
         * 方法描述：GPS开启时触发
         * @param provider
         */
        onProviderEnabled(provider)
        {
            Toast.makeText(MainActivity.this, "onProviderEnabled:方法被触发", Toast.LENGTH_SHORT).show();
            getLocation();
        }
    ,

        /**
         * 方法描述： GPS禁用时触发
         * @param provider
         */
        onProviderDisabled(provider)
        {

        }
    }
}

function openGPS() {
    toastLog("请开启GPS位置信息");
    app.startActivity({
        packageName: "com.android.settings",
        className: "com.android.settings.Settings$LocationSettingsActivity",
        data: "package:" + context.getPackageName().toString()
    });
}

function openAGPS() {
    toastLog("请开启位置权限");
    runtime.requestPermissions(["access_fine_location"]); /* 由空.提供 运行时获取权限 */
}

module.exports = {
    getGPS() {
        let Info = getGPSInfo()
        if (Info) {
            return Info
        }
    },
    getLocation() {
        return getLocationLoop()
    }
}