function buildProductTypeOptions() {
    // this will build the options in the product type combobox
    
    $.getJSON("/product.json",function(result){
      // loop through what was sent back and build the comboxitems...
      if (null != result && null != result.products && 0 < result.products.length) {
        
        // store the JSON so we have it for later....
        parsedJSON = result.products;
        // now build an array of what product types we have
        var productTypes = [];
        for(var x =0; x < parsedJSON.length; x++)
        {
            propType = parsedJSON[x].product.producttype;

            if (-1 == productTypes.indexOf(propType)) {
                productTypes.push(propType);
            }
        }
        // now we have an array of what product types we have.. lets sort it
        productTypes.sort();
        // now put these into the combobox....
        $.each(productTypes, function(value, text)
               {
                $("#cboProductType").append(new Option(text,text));
               }
              );
        // now display the first one??
        displayProducts();
      }
    });
}
var parsedJSON = "";
function getProductBySKU(sku)
{
    // need to search for sku; assumming flat file for now..
    var selectedProduct = null;
    parsedJSON.forEach(function(s){
        if (sku == s.product.sku) {
            selectedProduct = s.product;
        }
        
    });
    return selectedProduct;
}
function buildOptionsTable(product) {
    // this needs to print out the options if present...
    var optionsTable = "<br>";
    if (null != product.variants && 0 < product.variants.length) {
    
        optionsTable +="<br><br>Options:<br><br>";
        optionsTable +="<table class=\"pricetable\">";
        optionsTable +="<tr><td>Model</td><td>SKU</td><td>Price</td></tr>";
        product.variants.forEach(function(s){
            //text, sku, price
            optionsTable += "<tr>" +
                            "<td>" + s.text + "</td>" +
                            "<td>" + s.sku + "</td>" +
                            "<td>" + s.price + "</td>" +
                            "</tr>";
        }
        );
        optionsTable +="</table>";
    }
    return optionsTable;
}
function displayProducts()
{
    // what was the type displayed???
    var selected = $("#cboProductType").val();
    // clear out what was there before
    $("#products").empty();
    // loop through and print out the products that match this type....
    parsedJSON.forEach(function(s){
    
        // see if product type matches
        if (selected == "-all-" || selected == s.product.producttype) {
            // here we add the title, image
            $("#products").append("<div class=\"products\" sku=\"" +  s.product.sku + "\"><strong>" +s.product.title + "</strong><br><img src=\"" + s.product.productimage+ "\"/>" +
                                  "<br>Priced from : " + s.product.startingat + "</div>" );
        }
        
    });
    
    
    // need to register the click event on the divs now that they were created....
    $('.products').click(function() {
        var skuToShow = $(this).attr("sku");
        if (null != skuToShow)
        {
            // need to build the html to show in this..
            var product = getProductBySKU(skuToShow);
            if (null != product) {
                // this is what we need to display...
                // set the dialog title
                $("#productdetails").dialog({"title" : product.title});
                // set the div body
                $("#productdialogcontent").empty();
               
                
                // build the options table...
                var options = buildOptionsTable(product);
                 $("#productdialogcontent").html(product.bodyHtml + options);
                // show the dialog
                $( "#productdetails" ).dialog('open');
            }
            
            
        }
        
        
    });
    
}
