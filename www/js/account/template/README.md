## 用户注册接口
> 18080/api/user/signup

```javascript
// params 
{phone:'手机号',verify_code:'验证码',type:'从事类型(TRADE,TRAFFIC)',real_name:'姓名'}
```

## 用户登录接口
> 18080/api/user/login

```javascript
// params
{phone:'手机号', verify_code:'验证码'}
```

## 注册个人设置买卖运
> 18080/api/user/edit

```javascript
// params
{buy: ['买'], sell:['卖'], transport:['运']}
```
