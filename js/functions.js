//AL cargar llenar el select inicial
window.onload = function(){
	listEmployees();
};

//Listar los empleados en el select
function listEmployees(){
	fetch('http://localhost:2828/listEmployees')
	.then((respuesta) => {
		return respuesta.json();
	}).then((respuesta) => {
		respuesta.forEach(function (registro){
			document.getElementById('selectBox').innerHTML +=
			"<li class='list-group-item' onClick='makeReport(" + registro.id + ")'>" + 
				registro.name + "</li>"
		});
	})
}

//Mostrar los registros de ese dia del empleado
function makeReport(id){
	//Obtener el nombre del empleado del que se busca el reporte
	fetch('http://localhost:2828/getEmployee/' + id)
	.then((respuesta) => {
		return respuesta.json();
	} ).then((respuesta) => {
		respuesta.forEach(function (registro){
		document.getElementById('employee').innerHTML = registro.name;
		});
	})
	//Obtener el reporte para llenar la tabla
	document.getElementById('resultado').innerHTML = "";//Vaciar la tabla
	document.getElementById('printButton').removeAttribute('disabled');
	fetch('http://localhost:2828/makeReport/' + id)
	.then((respuesta) => {
		return respuesta.json();
	} ).then((respuesta) => {
		respuesta.forEach(function (registro){
		document.getElementById('resultado').innerHTML +=
		    "<tr>" +
		    	"<td scope='row'>" + registro.idRegistro + "</th>" +
		    	"<td>" + registro.idDeudor + "</td>" +
		    	"<td>" + registro.idEmpleado + "</td>" +
		    	"<td>" + registro.fechaRegistro + "</td>" +
		    	"<td>" + registro.observaciones + "</td>" +
		    	"<td>" + registro.fechaPago + "</td>" +
		    "</tr>";
		});
	})
	document.getElementById('printButton').removeAttribute('disabled');
}

//Imprimir el reporte mostrado en la pantalla
function printReport(){
	doc = new jsPDF();
	doc.setProperties({
		title: 'Reporte mensual',
		subject: 'Reporte de registros mensuales de agente',
		author: 'Olmocall',
		keywords: 'Reporte, registro',
		creator: 'Olmocall',
	});
	items = document.getElementById('resultado').getElementsByTagName('tr');
	employee = document.getElementById('employee').innerHTML;
	doc.setFontSize(12);
	doc.text(5, 10, "Reporte mensual " + employee);
	doc.setFontSize(9);
	doc.text(5, 20, "#");//Id del registro
	doc.text(15, 20, "#Deudor");//Id del deudor
	doc.text(35, 20, "#Empleado");//Id del empleado
	doc.text(60, 20, "Fecha");//Fecha
	doc.text(85, 20, "Observaciones");//Observaciones
	doc.text(150, 20, "Fecha de pago");//Observaciones
	for (i = 0; i < items.length; i++) {
	    itemValues = items[i].getElementsByTagName('td');
	    doc.text(5, (25 + (i*5)), itemValues[0].innerHTML);//Id del registro
	    doc.text(15, (25 + (i*5)), itemValues[1].innerHTML);//Id del deudor
	    doc.text(35, (25+ (i*5)), itemValues[2].innerHTML);//Id del empleado
	    doc.text(60, (25+ (i*5)), itemValues[3].innerHTML);//Fecha
	    doc.text(85, (25 + (i*5)), itemValues[4].innerHTML);//Observaciones
	    doc.text(150, (25 + (i*5)), itemValues[5].innerHTML);//Fecha de pago
	}
	doc.line(10, 15, 10, 280)//Linea divisora del documento
	doc.line(33, 15, 33, 280)//Linea divisora del documento
	doc.line(55, 15, 55, 280)//Linea divisora del documento
	doc.line(80, 15, 80, 280)//Linea divisora del documento
	doc.line(145, 15, 145, 280)//Linea divisora del documento
	doc.save("Reporte Mensual");
}