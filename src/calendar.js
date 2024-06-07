/*
 * 
 *
 * By Johannes Schildgen, 2021
 */
 
var CalendarPlugin = (function(){

	var color_codes = {
		"green" : "rgba(66, 169, 170, 0.99)",
		"yellow" : "#ffcb63",
		"orange" : "#ffaa63",
		"gray" : "#797d9a",
		"red" : "#ff6363",
		"blue" : "#5473b9"
	}
    
	return {
		init: function() {        
            document.querySelectorAll('[data-calendar]').forEach(function(item) {
								var date = new Date(item.getAttribute('data-calendar'));
								var monthNames;
								switch($("html")[0].lang) {
									case "en": monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
														 weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
													break;
									default: monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]; 
													 weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
													break;
								}

								var end_date = item.getAttribute('data-calendar-end');

								var colors = {
									"red" : item.getAttribute('data-calendar-red') == null ? [] : item.getAttribute('data-calendar-red').split(","),
									"yellow" : item.getAttribute('data-calendar-yellow') == null ? [] : item.getAttribute('data-calendar-yellow').split(","),
									"green" : item.getAttribute('data-calendar-green') == null ? [] : item.getAttribute('data-calendar-green').split(","),
									"orange" : item.getAttribute('data-calendar-orange') == null ? [] : item.getAttribute('data-calendar-orange').split(","),
									"blue" : item.getAttribute('data-calendar-blue') == null ? [] : item.getAttribute('data-calendar-blue').split(","),
									"gray" : item.getAttribute('data-calendar-gray') == null ? [] : item.getAttribute('data-calendar-gray').split(",")
								}
								var monthName = monthNames[date.getMonth()];
								var year = date.getFullYear();

								var html = '<h3 style="font-size: 90%; margin-bottom: -1mm;">';
								html += monthName+" "+year;
								html += '</h3>';
								html += '<table><tbody><tr>';
								for(var i = 1; i <= 5; i++) {
								html += '<td>'+weekdays[i]+'</td>';
								}
								html += '</tr>';

								var firstRow = true;

								newDate = new Date(date);
								for(var i = 0; i < 31; i++) {
									newDate.setDate(date.getDate()+i);
									if(newDate.getMonth() != date.getMonth()) { break; }
									if(newDate.getDay() == 0 || newDate.getDay() == 6) { continue; } // weekend

									if(newDate.getDay() == 1 || firstRow) { 	// Monday
										html += '<tr>';
									}

									if(firstRow) {
										for(var j = 1; j < newDate.getDay(); j++) {
											html += '<td>&nbsp;</td>';
										}
										firstRow = false;
									}

									var classinfo = "";
									var first_color = null;
									for(color in colors) {
										if(colors[color].indexOf(""+newDate.getDate()) > -1) {
											if(classinfo == "") {
												classinfo = ' class="sl-block-content '+color+'"';
												first_color = color;
											} else {
												classinfo += ' style="background-image: -webkit-linear-gradient(126deg, '+color_codes[color]+' 50%, '+color_codes[first_color]+' 50%);"';
											}
											
										}
									}
									html += '<td'+classinfo+'>';
									html += newDate.getDate();
									html += '</td>';

									if(newDate.getDate() == end_date) {
										html += '</tr>';
										break;
									}
									
									if(newDate.getDay() == 5) {  // Friday
										html += '</tr>';
									}
								}
								if(newDate.getDay() != 5) {  // No Friday
									html += '</tr>';
								}

								html += '</tbody></table>';

								item.innerHTML = html;
            })
		}
	}

})();

Reveal.registerPlugin( 'calendar', CalendarPlugin );