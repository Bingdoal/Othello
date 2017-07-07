var edge_table=
[	[300,0,5,5,5,5,0,300],
	[0,-10,0,0,0,0,-10,0],
	[5,0,0,0,0,0,0,5],
	[5,0,0,0,0,0,0,5],
	[5,0,0,0,0,0,0,5],
	[5,3,0,0,0,0,0,5],
	[0,-10,0,0,0,0,-10,0],
	[300,0,5,5,5,5,0,300]	];
var node = function(value,x,y){
	this.value = value;
	this.x = x;
	this.y = y;
}
var deep = 6;
function run_AI(step){
	if(end_check!=-1 || step==64){return false}
	can.removeEventListener('mousedown',MouseDown,false);
	var dis = MinMaxSearch(have_piece_array,AI_id,deep,-999,999);
	console.log(dis.x,dis.y);
	place_piece(dis.x,dis.y);
	if(who == AI_id){setTimeout(function(){run_AI(step);},delay);}
	can.addEventListener('mousedown',MouseDown,false);
}
//簡單電腦
function EasyAI(map){
	var predi = prediction(map,AI_id);
	var score=0;//next move point
	var dis = new node(undefined,undefined,undefined);
	var tmp_array = new Array(8);
	for(var i=0;i<8;i++){
		tmp_array[i] = new Array(8);
	}
	clone_array(map,tmp_array);
	for(var i=0;i<predi.length;i++){
		var x = predi[i].x;
		var y = predi[i].y;
		eat_piece(x,y,tmp_array,AI_id);
		score = evaluation(tmp_array,AI_id)*AI_id;
		if( score>=dis.value){
			dis.value = score;
			dis.x = x;
			dis.y = y;
		}else if(dis.value===undefined){
			dis.value = score;
			dis.x = x;
			dis.y = y;
		}
		clone_array(map,tmp_array);
	}
	// console.log("dx:",dis.x,"dy:",dis.y);
	// console.log("value:",dis.value);
	return dis;
}
//最大最小搜尋
function MinMaxSearch(map,id,height,alpha,beta){
	var predi = prediction(map,id);
	var dis = new node(undefined,undefined,undefined);
	var tmp_array = new Array(8);
	var score;
	for(var i=0;i<8;i++){
		tmp_array[i] = new Array(8);
	}
	clone_array(map,tmp_array);
	if((deep-height)+step>=64 || height==0){
		for(var i=0;i<predi.length;i++){
			var x = predi[i].x;
			var y = predi[i].y;
			var next_map = eat_piece(x,y,tmp_array,id);
			var score = evaluation(tmp_array,AI_id)*AI_id;
			if( score>=dis.value){
				dis.value = score;
				dis.x = x;
				dis.y = y;
			}else if(dis.value===undefined){
				dis.value = score;
				dis.x = x;
				dis.y = y;
			}
			clone_array(map,tmp_array);
		}
		return dis;
	}
	for(var i=0;i<predi.length;i++){
		var x = predi[i].x;
		var y = predi[i].y;
		var next_map = eat_piece(x,y,tmp_array,id);
		score = MinMaxSearch(tmp_array,id*-1,height-1,alpha,beta);
		if(id==AI_id && score.value>=dis.value){
			alpha = score.value;;
			dis.value = score.value;
			dis.x = x;
			dis.y = y;
		}else if(id!=AI_id && score.value<=dis.value){
			beta = score.value;;
			dis.value = score.value;
			dis.x = x;
			dis.y = y;	
		}else if(dis.value===undefined){
			if(id==AI_id)alpha = score.value;
			else beta = score.value;
			dis.value = score.value;
			dis.x = x;
			dis.y = y;
		}
		clone_array(map,tmp_array);
		if(alpha>beta) break;
	}
	return dis;
}
//評分函數
function evaluation(map,id){
	var weight = 64/step;
	var w=[-3*weight,2/weight,5/weight,4/weight,5/weight];//對方行動力 內部子 穩定子 邊緣子 奇偶性
	var around_X = [-1, 0, 1,1,1,0,-1,-1],
		around_Y = [-1,-1,-1,0,1,1, 1, 0],
		tmpX,
		tmpY;
	var inter=0,mobil=0,parity=0,
		stable=0,edge=0;
	var predi = prediction(map,id);
	for(var i=0;i<predi.length;i++){
		mobil+=edge_table[(predi[i].y)][(predi[i].x)];
	}
	for(var x=0;x<8;x++){
		for(var y=0;y<8;y++){
			var check_inter = true;
			if(map[y][x]==id){
				for(var i=0;i<8;i++){
					tmpY = (y+around_Y[i]);
					tmpX = (x+around_X[i]);
					if(tmpY>7 || tmpX>7 || tmpY<0 || tmpX<0)
						continue;
					if(map[tmpY][tmpX]==0){
						check_inter = false;
						break;
					}
				}
				if(check_inter) inter++;
				edge+=edge_table[y][x];
				if(step>15)
					stable+=stable_judge(x,y,map,id);
			}else if(map[y][x]==id*-1){
				for(var i=0;i<8;i++){
					tmpY = (y+around_Y[i]);
					tmpX = (x+around_X[i]);
					if(tmpY>7 || tmpX>7 || tmpY<0 || tmpX<0)
						continue;
					if(map[tmpY][tmpX]==0){
						check_inter = false;
						break;
					}
				}
				if(check_inter) inter--;
				edge-=edge_table[y][x];
				if(step>15)
					stable-=stable_judge(x,y,map,id);
			}else if(step>25){
				parity+=parity_judge(x,y,map,id);
			}
		}
	}
	// console.log("id:",id,"mobil:",mobil,"inter:",inter,"stable:",stable,"edge:",edge,"parity:",parity);
	// console.table(prediction(map,id));
	return mobil*w[0]+inter*w[1]+stable*w[2]+edge*w[3]+parity*w[4];
}
function stable_judge(x,y,map,id){
	var around_X = [-1, 0, 1,1,1,0,-1,-1],
		around_Y = [-1,-1,-1,0,1,1, 1, 0],
		tmpX=x,
		tmpY=y;
	var stable_value = 1;
	for(var i=0;i<8;i++){
		if(map[tmpY][tmpX]==id){
			while(tmpX>=0 && tmpX<8 && tmpY>=0 && tmpY<8){
				if(map[tmpY][tmpX]!=id*-1){
					stable_value = 0;
					break;
				}
				tmpX += around_X[i];
				tmpY += around_Y[i];
			}
		}
	}
	return stable_value;
}
function parity_judge(x,y,map,id){
	var around_X = [-1, 0, 1,1,1,0,-1,-1],
		around_Y = [-1,-1,-1,0,1,1, 1, 0],
		tmpX=x,
		tmpY=y;
	var parity=0,tmp;
	if(map[y][x]==0){
		tmp=0;
		for(var i=0;i<8;i++){
			if(tmpX<0 || tmpX>7 || tmpY<0 || tmpY>7)
				continue;
			if(map[tmpY][tmpX]==0){
				tmp++;
			}
			while(tmpX>=0 && tmpX<8 && tmpY>=0 && tmpY<8){
				if(map[tmpY][tmpX]==0){
					tmp = 0;
					break;
				}
				tmpX += around_X[i];
				tmpY += around_Y[i];
			}
			tmpX =x+around_X[i];
			tmpY =y+around_Y[i];
		}
	}
	if(tmp!=0 && tmp%2==0) return 1;
	else return 0;
}


