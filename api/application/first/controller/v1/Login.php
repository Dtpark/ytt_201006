<?php

namespace app\first\controller\v1;

use think\facade\Cache;
use think\Controller;
use think\Request;
use app\first\validate\v1\Login as Validate;
use app\first\model\v1\Member;

class Login extends Controller
{
    // 生成密钥对并分发
    public function getPublicKey(){
        // 生成密钥对
        $keys = exportOpenSSLKey();
        // 生成失败
        if(!$keys){
            return json(['code' => -1, 'msg' => '生成密钥失败'],500)->send();
        }
        // 密钥分发
        // 密钥存在redis中，如果五分钟没收到公钥就丢弃；收到就将缓存改为永久
        $publicKey = $keys['public_key'];
        $privateKey = $keys['private_key'];
        $keyId = md5($publicKey);
        $keyContent = [
            'publicKey' => $publicKey,
            'privateKey' => $privateKey
        ];
        Cache::store('redis')->set($keyId,$keyContent,300);

//        $data = [
//            'key_id' => base64_encode($keyId),
//            'public_key' => base64_encode($publicKey)
//        ];
        $data = [
            'key_id' => ($keyId),
            'public_key' => ($publicKey)
        ];
        return json(['code' => 1, 'msg' => '获取成功', 'data' => $data],200)->send();
    }

    // 登录
    public function index(Request $request){
        // 接收数据
        $data = [
            'username' => $request->param('username'),
            'password' => $request->param('password'),
            'publicKey' => $request->param('public_key'),
            'keyId' => $request->param('key_id')
        ];

        // 校验数据
        $validate = new Validate();
        if(!$validate->scene('index')->check($data)){
            return json(['code' => -1, 'msg' => $validate->getError()],401)->send();
        }

        // 验证用户
        $result = Member::login($data);

        if($result['code'] != 1){
            return json(['code' => $result['code'],'msg' => $result['msg']],$result['errCode'])->send();
        }

        return json($result,200)->send();


    }

    // 测试
    public function test(){
        return md5(123456);
    }
}
