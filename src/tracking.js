// tracking phone click
$('.call-phone').click(function(e){
	e.stopPropagation();
	gtag('event', 'click',{ 'event_category': 'Phone','non_interaction': true});
}); 
$('#messageus_button').click(function(e){
	e.stopPropagation();
	gtag('event', 'click',{ 'event_category': 'Messenger','non_interaction': true});
});

$('.genesys-zalo-cta').click(function(e){
	e.stopPropagation();
	gtag('event', 'click',{ 'event_category': 'Zalo','non_interaction': true});
});