var cellModel = (function() {

		// 创建一个二维数组
	var cells = {},
		// 当前处于激活状态的表格元素(可能是一个或以上)
		currentCells = {},
		size = {
			// 默认的列宽及行高分别为80和20
			width: {'default': 80},
			height: {'default': 20}
		};

	var cell = function(col, row, value) {
		this.name = col + row;
		this.col = col;
		this.row = row;
		this.value = value;
	};

	return {
		setCell: function(col, row, value) {
			var newCell = new cell(col, row, value);
			cells[newCell.name] = newCell;
		},
		getCell: function(col, row) {
			var id = col + row;
			return cells[id];
		},
		getAllCells: function() {
			return cells;
		},
		setCurrentCells: function(col, row) {
			//设置当前激活的单元格
			var id = col + row;
			currentCells[id] = cells[id];
			console.log('Cell \'' + currentCells[id].name + '\' has been added in currentCells');
		},
		getCurrentCells: function() {
			console.log('getCurrentCells() has been call');		
			console.log(currentCells);	
			return currentCells;
		},
		clearCurrentCells: function() {
			currentCells = {};
		},
		setSize: function(size, pos, isCol) {
			//当isCol为true,表示将要改变的为列宽, false则为行高.
			if(isCol){
				// 将指定的列设为指定的宽度
				size.col[pos] = size;
			}else{
				size.row[pos] = size;
			}
		},
		getSize: function() {
			return size;
		}
	}
}());

var render = function(){;
	var size = cellModel.getSize(),
		windowWidth = $(window).height(),
		windowHeight = $(window).height(),
		i,y,
		colNum = windowWidth/size.width,
		rowNum = windowWidth/size.height

	var sheet = '<tr>';

	for(i = colNum + 1; i > 0; i -- ) {
		for(y = rowNum + 1; y > 0; i -- ) {
			sheet += '<td class="cell"></td>'
		}
	}

	$("#sheet1").append('<table class="table table-bordered"><tbody></tbody></table>');
	
	$("#sheet1 tbody").append(sheet);
	


}

$(window).load(function(){
	console.log($(window).height());
	console.log($(window).width());
	console.log($(document).height());
	console.log($(document).width());
});



/*
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
		// 
		//失去焦点时将值写入表格元素
		
		/*
		$('.cellInput').blur(function(){
			console.log($(this).val());
			$(cell.text($(this).val()))
		})
	})
	
		



	
 });***/