# 交易角色 关系

```javascript
'invitation/invite', {
    role: role,
    users: [{
		phone:phone,
		name:name
	}]
}
// 通讯录短信提醒同事接口
```

```javascript
'user_invitation_phone/send_sms', {
    phone_list: [{
        phone: user.phone,
        name: user.name,
        company: user.company || ''
    }],
    other_type: key
}
// 通讯录短信提醒非同事接口
```