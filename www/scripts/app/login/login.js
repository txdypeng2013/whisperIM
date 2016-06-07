define(['mobilekit'], function() 
{	 
	$('#home').click(function()
	 {
        var name = $('name').val();
        var password = $('#password').val();
   
        var param="name="+name+"&password="+password;
		console.log(param);
        var data=GetDataByUrl_Post('login',param);
      
		console.log(data.ok+':'+data.message);
 
        if(data.ok=="true")
        {
            location.href ="../../home/home.html";
        }
        else
        {
            return false;
        }
    });
 
});