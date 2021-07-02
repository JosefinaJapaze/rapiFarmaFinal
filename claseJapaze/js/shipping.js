//SHIPPING

//This function calculates the shipping cost based on postal code of the client. For calclating shipping, the function access to shipping data located on a .json file
$( ".calculateShip" ).on( "click", function() { //changed to jQuery
    const shippingBase = 50;
    let postalCode;
    try {
        //postalCode = parseInt(prompt("Ingresa tu código postal", "1234"));
        postalCode = $('#yourPostalCode').val();
    } catch(e) {
        alert("El codigo postal es invalido");
        return;
    }
    $.getJSON("data/zipCodes.json", function(result){
        let found = false;
        $.each(result, function(i, value) {
            if (postalCode.toString() === value.code) {
                $("#shippingCostFinal").prepend("Costo de envio total para " + value.placeName +": $" +(value.price + shippingBase))
            .css("color", "black");
            
            $(".getPostalCode").hide();
            $(".postalCodeInstructions").hide();
                //alert("Costo de envio total: $" +(value.price + shippingBase));
                found = true;
                return;
            }
        });
        if (!found) {
            $("#shippingCostFinal").prepend('El código postal es inválido')
            .css("color", "red")
            .fadeOut(1000);
            //alert("El codigo postal es invalido");
        }
    });
});
//This function gets the supported postal codes for shipping, from data located on a .json
  function fetchPostalCodes() {
    $.getJSON("data/zipCodes.json", function(result){
        let html = "<ul>";
      $.each(result, function(i, field){
          console.log(field);
          html += "<li><h5>" + field.placeName + ": <span class='postalCodeNum'>" + field.code + "</span><h5></li>";
      });
      html += "</ul>";
      $("#postal-codes")
        .append(html)
        .hide()
        .fadeIn(600);
        $(".postalCodeNum").css({color: "white"})
    $(".showPostalCodes").hide();
    $("#ZIP").hide();
    });
  }
