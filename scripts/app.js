var cellModel = (function() {

		// 创建一个二维数组
	var cells = {},
		// 当前处于激活状态的表格元素(可能是一个或以上)
		currentCells = {},
		size = {
			// 默认的列宽及行高分别为80和20
			col_width: {'default': 60},
			row_height: {'default': 20}
		},
		top,
		bottom,
		left,
		right,
		firstCurCell = {};

	// 定义一个cell类以存储单个单元格信息
	var cell = function(col, row, value) {	
		// 将传入的列号从数字转换为字母
		this.col = transToAlpha(col);
		this.row = row;
		this.name = this.col + this.row;
		this.value = value;
	};

	(function() {
		
	}());


	//公用API
	return {
		// 返回当前激活单元格的最大范围, 例:
		// currentCells = {
		// 		a1,a2,a3,
		// 		b1,b2,b3,
		// 		c1,c2,c3,
		// 		d1,d2,d3,
		// 		e1,e2,e3,
		// }
		// 返回{'top': 1, 'bottom': 5, 'left': 1, 'right': 3}; 
		// 输入当前鼠标悬停的单元格id
		getCurCellsRange: function() {
			return {
				'top': top,
				'bottom': bottom,
				'left': transToNum(left),
				'right': transToNum(right)
			};
		},
		// 
		// 输入当前坐标, 激活所有
		setCurCellsRange: function(cur_id) {
			// 在currentCells为空的时无法调用此方法
			if ($.isEmptyObject(this.currentCells)) {
				console.log('setCurCellsRange() was wrong!');
				return;
			}

			var curCell = this.currentCells[cur_id],
				firstCell = firstCurCell;

			if(firstCell.name == cur_id){
				console.log('only have one curCell');
			}

			// 激活选中框内所有的元素, 将框外的被激活单元格清除
			for(var row = top; row <= bottom; row ++) {
				for(var col_num = transToNum(left); col_num <= transToNum(right); col_num ++) {
					// console.log('col_num: ' + col_num);
					if(row > curCell['row'] || col_num > transToNum(curCell['col'])) {
						this.deleteCurrentCell(combinId(transToAlpha(col_num), row))

					} else {
						this.setCurrentCells(combinId(transToAlpha(col_num), row));
					}
				}
			}

			// 根据第一个被激活单元格及当前激活单元格确定选框四角坐标
			if(curCell['col'] >= firstCell['col']) {
				// curCell 在 firstCell的右边
				left = firstCell.col;
				right = curCell.col;
				if(curCell.row >= firstCell.row) {
					// curCell 在 firstCell的右下
					top = firstCell.row;
					bottom = curCell.row;
				}else {
					// curCell 在 firstCell的右上
					top = curCell.row;
					bottom = firstCell.row;
				}
			}else if(curCell.row > firstCell.row) {
				// curCell 在 firstCell 的左下
				top = firstCell.row;
				bottom = curCell.row;
				left = curCell.col;
				right = firstCell.col;
			}else if(curCell.row < firstCell.row) {
				// curCell 在 firstCell 的左上
				top = curCell.row;
				bottom = firstCell.row; 
				left = curCell.col;
				right = firstCell.col;
			}else {
				console.log('getCurCellsRange() was wrong!');
			}
			// console.log('setCurCellsRange: ');
			// console.log(currentCells);

		},
		getFirstCurCell:function(){
			if(firstCurCell.length == 0){
				console.log('getFirstCurCell() was wrong!')
			}
			return firstCurCell;
		},
		setFirstCurCell: function(id){
			firstCurCell = cells[id];
			if(firstCurCell == {}){
				console.log('setFirstCurCell() was wrong!')
			}
		},
		clearFirstCurCell: function(){
			firstCurCell = {};
			// console.log($.isEmptyObject(firstCurCell));
			if(!$.isEmptyObject(firstCurCell)){
				console.log('clearFirstCurCell() was wrong!')
			}
		},
		setCell: function(col, row, value) {
			var id = col + row;
			if(!(id in cells)){
				var newCell = new cell(col, row, value);
				cells[newCell.name] = newCell;
			} else {
				cells[id].value = value;
			}
		},
		getCell: function(id) {
			
			if((typeof sparateId(id)[0] != 'string') && (typeof sparateId(id)[1] != 'number')) {
				console.log('getCell() id is wrong!');
			}
			return cells[id];
		},
		getAllCells: function() {
			return cells;
		},
		setCurrentCells: function(id) {
			if($.isEmptyObject(this.currentCells)){
				this.setFirstCurCell(id);
			}
			if (!(id in this.currentCells)) {
				this.currentCells[id] = cells[id];
				$('#' + id).addClass('currentCells');
			}
			// this.setCurCellsRange(id);
		},
		getCurrentCells: function() {
			if ($.isEmptyObject(this.currentCells)) {
				console.log('currentCells was empty!!');
				return;
			}
			console.log('--- currentCells now was ---');
			for( cell in this.currentCells){
				console.log(currentCells[cell]);
			}	
			console.log('--- currentCells now was ---');
			return this.currentCells;
		},
		deleteCurrentCell: function(id) {
			delete this.currentCells[id];
		},
		clearCurrentCells: function() {
			
			this.currentCells = {};
			$('.currentCells').each(function(){
				$(this).removeAttr('style');
				$(this).removeClass('currentCells');
			});
			this.clearFirstCurCell();
			if(!$.isEmptyObject(this.currentCells)){
				console.log('clearCurrentCells(): currentCells clear fail');
			}

			
		},
		// 修改单元格参数(长或宽, 行号或列号. 例: 若传入参数为(10,2),则表示将第2行的高设为10px)
		setSize: function(size, pos) {
			//当传入的pos参数为数字, 表示传入的是行号, 否则则是列号. (行号为数字, 列号为字母)
			if(pos * 1){
				// 修改行高
				size.row_height[pos] = size;
			}else{
				// 修改列宽
				size.col_width[pos] = size;
			}
		},
		getSize: function() {
			return size;
		}
	}
}());

