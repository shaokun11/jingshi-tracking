package com.jingshi.tracking

data class COMM_RESPONSE(
    val data: String = "{}",
    val code: Int = 200,
    val message: String = "操作成功"
)


data class LOCATION_RESPONSE(
    val data: Data ,
    val code: Int = 200,
    val message: String = "操作成功"
) {
    data class Data(
        var long: String="",
        var lat: String="",
        var address: String=""
    )
}