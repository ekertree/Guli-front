import request from '@/utils/request'
export default {
    //根据手机号码发送短信
    sendRegisterCode(mobile) {
        return request({
            url: `/edusms/sms/sendRegisterCode/${mobile}`,
            method: 'get'
        })
    },
    //用户注册
    registerMember(formItem) {
        return request({
            url: `/ucenter/member/register`,
            method: 'post',
            data: formItem
        })
    }
}