var render = function(){
	var size = cellModel.getSize(),		// 初始化时取得默认值
		windowWidth = $(window).width(),
		windowHeight = $(window).height(),
		i,y, // 循环因子
		colNum = windowWidth/size.col_width.default,	//根据窗口宽度除以单元格宽度取得第一次渲染的单元格数量
		rowNum = windowWidth/size.row_height.default;
	
	/*
	

						单元格初始化

	*/

	var initTable = function(sheetId) {
		//创建表头
		$('#' + sheetId).append('<table class="table table-bordered table-head"><tbody></tbody></table>');
		var sheet = '';
		//创建列号a, b, c, d...
		sheet += '<tr class="th">';
		for(i = 0; i < colNum + 1; i ++ ) {
			sheet += '<td class="th-col" id="col-' + transToAlpha(i) + '" style="padding: 0px;">' + transToAlpha(i) + '</td>';
		}
		//创建行号1, 2, 3, 4...
		sheet += '</tr>';
		for(y = 1; y < rowNum + 1; y ++ ) {
			sheet += '<tr><td class="th-row" id="row-' + y + '" style="padding: 0px;">' + y + '</td></tr>';
		}

		$('#' + sheetId + '.table-head').append(sheet);

		// 创建刚好能覆盖整个页面的单元格
		var th_row = $('.th-row');

		th_row.each(function(row){

			for(var col = 0; col < colNum * 2; col ++ ) {
				cellModel.setCell(col + 1, row + 1, 0);
				var cell = cellModel.getCell(col + 1, row + 1);
				$(this).closest('tr').append('<td class="cell" id="' + cell.name + '"></td>');
			}
		});
	};

	//创建表头
	$('#sheet1').append('<table class="table table-bordered table-head"><tbody></tbody></table>');
	var sheet = '';

	//创建列号a, b, c, d...
	sheet += '<tr class="th">';
	for(i = 0; i < colNum + 1; i ++ ) {
		sheet += '<td class="th-col" id="col-' + transToAlpha(i) + '" style="padding: 0px;">' + transToAlpha(i) + '</td>';
	}
	//创建行号1, 2, 3, 4...
	sheet += '</tr>';
	for(y = 1; y < rowNum + 1; y ++ ) {
		sheet += '<tr><td class="th-row" id="row-' + y + '" style="padding: 0px;">' + y + '</td></tr>';
	}

	$('#sheet1 .table-head').append(sheet);

	// 创建刚好能覆盖整个页面的单元格
	var th_row = $('.th-row');

	th_row.each(function(row){
		// console.log(row);
		for(var col = 0; col < colNum; col ++ ) {
			cellModel.setCell(col + 1, row + 1, 0);
			var cell = cellModel.getCell(combinId(transToAlpha(col + 1), row + 1));
			// console.log(cell);
			$(this).closest('tr').append('<td class="cell" id="' + cell.name + '"></td>');
		}
	});
	
	console.log('render');
	/*
	
		单元格初始化

	*/
	var mouseStatus = 'up';	// 记录鼠标左键是否松开

	$('.cell').mousedown(function(){
		var id = $(this).attr('id');
		mouseStatus = 'down';

		cellModel.clearCurrentCells();
		
		cellModel.setCurrentCells(id);
		console.log(cellModel.getCurrentCells());
		cellModel.setCurCellsRange(id);
		
		setCurCellsStyle();	//对选中的单元格进行渲染
		
	});

	$('.cell').mouseup(function(){
		console.log(cellModel.getCurCellsRange());
		console.log('mouseup');
		mouseStatus = 'up';
	});

	$('.cell').mousemove(function(){
		if(	mouseStatus == 'down'){
			var id = $(this).attr('id');
			cellModel.setCurrentCells(id);
			cellModel.setCurCellsRange(id);
			setCurCellsStyle();	//对选中的单元格进行渲染
		}
	});

	//对当前激活的单元格进行渲染
	var setCurCellsStyle = function() {		
		var range = cellModel.getCurCellsRange();
		$('.currentCells').each(function(){
			$(this).removeAttr('style');
			var thisCell = $(this);
			var id = sparateId(thisCell.attr('id'));
			
			// 设置激活区域的边框颜色
			thisCell.css((function(){
				var boderSet = {},
					borderStyle = '3px solid #5c7a29';

				if(id[1] == range.top) {
					boderSet['border-top'] = borderStyle;
				}  
				if(id[1] == range.bottom) {
					boderSet['border-bottom'] = borderStyle;
				} 
				if(transToNum(id[0]) == range.left) {
					boderSet['border-left'] = borderStyle;
				}
				if(transToNum(id[0]) == range.right) {
					boderSet['border-right'] = borderStyle;
				}
				return boderSet;
			}()))
		})
	}

    // dbclick事件：dbclick事件在用户完成迅速连续的两次点击之后触发，双击的速度取决于操作系统的设置。一般双击事件在页面中不经常使用。
    $(document).dblclick(function(){
	    alert('dbclick function is running !');
    });
};
render();


