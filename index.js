
$(document).ready(PageLoaded);
function PageLoaded()
{
	$("#portfolio").on("click",function()
	{
		window.location.href = "indexpage2.html?portfolio=yes";
	})
	$("#trending").on("click","div.commanstyle",function()
	{
		var clickedId= $(this).attr("id");
      alert("you will be moved to another page");
       console.log(clickedId);
       window.location.href = "indexpage2.html?rowId="+clickedId;
  	});

	$('Table').on('click','tr', function() {
	  alert("you will be moved to another page");
	  var clickedId= $(this).attr("id");
	     console.log(clickedId);
	     window.location.href = "indexpage2.html?rowId="+clickedId;
	});
	
	$(".uidropdown").on("change",function()
	{
		let as=$('.uidropdown option:selected').text();
		if(as==="USD")
		{
			let currency_selected="USD";
			FetchData(currency_selected);
			
		}
		else
		{ 
			let currency_selected="INR";
			FetchData(currency_selected);
		}
		console.log(as);
   

	});	
	
	
	$("#searchBar").on("input", function()
	{
		var find_str = $("#searchBar").val().toLowerCase();
		var render_data = [];
		for(var i=0;i<window.original_data.length;i++)
	    {
	    	var nameCoin = window.original_data[i].id.toLowerCase();
	    	if(nameCoin.indexOf(find_str) != -1)
	    	{
	    		render_data.push(window.original_data[i]);
	    	}
	    }
	    renderResult(render_data);
	})
	
	FetchData("INR");
}
function FetchData(currency_selected)
 {
 // 	$.blockUI();
       $("#marq").empty();
 		window.formatter = new Intl.NumberFormat('en-US', {
		  style: 'currency',
		  currency: currency_selected,
		});

  		$.get("https://api.coingecko.com/api/v3/search/trending",function(data7)
 		{
 			console.log(data7);
 			for(var i=0;i<7;i++)
 			{
 				let topcheck=data7.coins[i].item.id;
 				console.log(topcheck);
 				$.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency="+currency_selected+"&ids="+topcheck+"&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h",function(Dataa,status)
               { 
               	$("#marq").append("<div class='commanstyle' id="+Dataa[0].id+" ><img src="+ Dataa[0].image+"><p>"+(Dataa[0].id).toUpperCase()+" &nbsp| &nbsp"+"<span id='"+Dataa[0].id+"'>"+Math.round((Dataa[0].price_change_percentage_24h_in_currency + Number.EPSILON) * 100) / 100+"% </span></p><p style='font-family: sans-serif;color:white;'>"+formatter.format(Dataa[0].current_price)+"</p></div>")
                 if(Dataa[0].price_change_percentage_24h_in_currency >0)
                 {
                    $("#"+Dataa[0].id).css("color", "green");
                 }
                 else
                 {
                      $("#"+Dataa[0].id).css("color", "red");
                 }

                 console.log(Dataa)
              });                                                                                                              
            
 				
 			
 			}
 		});
	

	$.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency="+currency_selected+"&order=market_cap_desc&per_page=250&page=1&sparkline=false",function(apiData,status)           
	 {
	    console.log(apiData);
	    window.original_data = apiData;
	    renderResult(window.original_data);
	    
	 });


   
}

function renderResult(data)
{
	$("table").empty();
	$("table").append("<tr id='table_heading'><th>COIN</th><th>PRICE</th><th>24H CHANGE </th><th>MARKET CAP</th></tr>");
	if(data.length!=0)
	{	
	for(var i=0;i<data.length;i++)
	    {
	    	$("table").append("<tr id="+data[i].id+" ><td><img src="+data[i].image+"><p >"+data[i].id.toUpperCase()+"</p></td><td style='font-family: sans-serif;'>"+formatter.format(data[i].current_price)+"</td><td><span id='A"+data[i].id+"'>"+Math.round(data[i].price_change_percentage_24h * 100) / 100+"% </span></td><td style='font-family: sans-serif;'>"+formatter.format(Math.round(data[i].market_cap/10000000))+"cr</td></tr>");
	           if(data[i].price_change_percentage_24h >0)
                 {
                    $("#A"+data[i].id).css("color", "green");
                 }
                 else
                 {
                      $("#A"+data[i].id).css("color", "red");
                 }
    
	    }
}

else
{
   $("table").append("<h1 style='color:white;text-align:center;'>NOT FOUND </h1>");
}}
