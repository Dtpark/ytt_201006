<?php

namespace app\first\controller\v1;

use Firebase\JWT\JWT;
use think\Controller;

class Token extends Controller
{
    //
    /**
     * 创建jwt格式的token
     * @param int $uid '用户id（需要调用本方法的函数判断id是否有效）'
     * @return string jwt 格式的字符串
     */
    static public function create($uid){
        // 构建载荷
        $payload = [
            "iss" => "https://ytt.dtpark.top", //签发者
            "iat" => time(), // 签发时间
            "nbf" => time(),  // 这个时间前不可用
//            "exp" => time() +  7776000,  // 过期时间(3个月）
            "exp" => time() + 300,  // 过期时间(5min）
            "data" => [
                'uid' => intval($uid)
            ]
        ];
        // 生成token并返回
        return JWT::encode($payload,JWT_KEY);
    }

    /**
     * 校验token
     * @param $token jwt 格式的token
     * @return array 校验结果
     */
    static public function check($token){
        // 校验token
        try{
            $result = JWT::decode($token,JWT_KEY,array('HS256'));
            $res = [
                'code' => 1,
                'msg' => '验证通过',
                'data' => [
                    'uid' => $result->data->uid
                ]
            ];
        }catch (\Exception $e){
            $res = [
                'code' => -1,
                'msg' => $e->getMessage()
            ];
        }
        return $res;
    }
}
