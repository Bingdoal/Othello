function Board(edge,color){
	if(edge === undefined){edge = 50;}
	if(color === undefined){color = "#000000";}
	this.x = 0;
	this.y = 0;
	this.edge = edge;
	this.color = color;
	this.lineWidth = 5;
}
Board.prototype.draw= function(context,x,y){
	context.save();
	this.x = x;
	this.y = y;
	context.strokeStyle = this.color;
	context.beginPath();
	context.strokeRect(this.x,this.y,this.edge,this.edge);
	context.closePath();
	if(this.lineWidth > 0){
		context.lineWidth = this.lineWidth;
		context.stroke();
	}
		
	context.restore();
}