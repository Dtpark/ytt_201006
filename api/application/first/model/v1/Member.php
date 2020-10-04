<?php

namespace app\first\model\v1;

use app\first\controller\v1\Token;
use think\facade\Cache;
use think\Model;

class Member extends Model
{
    // 绑定数据表
    protected $name = "member";
    // 修改主键名称
    protected $pk = 'id';

    // 用户登录
    static public function login($data){

        $user = self::where('username',$data['username'])->find();
        if(empty($user)){
            return $res = [
                'code' => -1,
                'msg' => '用户不存在',
                'errCode' => 401
            ];
        }

        // 解密keyId及密码
//        $keyId = base64_decode($data['keyId']);
        $keyId = $data['keyId'];
        $keyContent = Cache::store('redis')->get($keyId);
        if(empty($keyContent)){
            return $res = [
                'code' => -10,
                'msg' => '密钥过期，请下拉刷新页面重新申请',
                'errCode' => 401
            ];
        }

//        $password = openSSLDcode(base64_decode($data['password']),$keyContent['private_key']);
        $password = openSSLDcode($data['password'],$keyContent['privateKey']);

        if($password == '证书错误'){
            return $res = [
                'code' => -10,
                'msg' => '证书错误，请下拉刷新页面重新申请',
                'errCode' => 401
            ];
        }

        if($user->password != md5($password)){
            return [
                'code' => -1,
                'msg' => '密码错误',
                'errCode' => 421
            ];
        }

        // 登录成功，分配 session ID 和 token
        // 分配session ID
        $sessionId = md5($keyContent['publicKey'].$data['username'].$keyId);
        // 分配token
        $token = md5(Token::create($user->id));
//        $token = Token::create($user->id);
        $sslToken = openSSLEncode($token,$data['publicKey']);
        if('证书错误' == $sslToken){
            return [
                'code' => -1,
                'msg' => $sslToken,
                'errCode' => 401,
            ];
        }

        // 写入redis
        $sessionData = [
            'username' => $data['username'],
            'token' => $token
        ];
        Cache::store('redis')->set($sessionId,$sessionData,600);



        return [
            'code' => 1,
            'msg' => '登录成功',
            'data' => [
                'session_id' => $sessionId,
                'token' => $sslToken
            ]
        ];



    }
}
