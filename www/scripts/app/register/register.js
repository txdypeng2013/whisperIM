define(['mobilekit'], function() 
{
	 $('#register').click(function()
	 {
        var account = $('#account').val();
        var password = $('#password').val();
		var name = $('#name').val();
		var mail = $('#mail').val();
        var sex =$('input[name="sex"]:checked').val(); 
 
        /*if(tContent.trim()=="")
        {
            toast("内容不允许为空！","",1500);
            return false;
        }
        if(tContent.trim().length>500)
        {
            toast("内容不允许超出500！","",1500);
            return false;
        }*/
   
        var param="account="+account+"&password="+password+"&name="+name+"&mail="+mail+"&sex="+sex;
		console.log(param);
        var data=GetDataByUrl_Post('register',param);
      
		console.log(data.ok+':'+data.message);
 
        if(data.ok=="true")
        {
            location.href ="../../login/login.html";
        }
        else
        {
            return false;
        }
        

    });

 
});