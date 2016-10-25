$(function(){
    var login_member=$('.login-member')
    //光标事件
    $("form input").focus(function() {
        $(this).parents('.div-input').addClass('safe-color').removeClass("err-color");
    }).blur(function() {
        $(this).parents('.div-input').removeClass('safe-color');
        checkData(this);
    }).keyup(function(e) {
        if (e.keyCode === 13) {
            $("[name='login-submit']", $(this).parents("form")).trigger("click");
        }
    }).on('input', function(){
        var flag = checkData(this);
    });


    //提交
    $('.login-submit').on("click", function() {
        var user=document.getElementById('login-user');
        var pass=document.getElementById('login-pass');
        var Userflag = checkData(user); 
        var Passflag = checkData(pass); 
        var data={
            user:$.trim($('#login-user').val()),
            pwd:$('#login-pass').val()
        }
        console.log(Userflag)
        console.log(Passflag)
        if (Userflag && Passflag) {
            console.log('都是真');
            $.ajax({
                type:'post',
                url:'/user/signin',
                data:data,
                success:function(rs){
                    if(rs.success==0){
                        var text=rs.msg;
                        $('.login-error').text(text).show();
                    }
                    if(rs.success==1){
                        window.location.href = '/';
                    }
                }
            })
        }
    });
    //点击验证码的效果
    $(".identify-img").on("click", changeIdentifyCode);
    $(".identify-img").on("load", function() {
        $(".loadingImg").hide();
        $(this).show();
    });
    //更换验证码
    function changeIdentifyCode() {
        $(".loadingImg").css("display", "");
        $('.identify-img').hide().attr('src', '/yanzhengma/?' + (new Date().getTime() + Math.random()));
    }

    //表单的默认focus
    function defaultFocus(ele) {
        var username = $("[name='login-user']", ele);
        var password = $("[name='login-pass']", ele);
        var identify_code = $("[name='login-identify']", ele);
        if (username.val() == '') {
            username.focus();
        } else if (password.val() == '') {
            password.focus();
        } else {
            identify_code.focus();
        }
    }
    setTimeout(function() {
        defaultFocus(login_member);
    }, 200);


function checkData(element) {
    var text = "";
    if (!element.value) {
        return false;
    }
    switch(element.name){
        case 'login-user':
            if (new RegExp("^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+").test(element.value) == false) {
                text='请输入正确的邮箱'
                $('.login-error').text(text).show();
                $(element).parents(".div-input").addClass("err-color");
                return false;
            }else{
                $('.login-error').text(text).hide();
                $(element).parents(".div-input").removeClass("err-color");
                return true;
            }
            break;
        case 'login-pass':
            if (element.value.length < 6) {
                text="请输入正确的密码，密码长度最少必须6位"
                $('.login-error').text(text).show();
                $(element).parents(".div-input").addClass("err-color");
                return false;
            }else{
                 $('.login-error').text(text).hide();
                 $(element).parents(".div-input").removeClass("err-color");
                 return true;
            }
            break;
        case 'login-identity':
            if (!/^([a-zA-Z0-9])*$/.test(element.value) || element.value.length != 4) {
                return "请输入正确的验证码，长度4位字母或者数字。";
            } else {
                var tmpUrl ="/user/checkCode" + element.value + "&t=" + (new Date().getTime() + Math.random());
                $.get(tmpUrl, function(json) {
                    try {
                        var json = eval("(" + json + ")");
                    } catch (e) {
                        $('.login-error').text("验证码错误").show();
                    }
                    if (!json.success) {
                        identify_codeFlag = false;
                        $(element).focus();
                        $(element).parents("div-input").addClass("err-color");
                        $('.login-error').text("验证码错误，请重新输入").show();
                        if ( json.errno == -2 ) {
                            change_identify_code();
                        }
                    } else {
                        identify_codeFlag = true;
                    }
                });
            }
            break;
        default:
            return false;
            break;
    }
    return returnflag;
}
})