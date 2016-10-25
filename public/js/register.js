(function(window, $, undefined) {
	//点击时或者输入时的操作的检查
  	var telFlag=false,identityFlag=false,dynamicFlag=false;
  	var telValue=$('#mailbox').val();
  	var identityValue=$('#identity').val();
  	$('.reg-main input:text,input:password').focus(function(){
		if(this.name=='mailbox'){
			$('.tel-tip .tel-error').html('&nbsp;验证邮箱，方便登陆和找回密码').css('display','block');
			$('.tel-tip').removeClass('err');
		}
	}).blur(function(){
		checkData(this);

	}).on('input',function(){
		checkData(this);
	})
  			
 		
 	//第一步的提交
 	$('.get-code').bind('click', sendCode);
	$('.first-submit').bind('click', function () {
		var telCodeFlag = checkData(document.getElementById('mailbox'));
		// var flagIdentity = checkData(document.getElementById('identity'));
		// var flagCode = checkData(document.getElementById('dynamic'));
		console.log(telCodeFlag);
		if (!telCodeFlag ) {
		    return false;
		}
		stepNext(1);
	});

 	//第二步的提交
 	$('.second-submit').bind('click', function () {  
		var pwdFlag = checkData(document.getElementById('password'));	  
		var pwdAgainFlag = checkData(document.getElementById('password-again'));
		if (!pwdFlag || !pwdAgainFlag) {
		    return false;
	   	}
	   	var data={
		    name: $.trim($('#mailbox').val()),
		    password: $('#password').val(),
		};
		$.ajax({
		    url: '/user/signup',
		    type: 'post',
		    data: data,
		    success: function (rs) {
			    if ("1"==rs.success) {
			        stepNext(2);
			        var i = 5;
		        	setInterval(function () {
		            if (i !== 0) {
		              i--;
		              $('#backtime').html(i + 's后自动跳转到主页...');
		            } else {
		              window.location.href = '/';
		            }
		          }, 1000);
			    }
			}
		});	
	});

 	$('.change-code').click(function(){
 		$('#identify-img').attr('src','/yanzhengma/?' + (new Date().getTime() + Math.random()));
 	})
 	//获取动态码
	$('.get-code').click(function(){
		sendCode();
	});

 	//协议点击
 	$('.agreement').bind('click', function () {
		$.layer({
			type: 1,
			title: "享乐会员协议",
			time: 0,
			shadeClose: true,
			maxHeight: 500,
			page: {
				html: $('.logintextarea').html()
			},
			offset: ['150px', ''],
			area: ['700px', '350px']
		});
	});

 	 //检查数据是否符合要求
 	function checkData(ele){
 		if(!ele){
 			return true;
 		}
 		var value=$.trim(ele.value);
 		switch(ele.name){
 			case 'mailbox':
	 			if (!value || new RegExp('^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+').test(value) == false) {
	 				$('.tel-tip').addClass('err');
	 				$('.tel-tip .tel-error').html('请输入正确的邮箱').css('display','block');
	 				return false;
	 			}else {
	 				$('.tel-tip').addClass('err');
	 				$('.tel-tip .tel-error').html('检查中...');
	 				$.ajax({
				        url: '/check',
				        data: {
				        user: value
				        },
				        type: 'post',
				        success: function (data) {
				        	console.log(data);
					        if(data.success==1){
					            $('.tel-tip .tel-error').html('');
		               		    $('.tel-tip').removeClass('err');
		               		    $('.tel-tip .tel-error').removeClass('tel-tip-one').html('恭喜你，该手机可以注册！');
		               		    telFlag=true;
					        }else if(data.success==0){
					            msg = $('<p>该邮已存在，您可以：</p> <ul style="padding-left:100px"><li>? 用此号码<a href="/login" style="color:#f9651a;" onclick="document.cookie=\'tel=' + value + '\';">直接登录</a></li><li>? 如忘记密码可用邮箱<a href="http://www.tuniu.com/u/get_password?tel=' + value + '" style="color:#f9651a;" >找回密码</a></li> <li>? 如你没用该号码注册过账号，可<a href="javascript:void(0);" class="backForm" style="color:#f9651a;">验证后重新注册</a></li></ul>');
					            $('.tel-tip .tel-error').html(msg);
					            telFlag=false;
					        } 
				        }
				    })
	 				return telFlag;
 				}
	       		break;
 			case 'identity':
	 			if (!value || value.length < 4 || new RegExp('^([0-9a-zA-Z])+$').test(value) == false) {
	 				$('.identity-tip').addClass('err');
	 				$('.identity-error').show().html('请输入正确的验证码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
	 				return false;
	 			}else if(value.length==4){
	 				$.ajax({
				        url: 'user/checkCode?code=' + value,
				        type: 'GET',
				        success: function (rs) {
				        	if("1" == rs){
				                $('.identity-tip').removeClass('err');
				                $('.identity-error').hide().html('');
				                identityFlag=true;
				        	}else{
				        	   $('.identity-tip').addClass('err');
				               $('.identity-error').show().html('验证码不正确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
				               identityFlag=false;
				        	}
				        }
				    })
	 				return identityFlag;
 				}
        		break;
 			case 'dynamic':
	 			if (!value || value.length < 6 || new RegExp('^([0-9])+$').test(value) == false){
	 				$('.dynamic-tip').addClass('err').show();
	          		$('.dynamic-error').show().html('请输入正确的动态密码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
	 			}else if(value.length==6){
	 				$('.dynamic-tip').removeClass('err');
	          		$('.dynamic-error').html('');
	 				return true;
	 			}
	 			break;
 			case 'password':
	 			if (!value || value.length < 6) {
	 				$('.password-state').hide();
				    $('.password-tip').addClass('err').show();
				    $('.password-tip span').html('请输入正确的密码（密码长度最少6位以上）');
				    return false;
	 			}else{
			        $('.password-state').show();
			        var pass = $.trim($(ele).val());
			        var code = 0;
			        var level = 0;
			        var numericTest = /[0-9]/;
			        var lowerCaseAlphaTest = /[a-z]/;
			        var upperCaseAlphaTest = /[A-Z]/;
			        var symbolsTest = /[\\.,!@#$%^&*()}{:<>|]/;
			        if (numericTest.test(pass)) {
			            code++;			            
			        }
			        if (lowerCaseAlphaTest.test(pass) || upperCaseAlphaTest.test(pass)) {
			            code++;			        
			        }
			        if (symbolsTest.test(pass)) {
			            code++;
			        }
			        if (code < 2 && pass.length >= 6) {
			            level= 1;
			        }else if (code < 3 && pass.length >= 6) {
			            level = 2;
			        }else if (code = 3 && pass.length >= 6) {
			            level = 3;
			        }
			        if (level ==1) {
			            $('.password-state span').attr('class', '');
			            $('.password-state span').addClass('all-tip password-state-weak');
			        } else if (level == 2) {
			            $('.password-state span').attr('class', '');
			            $('.password-state span').addClass('all-tip password-state-in');
			        } else if (level == 3) {
			            $('.password-state span').attr('class', '');
			            $('.password-state span').addClass('all-tip password-state-strong');
			        }
			        $('.password-tip').removeClass('err').hide();
			        $('.password-tip span').html('');
			        return true;
			    }
			    break;
 			case 'password-again':	
	 			if (!ele.value || ele.value.length < 6) {
			        $('.password-again-tip').addClass('err').show();
			        $('.password-again-tip span').html('请输入正确的密码（密码长度最少6位以上）');
			        return false;
			    } else if (ele.value != $('#password').val()) {
			        $('.password-again-tip').addClass('err').show();
			        $('.password-again-tip span').html('两次输入的密码不一致');
			        return false;
			    } else {
			        $('.password-again-tip').removeClass('err').hide();
			        $('.password-again-tip span').html('');
			        return true;
			    }
			    break;  
		    default:
			   return false;
			   break;
 		}
 	}
 		 
 	//layer层弹出提示
 	function layerMsg(msg){
 		layer.open({
			content:msg,
			title:0,
			type:0,
			btn:0,
			shade:[0.5,"#666"],
			shadeClose:true,
			area:['350px','150px'],
			offset:['100px','500px'],
			time:5000,
		})
 	}
 	
 	//发送动态码
	function sendCode() {
		var flag1 = checkData(document.getElementById('mailbox'));
		var flag2 = checkData(document.getElementById('identify'));
		if (flag1 && flag2) {
		    $('#dynamic').val('').attr('disabled');
		    $('.get-code,.get-code-again').attr('disabled', true);
		    $('.get-code,.get-code-again').unbind('click');
		    var postData = {
		        tel: $('#mailbox').val(),
		        identify_code: $('#identify').val(),
		        isReg: 1
		    }
		    $.post('/ajax/sendMobileCode', postData, function (json) {
		        try {
		          var json = eval('(' + json + ')');
		        } catch (e) {
		          layerMsg('动态口令发送失败，请稍候重试。', 2);
		          return;
		        }
		        if (json.success) {
		          layerMsg('动态口令已发送，15分钟内有效！');
		          $('#code').removeAttr('disabled');
		          $('.get-code,.get-code-again').hide();
		          intervalTime(60);
		        } else {
		          $('.get-code,.get-code-again').removeAttr('disabled');
		          $('.get-code,.get-code-again').bind('click', sendCode);
		          switch (json.errno) {
		            case - 1:
		              $('#tel').focus();
		              $('.tel-tip span').removeClass('all-tip tel-tip-one').html('请输入正确的手机号码');
		              $('.tel-tip').addClass('err');
		              return;
		              break;
		            case - 2:
		              $('#identify').focus();
		              $('identity-tip').addClass('err');
				      $('identity-error').show().html('请输入正确的验证码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
		              return;
		              break;
		            case - 3:
		              layerMsg('动态口令发送失败，请稍候重试。', 2);
		              return;
		              break;
		            default:
		              layerMsg('动态口令发送失败，请稍候重试。', 2);
		              break;
		          }
		        }
		    });
		}else{
			$('.identity-tip').addClass('err');
	 		$('.identity-error').show().html('请输入正确的验证码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
		}
	}

 	 //60秒后重新发送
 	function intervalTime(num) {
		var num = parseInt(num);
		var i = 0;
		$('.send-code').css('display', 'inline-block');
		$('.send-code span').text(num);
		var inter = setInterval(function () {
			if (i < num) {
			    i++;
			    $('.send-code span').text(num - i);  //60秒后重新发送
			} else {
			    clearInterval(inter);
			    $('.send-code-again').css('display', 'inline-block').bind('click', sendCode);
			    $('.send-code').hide();
			    $('.send-code span').text(0);
			}
		}, 1000);
	}

	//点击下一步
	function stepNext(i) {
	    $('.main-item:eq(' + i + ')').css({
	      'visibility': 'visible'
	    });
	    $('.reg-main').animate({
	      left: - i * $('.reg-wrap').width() + 'px'
	    }, 500, 'swing', function () {
	      $('.main-item:eq(0)').css('visibility', 'hidden');
	    });
  	}

})(window,jQuery);