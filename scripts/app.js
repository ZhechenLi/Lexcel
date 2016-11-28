var cellModel = {
	"currentCells": [

	],
	"cells": {
		"a": {
			"1": {"value": 0}
		}
	}
}

var octopus = function(){
	this.getCurrentCell = function(){
		return cellModel.currentCells;
	},
	this.changeCurrentCell = function(cell){
		cellModel.currentCells = cell();
	},
	this.changeCell = function(col, row, value) {
		cellModel.cells.col.row.value = value;
	}

}

var render = function(){
	this.init = function(){
		cellInit();
		titleRender();
	}
	function cellInit() {

	}
	function titleRender(){

	};
}




$(window).load(function(){
	var sheet = '<tr>';
	for(var cols = 30; cols > 0; cols -- ) {
		for(var rows = 30; rows > 0; rows --){
			sheet += '<td class="cell"></td>'
		}
		sheet += '</tr>';
	}
	$("#sheet1").append('<table class="table table-bordered"><tbody></tbody></table>');
	
	$("#sheet1 tbody").append(sheet);


	// $(".cell").click(function(){
	// 	console.log($(this).offset().top);
	// 	console.log($(this).offset().left);
	// 	console.log('width:' + $(this).outerWidth());
	// 	console.log('height:' + $(this).outerHeight());
	// })
	
	$(".cell").mousedown(function(){
		// $('.cellInput').remove();
		var cell = $(this)
		cell.css({
			'border': '10',
			'border-color': '#0000ff'

		})
		// console.log($(this).offset().top);
		// console.log($(this).offset().left);
		// console.log('width:' + $(this).outerWidth());
		// console.log('height:' + $(this).outerHeight());
		var value = cell.val();
		var top = cell.offset().top;
		var left = cell.offset().left;
		var width = cell.outerWidth();
		var height = cell.outerHeight();

		if(!cell.children().length){
			cell.append('<input type="text" class="cellInput">')
			$('.cellInput').css({
				value: value,
				top: top + 1, 
				left: left + 1,
				width: width - 1, 
				height: height - 1, 	
			})
		}
		// $('.cellInput').bind('input onchange', function() {
  //   	// console.log($(this).val());
	 //    	$(cell.text($(this).val()))
	    	
	 //    	/* 
	 //    	octopus.getCurrentCell.changCell
	 //    	*/
	    	
		// });
		//失去焦点时将值写入表格元素
		$('.cellInput').blur(function(){
			console.log($(this).val());
			$(cell.text($(this).val()))
		})
	})
	
	
	


	
});