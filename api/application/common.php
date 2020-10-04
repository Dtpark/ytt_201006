<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件


define("JWT_KEY",'dsafhwsafb*&T^86ffdoajf');

// 生成证书
function exportOpenSSLKey(){
    $config = array(
        "config" => '/usr/local/openssl/openssl.cnf',
        "digest_alg"        => "sha512",
        "private_key_bits"     => 1024,           //字节数  512 1024 2048  4096 等
        "private_key_type"     => OPENSSL_KEYTYPE_RSA,   //加密类型
    );
    $res = openssl_pkey_new($config);
    if ( $res == false ) return false;
    openssl_pkey_export($res, $private_key, null, $config);
    $public_key = openssl_pkey_get_details($res);
    $public_key = $public_key["key"];
    openssl_free_key($res);
    return $result = [
        'public_key' => $public_key,
        'private_key' => $private_key
    ];
}

// 私钥解密
function openSSLDcode($string, $ssl_private) {
    $pi_key         = openssl_pkey_get_private($ssl_private);//这个函数可用来判断私钥是否是可用的，可用返回资源id Resource id
    if( false == $pi_key)
        return '证书错误';
    $data = "";
    openssl_private_decrypt(base64_decode($string),$data,$pi_key);//私钥解密
    return $data;
}

// 公钥加密
function openSSLEncode($string, $ssl_public) {
    $pub_key = openssl_pkey_get_public(base64_decode($ssl_public));
    if( false == $pub_key)
        return '证书错误';
    $data = "";
    openssl_public_encrypt($string,$data,$pub_key);//公钥解密
    return base64_encode($data);

}