//调试区
// console.log(transToAlpha(27));
// console.log(transToAlpha(1));
// console.log('a: ' + transToNum('a') + ' aa: ' + transToNum('aa'));




//将列号从数字改为字母,例:传入1则返回'a', 传入27则为'aa'.
function transToAlpha(num) {
	// 判断输入是否为数字
	if(typeof(num) != "number" ){
		console.log(num + " is no a number!!");
		return num;
	}
	//将输入的数字分为第一位及第二位
	var time_1 = parseInt((num - 1) / 26),
	time_2 = (num - 1) % 26,
	result = '';
	// 当num小于27时, 转换出来的字符串只有一位
	if(num < 27){
		result = String.fromCharCode( 'a'.charCodeAt() + time_2);
	}else {
		result = String.fromCharCode('a'.charCodeAt() -1 + time_1 ) + String.fromCharCode( 'a'.charCodeAt() + time_2);
	}
	
	return result;
}


//将列号从字母改为数字,例:传入'a'则返回1, 传入'aa'则返回27.
function transToNum(char) {
	var charStr = [],
	result = '';

	if(typeof(char) != "string" ){
		// alert(num + " is no a number!!");
		console.log(char + " is no a string!!");
		return char;
	}

	if(char.length == 1){
		result = char.charCodeAt() - 'a'.charCodeAt() + 1
	}else if(char.length == 2){
		charStr = char.split("")
		result = (charStr[0].charCodeAt() - 'a'.charCodeAt() + 1) * 26 + (charStr[1].charCodeAt() - 'a'.charCodeAt() + 1);
	}
	
	return result;	
}

// 将id从字母加数字的字符串转换成数字加数字的数组,例:'a1' -> [a,1]
function sparateId(id) {
	var col = id.replace(/[0-9]+$/g, ''),
		row = id.replace(/^[a-z]+/gi, ''),
		result = [col,row];
	return result;
}

// 将id转换成字母加数字的字符串,例:[a,1] -> 'a1'
function combinId(col, row) {
	var col = col,
		row = row,
		result = col + row;
	if(typeof col != 'string' && typeof row != 'number'){
		console.log('transToAlpha is fail')
	}
	return result;
}


$(window).load(function(){
	// console.log($(window).height());
	// console.log($(window).width());
	// console.log($(document).height());
	// console.log($(document).width());
	$(window).resize(function () {          //当浏览器大小变化时
	    // alert($(window).height());          //浏览器时下窗口可视区域高度
	    // alert($(document).height());        //浏览器时下窗口文档的高度
	    // alert($(document.body).height());   //浏览器时下窗口文档body的高度
	    // alert($(document.body).outerHeight(true)); //浏览器时下窗口文档body的总高度 包括border padding margin
	});
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
	 //    	octopus.getCurrentCells.changCell
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