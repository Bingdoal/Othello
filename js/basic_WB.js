//遊戲初始化   
function reset(){
	for(var i=0; i<8; i++){
		have_piece_array[i] = new Array(8);
			for(var j=0; j<8; j++ ){
				have_piece_array[i][j] = 0;
			}
	}
	text_on_html.innerHTML ="";
	tips.style="font-size:18px;font-weight:bolder;color:#000000";
	tips.innerHTML="黑子先下";
	step=4;
	who = -1;
	end_check=-1;
	ctx.clearRect(0,0,can.width,can.height);
	draw_board();
	init_ball();
	print_score(step);
	var predi = prediction(have_piece_array,who);
	tips_board(predi);
	can.addEventListener('mousedown',MouseDown,false);
}
//init 初始棋盤
function init_ball(){
	var init_B = [],
		init_W = [];	
	for(var i=0; i<2; i++){    
		init_B.push(new piece("#000000")); //黑子
		init_B[i].draw(ctx,board.edge*(i+4),board.edge*(5-i));
		have_piece_array[i+3][4-i] = -1;    
		init_W.push(new piece("#ffffff")); //白子
		init_W[i].draw(ctx,board.edge*(i+4),board.edge*(i+4));
		have_piece_array[i+3][i+3] = 1; 
	}
}
			  
