$(document).ready(PageLoaded);	
function PageLoaded()
{
	window.array = {};
	 if(window.localStorage.getItem("user_info"))
	 {
	 	window.array = JSON.parse(window.localStorage.getItem("user_info"));
	 }
	$("#portfoloio").on("click",function()
	{
		  var renderArray = {};
          var allKeys = Object.keys(array);
          $("#combine").empty();

          $(".uidropdown").on("click",function()
          {
          	alert("currency changer is disabled whein in portfolio");
          	$(".uidropdown").prop("disabled", true);
          	
          })
          
          
          if(allKeys.length!=0)
          {
          	$("#combine").append("<table id='mtable' style='text-align: center'></table>");
          	// fetch_portfolio();
          	$("#mtable").append("<tr id='table_heading'><th>COIN</th><th>CURRENT PRICE</th><th>BUYING PRICE</th><th>QTY</th><th>INVESTED</th><th>CURRENT</th><th>P/L</th></tr>");
		      for(var i=0;i<allKeys.length;i++)
		      {
				var currItem = array[allKeys[i]];
				renderArray[allKeys[i]] = JSON.parse(JSON.stringify(array[allKeys[i]]));
		      	$.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency="+currItem.currency+"&ids="+currItem.id+"&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h",function(data,status)
		      	{
		      		renderArray[data[0].id].current_price = data[0].current_price;
		      		renderArray[data[0].id].image = data[0].image;
		      		renderRow(renderArray[data[0].id]);
		      	})
	          	console.log("inside portfolio");
	          	console.log(currItem);
			}
          }
          else
          {
          	$("#combine").append("<h1 style='color:white'> NO DATA FOUND</h1>")
          	$("#combine").append("<button > <a href='index.html'>GO TO HOME PAGE</a></BUTTON>");

          }
	})
	function renderRow(myData)
	{

		var formatter = new Intl.NumberFormat('en-US', {
		  style: 'currency',
		  currency: myData.currency,
		});
		var buyinvt=(myData.buyingQty*myData.buyingPrice);
		var curtinvt=(myData.current_price*myData.buyingQty);
		var result=(Math.round( (curtinvt-buyinvt)* 100) / 100);
	    $("#mtable").append("<tr id="+myData.id+">" + 
	    	"<td><img src="+myData.image+"><p >"+myData.id.toUpperCase()+"</p></td>"+
	    	"<td style='font-family: sans-serif;'>"+formatter.format(myData.current_price)+"</td>"+
	    	"<td>"+formatter.format(myData.buyingPrice)+"</td>"+
	    	"<td>"+myData.buyingQty+"</td>"+
	    	"<td>"+formatter.format(buyinvt)+"</td>"+
	    	"<td>"+formatter.format(curtinvt)+"</td>"+
	    	"<td> <span id='A"+myData.id+"'>"+formatter.format(result)+"</span></td>"+

                        

	       	"</tr>");
	                if(result>0)
		                 {
		                    $("#A"+myData.id).css("color", "green");
		                 }
		                 else
		                 {
		                      $("#A"+myData.id).css("color", "red");
		                 }
	}
 
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
	FetchData("INR");
}

	function FetchData(currency_selected)
	{
		$("#info2").empty();
		window.formatter = new Intl.NumberFormat('en-US', {
		  style: 'currency',
		  currency: currency_selected,
		});  

		var urlName = new URL(window.location.href);
		var id = urlName.searchParams.get("rowId");
		var portfolio = urlName.searchParams.get("portfolio");

		if(portfolio == "yes")
		{
			$("#portfoloio").click();
			return;
		}
		$("#info2").append("<h1>"+id.toUpperCase()+"</h1>")

		$.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency="+currency_selected+"&ids="+id+"&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h",function(Dataa,status)
               { 
               	$.get("https://api.coingecko.com/api/v3/coins/"+id+"?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false",function(dataaa,status)
               	{
               		console.log(dataaa.description.en.length);

               			$("#info2").append("<div class='commanstyle' id="+Dataa[0].id+" ><img src="+ Dataa[0].image+"><p>"+(Dataa[0].id).toUpperCase()+" &nbsp| &nbsp"+"<span id='a"+Dataa[0].id+"'>"+Math.round((Dataa[0].price_change_percentage_24h_in_currency + Number.EPSILON) * 100) / 100+"% </span></p><p style='font-family: sans-serif;color:white;'>"+formatter.format(Dataa[0].current_price)+"</p></div>")
                 if(Dataa[0].price_change_percentage_24h_in_currency >0)
                 {
                    $("#a"+Dataa[0].id).css("color", "green");
                 }
                 else
                 {
                      $("#a"+Dataa[0].id).css("color", "red");
                 }

                  $("#info2").append("<h2 style='color:#eebc1d'>HIGH 24H :- <span class='cspan'>"+formatter.format(Dataa[0].high_24h)+"</span></h2>")
                  $("#info2").append("<h2 style='color:#eebc1d'>LOW 24H :- <span class='cspan'>"+formatter.format(Dataa[0].low_24h)+"</span></h2>")
                  $("#info2").append("<h2 style='color:#eebc1d'> VOLUME :- <span class='cspan'>"+formatter.format(Dataa[0].total_volume/10000000)+"Cr</span></h2>")
                 console.log(Dataa)
                 $(".cspan").css("color", "white");
                 $(".cspan").css("font-family", "sans-serif");
                 
                 $("#buyingButton").on("click",function()
                 {
                 	let a=$("#buyingPrice").val();
                 	let b=$("#buyingQty").val();
                 	if(a == "" || b == "")
                 	{
                 		alert("please enter values");
                 		return;
                 	}
                 	console.log(a);
                 	console.log(b);
                 	console.log("clicked"+(a*b));
                 	var myuser = 
                 	{
                 		"id" : id,
                 		"buyingPrice" : a,
                 		"buyingQty" : b,
                 		"currency" :currency_selected,

                 	}
                 	window.array[id] = myuser;
                 	window.localStorage.setItem("user_info",JSON.stringify(array));
                 	alert("data added successfully");
                 })


               	});
               
              });     

	}