//畫上棋盤以及編號
function draw_board(){
	for(var i = board.edge/2 ; i<can.width-board.edge/2 ; i+=board.edge ){
		for(var j = board.edge/2 ; j<can.height-board.edge/2 ; j+=board.edge )
			board.draw(ctx,i,j);
	}
	for(var i = board.edge ; i<can.width-board.edge/2 ; i+=board.edge){
		ctx.fillText( parseInt(i/(board.edge/2)/2)-1,i,15);
		ctx.fillText( parseInt(i/(board.edge/2)/2)-1,10,i+5);
	}
}	
//下棋
function place_piece(px,py){
	var predi = prediction(have_piece_array,who);
	if(end_check==1){return false;}
	if(location_error(px,py,predi)){
		eat_piece(px,py,have_piece_array,who);
		play_piece(px,py);
		text_on_html.innerHTML = " ";
		if(who==1){
			tips.style="font-size:18px;font-weight:bolder;color:#ffffff";
			tips.innerHTML="換白子";
		}else{
			tips.style="font-size:18px;font-weight:bolder;color:#000000";
			tips.innerHTML="換黑子";
		}
		return true;
	}
	return false;
}
//放置地點錯誤判斷
function location_error(px,py,predi){
	if(( (px<0) || (py<0) || (px>7) || (py>7) )){
		text_on_html.innerHTML = "放置位置錯誤，點擊在棋盤外";
	}else{
		for(var i=0;i<predi.length;i++){
			if(px==predi[i].x && py==predi[i].y){
				return true;
			}
		}
		text_on_html.innerHTML = "放置位置錯誤，此處不可下棋";
	}
	return false;
}
//吃子
function eat_piece(px,py,piece_board,which_piece){
	if(piece_board[py][px]!=0){return false;}
	var around_X = [-1, 0, 1,1,1,0,-1,-1],
		around_Y = [-1,-1,-1,0,1,1, 1, 0],
	reverse = which_piece*-1,
	tmpY,tmpX,
	check = false;
	for(var i=0;i<8;i++){
		tmpY = (py+around_Y[i]);
		tmpX = (px+around_X[i]);
		//超出陣列範圍的判斷
		if(tmpY>7 || tmpX>7 || tmpY<0 || tmpX<0)
			continue;
		//周圍是否有相反的棋子
		if(piece_board[tmpY][tmpX] == reverse){
			while(tmpY<8 && tmpX<8 && tmpY>=0 && tmpX>=0){
				//往此方向延伸搜尋
				if(piece_board[tmpY][tmpX]==which_piece){
					while(tmpY!=py || tmpX!=px){
						piece_board[tmpY][tmpX]=which_piece;
						tmpY-=around_Y[i];
						tmpX-=around_X[i];
					}
					check = true;
					break;
				}else if(piece_board[tmpY][tmpX]==0){break;}
				tmpY+=around_Y[i];
				tmpX+=around_X[i];
			}
		}
	}
	if(check){piece_board[py][px]=which_piece;}
	return check;
}			
//預測棋盤可下的位置
function prediction(piece_board,which_piece){
	var tp_board = new Array(8);
	var predi_board = new Array();
	for(var i=0;i<8;i++){
		tp_board[i] = new Array(8);
		for(var j=0;j<8;j++){
			tp_board[i][j]=0;
		}
	}
	clone_array(piece_board,tp_board);
	for(var i=0;i<8;i++){
		for(var j=0;j<8;j++){
			if(eat_piece(i,j,tp_board,which_piece)){
				predi_board.push(new node(undefined,i,j));
				clone_array(piece_board,tp_board);
			}
		}
	}

	return predi_board;
}
function clone_array(arr1,arr2){
	for(var i =0;i<arr1.length;i++)
		for(var j=0;j<arr1[i].length;j++)
				arr2[i][j]=arr1[i][j];
}
//依順序，放上對應顏色棋子
function play_piece(place_x,place_y){
	var pic_w = new piece("#ffffff"), 
	pic_b = new piece("#000000"),	  
	predi = prediction(have_piece_array,who*-1);
	ctx.clearRect(0,0,can.width,can.height);
	for(var y=0;y<8;y++){
		for(var x=0;x<8;x++){
			if(have_piece_array[y][x]==1){
				pic_w.draw(ctx,board.edge*(x+1),board.edge*(y+1));
			}else if(have_piece_array[y][x]==-1){
				pic_b.draw(ctx,board.edge*(x+1),board.edge*(y+1));
			}
		}
	}
	tips_board(predi);
	draw_board();
	step++;
	print_score(step);
	setTimeout(function(){winner_check(step,have_piece_array);},10);
	who *= -1;
	if(predi.length==0){
		who*=-1;
		predi = prediction(have_piece_array,who);
		tips_board(predi);
	}
}
function tips_board(predi){
	var tc = new tips_circle("#ff0000",bc.value);
	for(var i=0;i<predi.length;i++){
		var x = predi[i].x;
		var y = predi[i].y;
		tc.draw(ctx,board.edge*(x+1),board.edge*(y+1));
	}
}
//加總陣列 算分數
function ratio(map){
	var score = 0;
	for(var i=0;i<8;i++){
		for(var j=0;j<8;j++)
			score+=map[i][j];
	}
	return score;
}
//勝利判斷
function winner_check(piece_step,map){
	var score = ratio(map);
	var predi_score = prediction(map,who).length;
	if(predi_score==0){
		end_check++;
		predi_score = prediction(map,who*-1).length;
		if(predi_score==0){
			end_check++;
		}else{
			end_check=-1;
		}
	}else{
		end_check=-1;
	}
	if(piece_step==64 || end_check>1){
		end_check=1;
		if(score>0){
			alert("白子勝利!!!!!");
			tips.innerHTML="白子勝利!!!!!";
		}
		else if(score<0){
			alert("黑子勝利!!!!!");
			tips.innerHTML="黑子勝利!!!!!";
		}
		else{ 
			alert("平手!!!!!");
			tips.innerHTML="平手!!!!!";
		}
	}else if(Math.abs(score)==piece_step){
		end_check=1;
		if(who>0){
			alert("白子勝利!!!!!");
			tips.innerHTML="白子勝利!!!!!";
		}else{
			alert("黑子勝利!!!!!");
			tips.innerHTML="黑子勝利!!!!!";
		}
	}
}
//介面
function print_score(place_step){
	var score = 0;
	var white_ctx = document.getElementById("white").getContext("2d");
	var black_ctx = document.getElementById("black").getContext("2d");
	var w = new piece("#ffffff");
	var b = new piece("#000000");
	w.draw(white_ctx,25,25);
	b.draw(black_ctx,25,25);
	score = ratio(have_piece_array);
	white_ctx.font = "bold 25px Arial";
	white_ctx.fillText( Math.round( (place_step+score)/2) ,13,34);
	black_ctx.font= "bold 25px Arial";
	black_ctx.fillStyle="#fff";
	black_ctx.fillText( Math.round( (place_step-score )/2) ,13,34);
}

function getMap(){
	return have_piece_array;
}